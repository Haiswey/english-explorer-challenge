import { rosterSearch } from './_lib.js';

// Only Year 2 classes, at least 3 typed letters (the spelling app enforces the same rule).
export default async function handler(req, res) {
  const klass = String(req.query.klass || '').toUpperCase().replace(/[^0-9A-Z]/g, '');
  const q = String(req.query.q || '').trim();
  if (!/^2[A-Z]$/.test(klass) || q.length < 3) return res.status(200).json({ names: [] });
  try { res.status(200).json({ names: (await rosterSearch(klass, q)).slice(0, 8) }); }
  catch { res.status(200).json({ names: [], error: 'Could not load names.' }); }
}
