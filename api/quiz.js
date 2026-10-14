import { publicQuiz, getQuiz, PRACTICE } from './_quiz.js';
import { year2Classes, hasFullMarks } from './_lib.js';

export default async function handler(req, res) {
  const q = req.query || {};
  if (q.level === 'challenge') {
    try {
      if (!(await hasFullMarks(PRACTICE, q.klass, q.name))) {
        return res.status(403).json({ error: 'Get every answer right in the practice test to unlock the challenge.' });
      }
      return res.status(200).json(publicQuiz(getQuiz('challenge')));
    } catch {
      return res.status(500).json({ error: 'The challenge did not load. Try again.' });
    }
  }
  const classes = await year2Classes().catch(() => []);
  res.status(200).json({ ...publicQuiz(PRACTICE), classes });
}
