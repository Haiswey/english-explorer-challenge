import { readBody, checkPin, getResults, deleteResult, getOpenState, setOpen } from './_lib.js';
import { getQuiz, totalOf, QUIZZES, SETS } from './_quiz.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  try {
    const body = await readBody(req);
    const QUIZ = getQuiz(body.set || body.level);
    const role = await checkPin(body.pin);
    if (!role) return res.status(401).json({ error: 'That PIN is not right. Use the teacher PIN from the spelling app.' });
    if (body.action === 'setOpen') { // only the admin can open or close a test for pupils
      if (role !== 'admin') return res.status(403).json({ error: 'Only the admin can open or close tests.' });
      try { await setOpen(String(body.set), body.open === true); } catch (e) { return res.status(400).json({ error: e.message }); }
      return res.status(200).json({ open: await getOpenState() });
    }
    if (body.action === 'delete') {
      if (role !== 'admin') return res.status(403).json({ error: 'Only the admin can delete scores.' });
      await deleteResult(QUIZ.id, body.url);
      return res.status(200).json({ ok: true });
    }
    const results = await getResults(QUIZ.id);
    res.status(200).json({ role, key: QUIZ.key, open: await getOpenState(),
      sets: SETS.map(s => ({ key: s.key, label: s.label, hasQuiz: !!QUIZZES[s.key], linkedTo: s.linkedTo || '' })), testId: QUIZ.id, title: QUIZ.title, total: totalOf(QUIZ), level: QUIZ.level,
      parts: QUIZ.parts.map(p => ({ id: p.id, name: p.name, max: p.qs.length * p.marksEach })), results });
  } catch (e) {
    res.status(500).json({ error: 'Could not finish: ' + e.message });
  }
}
