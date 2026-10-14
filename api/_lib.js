import { createHash } from 'node:crypto';
import { put, list, del } from '@vercel/blob';

// Names and classes come from the KK2 spelling app, so there is only one pupil list to keep up to date.
export const SPELL = 'https://kk2spelling.vercel.app';

export async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') return JSON.parse(req.body || '{}');
  const chunks = []; for await (const c of req) chunks.push(c);
  return JSON.parse(Buffer.concat(chunks).toString() || '{}');
}

let classCache = { at: 0, list: [] };
export async function year2Classes() {
  if (classCache.list.length && Date.now() - classCache.at < 10 * 60 * 1000) return classCache.list;
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const found = await Promise.all(letters.map(async L => {
    try {
      const r = await fetch(`${SPELL}/api/roster?klass=2${L}&q=zzz`, { cache: 'no-store' });
      const j = await r.json();
      return j.hasClass ? '2' + L : null;
    } catch { return null; }
  }));
  const listOut = found.filter(Boolean);
  if (listOut.length) classCache = { at: Date.now(), list: listOut };
  return listOut;
}

export async function rosterSearch(klass, q) {
  const r = await fetch(`${SPELL}/api/roster?klass=${encodeURIComponent(klass)}&q=${encodeURIComponent(q)}`, { cache: 'no-store' });
  const j = await r.json();
  return Array.isArray(j.names) ? j.names : [];
}

// Same teacher PIN as the spelling app (checked by the spelling app itself), or QUIZ_PIN if set in this project.
// Returns 'admin' (the spelling app's admin PIN, or QUIZ_PIN), 'teacher' (any teacher PIN) or null (wrong PIN).
// Teachers may look at scores; only the admin may delete them.
export async function checkPin(pin) {
  pin = String(pin || '').trim();
  if (!pin) return null;
  if (process.env.QUIZ_PIN && pin === process.env.QUIZ_PIN) return 'admin';
  try {
    const r = await fetch(`${SPELL}/api/admin`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin, action: 'load' })
    });
    if (r.status !== 200) return null;
    const j = await r.json().catch(() => ({}));
    return j && j.me && j.me.role === 'admin' ? 'admin' : 'teacher';
  } catch { return null; }
}

export async function saveResult(testId, rec) {
  const safe = String(testId).replace(/[^a-z0-9-]/gi, '');
  await put(`results/${safe}/${Date.now()}.json`, JSON.stringify(rec), {
    access: 'public', addRandomSuffix: true, contentType: 'application/json'
  });
}

// ---- One attempt per pupil ---------------------------------------------------------------------------------------
// The first submit of a pupil leaves a small marker file (no list() needed to check it later). A pupil is the class plus
// the name without capitals or extra spaces. The teacher can allow a retake by deleting the pupil's attempt (it removes
// the marker too). Results saved before markers existed are found by reading the results once a minute.
const normName = s => String(s || '').replace(/\s+/g, ' ').trim().toLowerCase();
const safeId = id => String(id).replace(/[^a-z0-9-]/gi, '');
const attemptKey = (klass, name) => String(klass || '').toUpperCase() + '-' + createHash('sha1').update(normName(name)).digest('hex').slice(0, 24);
const markerPath = (quizId, klass, name) => `attempts/${safeId(quizId)}/${attemptKey(klass, name)}.json`;
function blobUrlFor(pathname) {
  const storeId = String(process.env.BLOB_READ_WRITE_TOKEN || '').split('_')[3] || '';
  if (!storeId) throw new Error('No Blob store id in BLOB_READ_WRITE_TOKEN');
  return `https://${storeId.toLowerCase()}.public.blob.vercel-storage.com/${pathname}`;
}

let legacy = { at: 0, id: '', map: new Map() };
async function legacyAttempt(quiz, klass, name) {
  if (legacy.id !== quiz.id || Date.now() - legacy.at > 60000) {
    const map = new Map();
    for (const r of (await getResults(quiz.id)).sort((a, b) => a.submittedAt - b.submittedAt)) {
      const k = attemptKey(r.klass, r.name);
      if (!map.has(k)) map.set(k, { score: r.score, total: r.total, parts: r.parts });
    }
    legacy = { at: Date.now(), id: quiz.id, map };
  }
  return legacy.map.get(attemptKey(klass, name)) || null;
}

// The pupil's first result for this test, or null when they have not done it yet.
export async function getAttempt(quiz, klass, name) {
  try {
    const r = await fetch(blobUrlFor(markerPath(quiz.id, klass, name)) + '?t=' + Date.now(), { cache: 'no-store' });
    if (r.ok) return await r.json();
  } catch {}
  return legacyAttempt(quiz, klass, name);
}

// Claims the pupil's one attempt. Returns null when claimed, or the earlier result when there already is one.
export async function claimAttempt(quiz, klass, name, summary) {
  const before = await getAttempt(quiz, klass, name);
  if (before) return before;
  try {
    await put(markerPath(quiz.id, klass, name), JSON.stringify(summary), { access: 'public', addRandomSuffix: false, allowOverwrite: false, contentType: 'application/json' });
    return null;
  } catch (e) {
    if (/exist/i.test(String(e && e.message))) return (await getAttempt(quiz, klass, name)) || summary;
    throw e;
  }
}

export async function releaseAttempt(quiz, klass, name) {
  try { await del(blobUrlFor(markerPath(quiz.id, klass, name))); } catch {}
  legacy.at = 0;
}

export async function getResults(testId) {
  const safe = String(testId).replace(/[^a-z0-9-]/gi, '');
  let blobs = [], cursor;
  do {
    const page = await list({ prefix: `results/${safe}/`, cursor, limit: 1000 });
    blobs = blobs.concat(page.blobs); cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  const out = await Promise.all(blobs.map(async b => {
    try {
      const r = await fetch(b.url + '?t=' + Date.now(), { cache: 'no-store' });
      if (!r.ok) return null;
      const j = await r.json();
      return { ...j, _url: b.url };
    } catch { return null; }
  }));
  return out.filter(Boolean);
}

export async function deleteResult(testId, url) {
  const safe = String(testId).replace(/[^a-z0-9-]/gi, '');
  const u = String(url || '');
  if (!/^https:\/\/[a-z0-9]+\.public\.blob\.vercel-storage\.com\//i.test(u) || !u.includes(`/results/${safe}/`)) throw new Error('That is not a result from this quiz.');
  let rec = null;
  try { const r = await fetch(u + '?t=' + Date.now(), { cache: 'no-store' }); if (r.ok) rec = await r.json(); } catch {}
  await del(u);
  if (rec && rec.klass && rec.name) await releaseAttempt({ id: testId }, rec.klass, rec.name);
}

// A pupil unlocks the challenge level by scoring every mark in the practice test.
export async function hasFullMarks(practice, klass, name) {
  const k = String(klass || '').trim().toUpperCase(), n = normName(name);
  if (!k || !n) return false;
  const all = await getResults(practice.id);
  return all.some(r => r.klass === k && normName(r.name) === n && r.score === r.total);
}
