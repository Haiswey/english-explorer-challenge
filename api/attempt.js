import { getQuiz } from './_quiz.js';
import { getAttempt, isTestPupil } from './_lib.js';

// Has this pupil already done the test? (one attempt each) Returns their first result if so.
export default async function handler(req, res) {
  const q = req.query || {};
  const klass = String(q.klass || '').trim().toUpperCase().slice(0, 4);
  const name = String(q.name || '').trim().slice(0, 80);
  if (!klass || !name) return res.status(200).json({ done: false });
  if (isTestPupil(name)) return res.status(200).json({ done: false }); // test pupils can always start again
  try {
    const result = await getAttempt(getQuiz(q.set || q.level), klass, name);
    res.status(200).json(result ? { done: true, result: { score: result.score, total: result.total, parts: result.parts } } : { done: false });
  } catch { res.status(200).json({ done: false }); }
}
