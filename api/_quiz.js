// English Explorer Challenge. Super Minds 1, Units 5-9
// (vocabulary and grammar from the Teacher's Book map of the course).
// Answers stay on the server; /api/quiz sends the questions without them.
//
// Two levels:
//   practice  ("Let's practice!")  35 marks. A pupil who scores every mark unlocks the challenge.
//   challenge ("Challenge level")  39 marks. Harder words, whole-word spelling, grammar, longer sentences.
// Part kinds: choose (tap a word), letters (type letters into the gaps), gap (tap the word that fits the
// sentence), build (tap word tiles in order).

export const PRACTICE = {
  id: 'mock-easy-3', level: 'practice',
  title: 'English Explorer Challenge',
  subtitle: "Let's practice!",
  parts: [
    {
      id: 'A', kind: 'choose', name: 'Vocabulary', marksEach: 1,
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
      id: 'B', kind: 'letters', name: 'Spelling', marksEach: 2,
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
      id: 'D', kind: 'build', name: 'Sentence building', marksEach: 3,
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

export const CHALLENGE = {
  id: 'challenge-1', level: 'challenge',
  title: 'English Explorer Challenge',
  subtitle: 'Challenge level',
  parts: [
    {
      id: 'A', kind: 'choose', name: 'Vocabulary', marksEach: 1,
      help: 'Look at the picture. Tap the correct word.',
      qs: [
        { id: 'A1', pic: '1F47B', alt: 'a ghost', ans: 'ghost', opts: ['ghost', 'monster', 'robot'] },
        { id: 'A2', pic: '1F9E5', alt: 'a jacket', ans: 'jacket', opts: ['jacket', 'sweater', 'skirt'] },
        { id: 'A3', pic: '1F980', alt: 'a crab', ans: 'crab', opts: ['crab', 'shell', 'fish'] },
        { id: 'A4', pic: '26F5', alt: 'a boat on the sea', ans: 'boat', opts: ['boat', 'bucket', 'kite'] },
        { id: 'A5', pic: '2600', alt: 'the sun', ans: 'sun', opts: ['sun', 'sea', 'sand'] },
        { id: 'A6', pic: '1F6B2', alt: 'a bicycle', ans: 'ride a bike', opts: ['ride a bike', 'play chess', 'take a photo'] }
      ]
    },
    {
      // Whole word: every letter is typed. One mark if exactly one letter is wrong.
      id: 'B', kind: 'letters', exact: true, name: 'Spelling', marksEach: 2,
      help: 'Look at the picture. Type the whole word.',
      qs: [
        { id: 'B1', pic: '1F457', alt: 'a dress', word: 'dress' },
        { id: 'B2', pic: '1F916', alt: 'a robot', word: 'robot' },
        { id: 'B3', pic: '1F3D6', alt: 'a beach with an umbrella', word: 'beach' },
        { id: 'B4', pic: '1F47B', alt: 'a ghost', word: 'ghost' },
        { id: 'B5', pic: '1F4F7', alt: 'a camera', word: 'camera' },
        { id: 'B6', pic: '1F3B8', alt: 'a guitar', word: 'guitar' }
      ]
    },
    {
      id: 'C', kind: 'gap', name: 'Grammar', marksEach: 1,
      help: 'Tap the word that fits the sentence.',
      qs: [
        { id: 'C1', pic: '1F47B', alt: 'a ghost', text: 'There ___ a ghost in the attic.', ans: 'is', opts: ['is', 'are', 'am'] },
        { id: 'C2', pic: '1F9E6', alt: 'socks', text: 'I am wearing red ___.', ans: 'socks', opts: ['socks', 'sock', 'a sock'] },
        { id: 'C3', pic: '1F3B8', alt: 'a guitar', text: 'I can ___ the guitar.', ans: 'play', opts: ['play', 'plays', 'playing'] },
        { id: 'C4', pic: '1F457', alt: 'a dress', text: 'She ___ wearing a dress.', ans: 'is', opts: ['is', 'are', 'am'] },
        { id: 'C5', pic: '1F916', alt: 'a robot', text: 'The robot ___ dance.', ans: 'can', opts: ['can', 'is', 'am'] },
        { id: 'C6', pic: '1F6B2', alt: 'a bicycle', text: "Let's ___ our bikes.", ans: 'ride', opts: ['ride', 'rides', 'riding'] }
      ]
    },
    {
      id: 'D', kind: 'build', name: 'Sentence building', marksEach: 3,
      help: 'Tap the words in the correct order to make a sentence.',
      qs: [
        { id: 'D1', pic: '1F916', alt: 'a robot', ans: ['The', 'robot', 'can', 'walk', 'and', 'talk', '.'] },
        { id: 'D2', pic: '1F980', alt: 'a crab', ans: ['The', 'crab', 'is', 'on', 'the', 'beach', '.'] },
        { id: 'D3', pic: '1F47B', alt: 'a ghost', ans: ['There', 'is', 'a', 'ghost', 'in', 'the', 'attic', '.'] },
        { id: 'D4', pic: '1F457', alt: 'a dress', ans: ['She', 'is', 'wearing', 'a', 'new', 'dress', '.'] },
        { id: 'D5', pic: '1F6B2', alt: 'a bicycle', ans: ['I', 'ride', 'my', 'bike', 'in', 'the', 'park', '.'] }
      ]
    }
  ]
};

export const QUIZZES = { practice: PRACTICE, challenge: CHALLENGE };
export const getQuiz = level => (level === 'challenge' ? CHALLENGE : PRACTICE);
export const totalOf = quiz => quiz.parts.reduce((s, p) => s + p.qs.length * p.marksEach, 0);

// Words that always keep a capital letter (I, days of the week). The first word is capitalised too.
const capsOf = ans => ans.filter((w, i) => /^[A-Z]/.test(w) && (i > 0 || w === 'I'));
const capFirst = w => w.charAt(0).toUpperCase() + w.slice(1);
const showWords = (words, caps) => words.map((w, i) => {
  const lw = w.toLowerCase();
  return i === 0 || caps.some(c => c.toLowerCase() === lw) ? capFirst(lw) : lw;
});

export function publicQuiz(quiz = PRACTICE) {
  return {
    id: quiz.id, level: quiz.level, title: quiz.title, subtitle: quiz.subtitle, total: totalOf(quiz),
    parts: quiz.parts.map(p => ({
      id: p.id, kind: p.kind, name: p.name, marksEach: p.marksEach, help: p.help,
      qs: p.qs.map(q => {
        if (p.kind === 'choose') return { id: q.id, pic: q.pic, alt: q.alt, opts: q.opts };
        if (p.kind === 'gap') return { id: q.id, pic: q.pic, alt: q.alt, text: q.text, opts: q.opts };
        if (p.kind === 'letters') {
          const blanks = q.blanks || q.word.split('').map((_, i) => i);
          return { id: q.id, pic: q.pic, alt: q.alt, len: q.word.length, blanks,
            shown: q.word.split('').map((c, i) => blanks.includes(i) ? '' : c) };
        }
        // Word tiles are sent in lower case so a capital letter does not show which word is first.
        return { id: q.id, pic: q.pic, alt: q.alt, tiles: q.ans.map(w => w.toLowerCase()), caps: capsOf(q.ans) };
      })
    }))
  };
}

export function mark(quiz, answers) {
  const a = answers && typeof answers === 'object' ? answers : {};
  const rows = []; const parts = {};
  for (const p of quiz.parts) {
    parts[p.id] = 0;
    for (const q of p.qs) {
      const given = a[q.id];
      let got = 0, correct, shown;
      if (p.kind === 'choose' || p.kind === 'gap') {
        shown = typeof given === 'string' ? given.slice(0, 40) : '';
        correct = q.ans;
        got = shown === q.ans ? 1 : 0;
      } else if (p.kind === 'letters') {
        const blanks = q.blanks || q.word.split('').map((_, i) => i);
        const letters = Array.isArray(given) ? given.map(x => String(x || '').trim().slice(0, 1).toLowerCase()) : [];
        shown = q.word.split('').map((c, i) => {
          const k = blanks.indexOf(i);
          return k < 0 ? c : (letters[k] || '_');
        }).join('');
        correct = q.word;
        const right = blanks.filter((pos, k) => letters[k] === q.word[pos]).length;
        if (p.exact) got = right === blanks.length ? p.marksEach : (right === blanks.length - 1 ? 1 : 0);
        else got = right;
      } else {
        const tiles = Array.isArray(given) ? given.map(x => String(x || '').slice(0, 20).toLowerCase()) : [];
        const n = q.ans.length;
        const right = q.ans.filter((w, i) => tiles[i] === w.toLowerCase()).length;
        got = (right === n && tiles.length === n) ? p.marksEach : Math.min(p.marksEach - 1, Math.floor(p.marksEach * right / n));
        shown = showWords(tiles, capsOf(q.ans)).join(' ').replace(/ \./g, '.');
        correct = q.ans.join(' ').replace(/ \./g, '.');
      }
      parts[p.id] += got;
      rows.push({ q: q.id, part: p.id, given: shown, correct, got, max: p.marksEach });
    }
  }
  const score = Object.values(parts).reduce((s, x) => s + x, 0);
  return { score, total: totalOf(quiz), parts, rows };
}
