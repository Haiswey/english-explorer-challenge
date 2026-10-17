import { publicQuiz, QUIZZES, SETS } from './_quiz.js';
import { year2Classes, hasFullMarks, getOpenState } from './_lib.js';

// GET /api/quiz                          -> the class list and the tests that are OPEN for pupils (no questions)
// GET /api/quiz?set=practice1|practice2  -> the questions of that test (only while it is open)
// GET /api/quiz?set=challenge|challenge2&klass=&name= -> that challenge's questions, for a pupil who scored every mark in its practice set
export default async function handler(req, res) {
  const q = req.query || {};
  const state = await getOpenState();
  const key = q.set || (q.level === 'challenge' ? 'challenge' : '');
  const quiz = key ? QUIZZES[key] : null;
  if (key && !quiz) return res.status(404).json({ error: 'There is no such test.' });
  if (quiz && quiz.after) { // a challenge: only for a pupil who scored every mark in its practice set
    try {
      if (!state[key].open) return res.status(403).json({ error: 'The challenge is closed now.', closed: true });
      if (!(await hasFullMarks(q.klass, q.name, quiz.after))) {
        return res.status(403).json({ error: 'Get every answer right in the practice set to unlock the challenge.' });
      }
      return res.status(200).json(publicQuiz(quiz));
    } catch {
      return res.status(500).json({ error: 'The challenge did not load. Try again.' });
    }
  }
  if (quiz) {
    if (!state[key].open) return res.status(403).json({ error: 'This test is closed now.', closed: true });
    return res.status(200).json(publicQuiz(quiz));
  }
  const classes = await year2Classes().catch(() => []);
  const sets = SETS.filter(s => s.ready && !QUIZZES[s.key].after && state[s.key].open).map(s => ({ key: s.key, label: s.label }));
  res.status(200).json({ classes, sets });
}
