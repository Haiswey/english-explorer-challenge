import { readBody, saveResult, rosterSearch, year2Classes, hasFullMarks, getAttempt, claimAttempt, releaseAttempt } from './_lib.js';
import { PRACTICE, getQuiz, mark } from './_quiz.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  try {
    const body = await readBody(req);
    const name = String(body.name || '').trim().slice(0, 80);
    const klass = String(body.klass || '').trim().toUpperCase().slice(0, 4);
    if (!name || !klass) return res.status(400).json({ error: 'Choose your class and name first.' });

    const QUIZ = getQuiz(body.level);
    if (QUIZ.level === 'challenge' && !(await hasFullMarks(PRACTICE, klass, name))) {
      return res.status(403).json({ error: 'The challenge is for pupils who got every answer right in the practice test.' });
    }

    // One attempt only: a second submit (another device, a reload, a retake) gets the pupil's first result back.
    const first = await getAttempt(QUIZ, klass, name);
    if (first) return res.status(409).json({ already: true, score: first.score, total: first.total, parts: first.parts });

    let verified = null;
    try {
      const classes = await year2Classes();
      // The roster search matches the start of the pupil's FIRST word only, so search with that word.
      const word = name.split(/\s+/)[0];
      const names = classes.includes(klass) ? await rosterSearch(klass, word) : [];
      const want = name.replace(/\s+/g, ' ').toLowerCase();
      verified = names.some(n => n.replace(/\s+/g, ' ').trim().toLowerCase() === want);
    } catch { verified = null; } // name list unreachable: keep the answers, mark as unchecked

    const m = mark(QUIZ, body.answers);
    const now = Date.now();
    const startedAt = Math.min(now, Number(body.startedAt) || now);
    const rec = {
      testId: QUIZ.id, title: QUIZ.title, name, klass, verified,
      score: m.score, total: m.total, parts: m.parts, rows: m.rows,
      startedAt, submittedAt: now, seconds: Math.round((now - startedAt) / 1000)
    };
    const summary = { score: m.score, total: m.total, parts: m.parts };
    const earlier = await claimAttempt(QUIZ, klass, name, summary);
    if (earlier) return res.status(409).json({ already: true, score: earlier.score, total: earlier.total, parts: earlier.parts });
    try { await saveResult(QUIZ.id, rec); }
    catch (e) { await releaseAttempt(QUIZ, klass, name); throw e; } // not saved: let the pupil submit again
    res.status(200).json(summary);
  } catch (e) {
    res.status(500).json({ error: 'Your answers were not saved. Tap Submit again, or tell your teacher.' });
  }
}
