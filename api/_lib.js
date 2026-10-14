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
export async function checkPin(pin) {
  pin = String(pin || '').trim();
  if (!pin) return false;
  if (process.env.QUIZ_PIN && pin === process.env.QUIZ_PIN) return true;
  try {
    const r = await fetch(`${SPELL}/api/admin`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin, action: 'load' })
    });
    return r.status === 200;
  } catch { return false; }
}

export async function saveResult(testId, rec) {
  const safe = String(testId).replace(/[^a-z0-9-]/gi, '');
  await put(`results/${safe}/${Date.now()}.json`, JSON.stringify(rec), {
    access: 'public', addRandomSuffix: true, contentType: 'application/json'
  });
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
  await del(u);
}
