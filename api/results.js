import { readBody, checkPin, getResults, deleteResult } from './_lib.js';
import { getQuiz, totalOf } from './_quiz.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  try {
    const body = await readBody(req);
    const QUIZ = getQuiz(body.level);
    if (!(await checkPin(body.pin))) return res.status(401).json({ error: 'That PIN is not right. Use the teacher PIN from the spelling app.' });
    if (body.action === 'delete') {
      await deleteResult(QUIZ.id, body.url);
      return res.status(200).json({ ok: true });
    }
    const results = await getResults(QUIZ.id);
    res.status(200).json({ testId: QUIZ.id, title: QUIZ.title, total: totalOf(QUIZ), level: QUIZ.level,
      parts: QUIZ.parts.map(p => ({ id: p.id, name: p.name, max: p.qs.length * p.marksEach })), results });
  } catch (e) {
    res.status(500).json({ error: 'Could not finish: ' + e.message });
  }
}
