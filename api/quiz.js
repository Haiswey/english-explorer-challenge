import { publicQuiz } from './_quiz.js';
import { year2Classes } from './_lib.js';

export default async function handler(req, res) {
  const classes = await year2Classes().catch(() => []);
  res.status(200).json({ ...publicQuiz(), classes });
}
