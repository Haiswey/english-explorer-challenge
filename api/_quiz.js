// English Explorer Challenge, mock test (easy level). Super Minds 1, Units 5-9
// (vocabulary and grammar from the Teacher's Book map of the course).
// Answers stay on the server; /api/quiz sends the questions without them.
export const QUIZ = {
  id: 'mock-easy-3',
  title: 'English Explorer Challenge',
  subtitle: 'Mock test',
  parts: [
    {
      id: 'A', name: 'Vocabulary', marksEach: 1,
      help: 'Look at the picture. Tap the correct word.',
      qs: [
        { id: 'A1', pic: '1F6C1', alt: 'a bathtub', ans: 'bathroom', opts: ['bathroom', 'bedroom', 'kitchen'] },
        { id: 'A2', pic: '1F9D1-200D-1F373', alt: 'a cook in a kitchen', ans: 'kitchen', opts: ['kitchen', 'dining room', 'cellar'] },
        { id: 'A3', pic: '1F9E6', alt: 'socks', ans: 'socks', opts: ['socks', 'shoes', 'shorts'] },
        { id: 'A4', pic: '1F9E2', alt: 'a cap', ans: 'cap', opts: ['cap', 'skirt', 'sweater'] },
        { id: 'A5', pic: '270B', alt: 'a hand', ans: 'hand', opts: ['hand', 'foot', 'knee'] },
        { id: 'A6', pic: '1F463', alt: 'footprints', ans: 'foot', opts: ['foot', 'arm', 'head'] },
        { id: 'A7', pic: '1F366', alt: 'an ice cream', ans: 'eat ice cream', opts: ['eat ice cream', 'read a book', 'take a photo'] },
        { id: 'A8', pic: '1F3A3', alt: 'a fishing rod and fish', ans: 'catch a fish', opts: ['catch a fish', 'paint a picture', 'listen to music'] }
      ]
    },
    {
      id: 'B', name: 'Spelling', marksEach: 2,
      help: 'Look at the picture. Type the missing letters.',
      qs: [
        { id: 'B1', pic: '1F6CF', alt: 'a bed', word: 'bedroom', blanks: [4, 5] },
        { id: 'B2', pic: '1F456', alt: 'jeans', word: 'jeans', blanks: [1, 4] },
        { id: 'B3', pic: '1F45F', alt: 'a shoe', word: 'shoes', blanks: [2, 3] },
        { id: 'B4', pic: '1F464', alt: 'a head', word: 'head', blanks: [1, 2] },
        { id: 'B5', pic: '1F41A', alt: 'a shell', word: 'shells', blanks: [2, 5] },
        { id: 'B6', pic: '1F4D6', alt: 'a book', word: 'book', blanks: [1, 2] }
      ]
    },
    {
      id: 'D', name: 'Sentence building', marksEach: 3,
      help: 'Tap the words in the correct order to make a sentence.',
      qs: [
        { id: 'D1', pic: '26BD', alt: 'a football', ans: ['I', 'play', 'football', 'on', 'Saturdays', '.'] },
        { id: 'D2', pic: '1F47E', alt: 'a monster', ans: ['There', 'is', 'a', 'monster', 'in', 'the', 'cellar', '.'] },
        { id: 'D3', pic: '1F455', alt: 'a red shirt', ans: ['I', 'am', 'wearing', 'a', 'red', 'shirt', '.'] },
        { id: 'D4', pic: '1F9A9', alt: 'a flamingo standing on one leg', ans: ['I', 'can', 'stand', 'on', 'one', 'leg', '.'] },
        { id: 'D5', pic: '1F3B8', alt: 'a guitar', ans: ["Let's", 'play', 'the', 'guitar', '.'] }
      ]
    }
  ]
};

export const TOTAL = QUIZ.parts.reduce((s, p) => s + p.qs.length * p.marksEach, 0);

const capsOf = ans => ans.filter((w, i) => /^[A-Z]/.test(w) && (i > 0 || w === 'I'));
// Same rule the pupil page uses: first word and words in `caps` get a capital letter.
const capFirst = w => w.charAt(0).toUpperCase() + w.slice(1);
const showWords = (words, caps) => words.map((w, i) => {
  const lw = w.toLowerCase();
  return i === 0 || caps.some(c => c.toLowerCase() === lw) ? capFirst(lw) : lw;
});

export function publicQuiz() {
  return {
    id: QUIZ.id, title: QUIZ.title, subtitle: QUIZ.subtitle, total: TOTAL,
    parts: QUIZ.parts.map(p => ({
      id: p.id, name: p.name, marksEach: p.marksEach, help: p.help,
      qs: p.qs.map(q => {
        if (p.id === 'A') return { id: q.id, pic: q.pic, alt: q.alt, opts: q.opts };
        if (p.id === 'B') return {
          id: q.id, pic: q.pic, alt: q.alt, len: q.word.length, blanks: q.blanks,
          shown: q.word.split('').map((c, i) => q.blanks.includes(i) ? '' : c)
        };
        // Word tiles are sent in lower case so a capital letter does not show which word is first.
        // `caps` lists the words that always keep a capital letter (I, days of the week).
        return { id: q.id, pic: q.pic, alt: q.alt, tiles: q.ans.map(w => w.toLowerCase()), caps: capsOf(q.ans) };
      })
    }))
  };
}

export function mark(answers) {
  const a = answers && typeof answers === 'object' ? answers : {};
  const rows = []; const parts = {};
  for (const p of QUIZ.parts) {
    parts[p.id] = 0;
    for (const q of p.qs) {
      const given = a[q.id];
      let got = 0, correct, shown;
      if (p.id === 'A') {
        shown = typeof given === 'string' ? given.slice(0, 40) : '';
        correct = q.ans;
        got = shown === q.ans ? 1 : 0;
      } else if (p.id === 'B') {
        const letters = Array.isArray(given) ? given.map(x => String(x || '').trim().slice(0, 1).toLowerCase()) : [];
        const word = q.word.split('').map((c, i) => {
          const k = q.blanks.indexOf(i);
          return k < 0 ? c : (letters[k] || '_');
        }).join('');
        q.blanks.forEach((pos, k) => { if (letters[k] === q.word[pos]) got++; });
        shown = word; correct = q.word;
      } else {
        const tiles = Array.isArray(given) ? given.map(x => String(x || '').slice(0, 20).toLowerCase()) : [];
        const n = q.ans.length;
        const right = q.ans.filter((w, i) => tiles[i] === w.toLowerCase()).length;
        got = (right === n && tiles.length === n) ? 3 : Math.min(2, Math.floor(3 * right / n));
        shown = showWords(tiles, capsOf(q.ans)).join(' ').replace(/ \./g, '.');
        correct = q.ans.join(' ').replace(/ \./g, '.');
      }
      parts[p.id] += got;
      rows.push({ q: q.id, part: p.id, given: shown, correct, got, max: p.marksEach });
    }
  }
  const score = Object.values(parts).reduce((s, x) => s + x, 0);
  return { score, total: TOTAL, parts, rows };
}
