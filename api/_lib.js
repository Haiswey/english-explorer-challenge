import { createHash } from 'node:crypto';
import { put, list, del } from '@vercel/blob';
import { QUIZZES, SETS } from './_quiz.js';

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
  if (classCache.list.length && Date.now() - classCache.at < 60 * 60 * 1000) return classCache.list;
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
// Five test pupils per class, so a teacher can try the quiz exactly as a pupil sees it. They are NOT real pupils:
// nothing is saved for them (no result, no marker), they can do every test again and again, and they can always enter a challenge.
export const TEST_NAMES = [1, 2, 3, 4, 5].map(n => 'Test Pupil ' + n);
export const isTestPupil = name => TEST_NAMES.some(t => normName(t) === normName(name));
// Shown in the name search only when the teacher types "test" (4 letters or more), so real pupils never see them.
export const testNames = q => { const s = normName(q); return s.length >= 4 ? TEST_NAMES.filter(t => normName(t).startsWith(s)) : []; };
const attemptKey = (klass, name) => String(klass || '').toUpperCase() + '-' + createHash('sha1').update(normName(name)).digest('hex').slice(0, 24);
const markerPath = (quizId, klass, name) => `attempts/${safeId(quizId)}/${attemptKey(klass, name)}.json`;
function blobUrlFor(pathname) {
  const storeId = String(process.env.BLOB_READ_WRITE_TOKEN || '').split('_')[3] || '';
  if (!storeId) throw new Error('No Blob store id in BLOB_READ_WRITE_TOKEN');
  return `https://${storeId.toLowerCase()}.public.blob.vercel-storage.com/${pathname}`;
}

// Results saved before markers existed get their marker ONCE: the first pupil request after the update lists the
// results one time, writes the missing markers and a "done" flag, and from then on no pupil request ever lists.
// A marker holds the pupil's FIRST result (what they see) and `full` = any attempt had every mark (the challenge unlock).
const doneFlagPath = quiz => `attempts/${safeId(quiz.id)}/_done.json`;
const backfilled = new Set();
async function readJson(path) {
  try {
    const r = await fetch(blobUrlFor(path) + '?t=' + Date.now(), { cache: 'no-store' });
    return r.ok ? await r.json() : null;
  } catch { return null; }
}
async function ensureBackfilled(quiz) {
  if (backfilled.has(quiz.id)) return;
  if (await readJson(doneFlagPath(quiz))) { backfilled.add(quiz.id); return; }
  const byPupil = new Map();
  for (const r of (await getResults(quiz.id)).sort((a, b) => a.submittedAt - b.submittedAt)) {
    const k = attemptKey(r.klass, r.name), cur = byPupil.get(k);
    if (!cur) byPupil.set(k, { klass: r.klass, name: r.name, score: r.score, total: r.total, parts: r.parts, full: r.score === r.total });
    else if (r.score === r.total) cur.full = true;
  }
  for (const p of byPupil.values()) {
    if (await readJson(markerPath(quiz.id, p.klass, p.name))) continue;
    await put(markerPath(quiz.id, p.klass, p.name), JSON.stringify({ score: p.score, total: p.total, parts: p.parts, full: p.full }), { access: 'public', addRandomSuffix: false, allowOverwrite: false, contentType: 'application/json' });
  }
  await put(doneFlagPath(quiz), JSON.stringify({ at: Date.now() }), { access: 'public', addRandomSuffix: false, allowOverwrite: true, contentType: 'application/json' });
  backfilled.add(quiz.id);
}

// The pupil's first result for this test (with `full`), or null when they have not done it yet. Only cheap reads.
export async function getAttempt(quiz, klass, name) {
  const found = await readJson(markerPath(quiz.id, klass, name));
  if (found) return found;
  await ensureBackfilled(quiz);
  return readJson(markerPath(quiz.id, klass, name));
}

// Claims the pupil's one attempt. Returns null when claimed, or the earlier result when there already is one.
export async function claimAttempt(quiz, klass, name, summary) {
  const before = await getAttempt(quiz, klass, name);
  if (before) return before;
  try {
    await put(markerPath(quiz.id, klass, name), JSON.stringify({ ...summary, full: summary.score === summary.total }), { access: 'public', addRandomSuffix: false, allowOverwrite: false, contentType: 'application/json' });
    return null;
  } catch (e) {
    if (/exist/i.test(String(e && e.message))) return (await getAttempt(quiz, klass, name)) || summary;
    throw e;
  }
}

export async function releaseAttempt(quiz, klass, name) {
  try { await del(blobUrlFor(markerPath(quiz.id, klass, name))); } catch {}
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

// A pupil unlocks a challenge by scoring every mark in ITS practice set (challenge <- practice1, challenge2 <- practice2).
// `practiceKey` is the `after` of the challenge. (Cheap: one marker read.)
export async function hasFullMarks(klass, name, practiceKey) {
  const k = String(klass || '').trim().toUpperCase(), n = normName(name);
  const quiz = QUIZZES[practiceKey];
  if (!k || !n || !quiz) return false;
  const a = await getAttempt(quiz, k, n);
  return !!(a && (a.full === true || a.score === a.total));
}

// ---- Open / close: which tests pupils can start ------------------------------------------------------------------
// ONE small file at a fixed address (a plain fetch to read, one put to change). Missing = the defaults in SETS.
const OPEN_PATH = 'config/open.json';
export async function getOpenState() {
  const saved = (await readJson(OPEN_PATH)) || {};
  const out = {};
  for (const s of SETS) {
    const v = saved[s.key];
    out[s.key] = v && typeof v.open === 'boolean' ? { open: v.open, at: v.at || 0 } : { open: s.openByDefault, at: 0 };
  }
  // A challenge is linked to its practice set: it is open exactly when the practice set is open.
  for (const s of SETS) if (s.linkedTo) out[s.key] = { ...out[s.linkedTo] };
  return out;
}
export async function setOpen(key, open) {
  const set = SETS.find(s => s.key === key);
  if (!set) throw new Error('Unknown test.');
  if (set.linkedTo) key = set.linkedTo; // opening or closing a challenge changes its practice set (and so both)
  const state = await getOpenState();
  state[key] = { open: !!open, at: Date.now() };
  await put(OPEN_PATH, JSON.stringify(state), { access: 'public', addRandomSuffix: false, allowOverwrite: true, contentType: 'application/json', cacheControlMaxAge: 60 });
  return state;
}
// Closing stops NEW starts. A pupil who started before it closed may still hand in (for up to 2 hours).
export function mayHandIn(state, key, startedAt) {
  const s = state[key];
  if (!s || s.open) return true;
  return Number(startedAt) > 0 && Number(startedAt) < s.at && Date.now() - s.at < 2 * 3600 * 1000;
}
