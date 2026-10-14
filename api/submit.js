import { readBody, saveResult, rosterSearch, year2Classes } from './_lib.js';
import { QUIZ, mark } from './_quiz.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  try {
    const body = await readBody(req);
    const name = String(body.name || '').trim().slice(0, 80);
    const klass = String(body.klass || '').trim().toUpperCase().slice(0, 4);
    if (!name || !klass) return res.status(400).json({ error: 'Choose your class and name first.' });

    let verified = null;
    try {
      const classes = await year2Classes();
      const names = classes.includes(klass) ? await rosterSearch(klass, name) : [];
      verified = names.includes(name);
    } catch { verified = null; } // name list unreachable: keep the answers, mark as unchecked

    const m = mark(body.answers);
    const now = Date.now();
    const startedAt = Math.min(now, Number(body.startedAt) || now);
    const rec = {
      testId: QUIZ.id, title: QUIZ.title, name, klass, verified,
      score: m.score, total: m.total, parts: m.parts, rows: m.rows,
      startedAt, submittedAt: now, seconds: Math.round((now - startedAt) / 1000)
    };
    await saveResult(QUIZ.id, rec);
    res.status(200).json({ score: m.score, total: m.total, parts: m.parts });
  } catch (e) {
    res.status(500).json({ error: 'Your answers were not saved. Tap Submit again, or tell your teacher.' });
  }
}
