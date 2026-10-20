// English Explorer Challenge. Super Minds 1, Units 5-9
// (vocabulary and grammar from the Teacher's Book map of the course).
// Answers stay on the server; /api/quiz sends the questions without them.
//
// Tests (each pupil does each test once):
//   practice1  "Practice set 1"   35 marks. (the first test; keeps its old results id)
//   practice2  "Practice set 2"   37 marks. Spelling = type the WHOLE word on plain lines, no letter hints.
//   challenge  "Challenge for set 1"  39 marks. Opens for pupils who scored every mark in Practice set 1.
//   challenge2 "Challenge for set 2"  39 marks. Opens for pupils who scored every mark in Practice set 2.
//   real       "Real quiz"        60 marks, 5 parts (see REAL). Closed until the admin opens it.
// Part kinds: choose (tap a word), letters (type letters into the gaps), word (type the whole word on lines),
// gap (tap the word that fits the sentence), build (tap word tiles in order).

export const PRACTICE = {
  id: 'mock-easy-3', key: 'practice1', level: 'practice', next: 'challenge',
  title: 'English Explorer Challenge',
  subtitle: 'Practice set 1',
  parts: [
    {
      id: 'A', kind: 'choose', name: 'Vocabulary', marksEach: 1,
      help: 'Look at the picture. Tap the correct word.',
      qs: [
        { id: 'A1', pic: '1F6C1', alt: 'a bathroom', ans: 'bathroom', opts: ['bathroom', 'bedroom', 'kitchen'] },
        { id: 'A2', pic: '1F9D1-200D-1F373', alt: 'a kitchen', ans: 'kitchen', opts: ['kitchen', 'dining room', 'cellar'] },
        { id: 'A3', pic: '1F9E6', alt: 'socks', ans: 'socks', opts: ['socks', 'shoes', 'shorts'] },
        { id: 'A4', pic: '1F9E2', alt: 'a cap', ans: 'cap', opts: ['cap', 'skirt', 'sweater'] },
        { id: 'A5', pic: '270B', alt: 'a hand', ans: 'hand', opts: ['hand', 'foot', 'knee'] },
        { id: 'A6', pic: '1F463', alt: 'a foot', ans: 'foot', opts: ['foot', 'arm', 'head'] },
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
        { id: 'B3', pic: '1F45F', alt: 'shoes', word: 'shoes', blanks: [2, 3] },
        { id: 'B4', pic: '1F464', alt: 'a head', word: 'head', blanks: [1, 2] },
        { id: 'B5', pic: '1F41A', alt: 'shells', word: 'shells', blanks: [2, 5] },
        { id: 'B6', pic: '1F4D6', alt: 'a book', word: 'book', blanks: [1, 2] }
      ]
    },
    {
      id: 'D', kind: 'build', name: 'Sentence building', marksEach: 3,
      help: 'Tap the words in the correct order to make a sentence.',
      qs: [
        { id: 'D1', pic: '26BD', alt: 'a football', ans: ['I', 'like', 'to', 'play', 'football', '.'] },
        { id: 'D2', pic: '1F47E', alt: 'a monster in the cellar', ans: ['I', 'can', 'see', 'a', 'green', 'monster', '.'] },
        { id: 'D3', pic: '1F455', alt: 'a red shirt', ans: ['I', 'am', 'wearing', 'a', 'red', 'shirt', '.'] },
        { id: 'D4', pic: '1F9A9', alt: 'a child standing on one leg', ans: ['I', 'can', 'stand', 'on', 'one', 'leg', '.'] },
        { id: 'D5', pic: '1F3B8', alt: 'a guitar', ans: ["Let's", 'play', 'the', 'guitar', '.'] }
      ]
    }
  ]
};

export const PRACTICE2 = {
  id: 'practice-set-2', key: 'practice2', level: 'practice', next: 'challenge2',
  title: 'English Explorer Challenge',
  subtitle: 'Practice set 2',
  parts: [
    {
      // Words come from the school's Year 2 spelling list (Topics 5-9, incl. habitats and animals).
      // Different words and sentences from Practice set 1.
      id: 'A', kind: 'choose', name: 'Vocabulary', marksEach: 1,
      help: 'Look at the picture. Tap the correct word.',
      qs: [
        { id: 'A1', pic: '1F4F7', alt: 'a camera', ans: 'take a photo', opts: ['take a photo', 'paint a picture', 'listen to music'] },
        { id: 'A2', pic: '1F3F0', alt: 'a sandcastle with a bucket and spade', ans: 'make a sandcastle', opts: ['make a sandcastle', 'look for shells', 'play in the sun'] },
        { id: 'A3', pic: '1F455', alt: 'a T-shirt', ans: 'T-shirt', opts: ['T-shirt', 'skirt', 'trousers'] },
        { id: 'A4', pic: 'DESERT', alt: 'a desert', ans: 'desert', opts: ['desert', 'jungle', 'ocean'] },
        { id: 'A5', pic: 'JUNGLE', alt: 'a jungle', ans: 'jungle', opts: ['jungle', 'mountains', 'desert'] },
        { id: 'A6', pic: 'OCEAN', alt: 'the ocean', ans: 'ocean', opts: ['ocean', 'desert', 'rocks'] },
        { id: 'A7', pic: 'PENGUIN', alt: 'a penguin', ans: 'penguin', opts: ['penguin', 'polar bear', 'parrot'] },
        { id: 'A8', pic: '1F916', alt: 'a robot', ans: 'robot', opts: ['robot', 'giraffe', 'kangaroo'] }
      ]
    },
    {
      // The whole word is typed on plain lines: no boxes, no letters shown, no hint about the length.
      // Full marks for the exact word; 1 mark when the word has the right length and exactly one letter is wrong;
      // a missing or extra letter gets 0.
      // shoulder is the one extra word: same theme as Unit 8 (the body), a little beyond the spelling list.
      id: 'B', kind: 'word', name: 'Spelling', marksEach: 2,
      help: 'Look at the picture. Type the word on the lines.',
      qs: [
        { id: 'B1', pic: '1F9E5', alt: 'a jacket', word: 'jacket' },
        { id: 'B2', pic: '1F3B8', alt: 'a guitar', word: 'guitar' },
        { id: 'B3', pic: 'CAMEL', alt: 'a camel', word: 'camel' },
        { id: 'B4', pic: 'SNAKE', alt: 'a snake', word: 'snake' },
        { id: 'B5', pic: 'PARROT', alt: 'a parrot', word: 'parrot' },
        { id: 'B6', pic: 'SHARK', alt: 'a shark', word: 'shark' },
        { id: 'B7', pic: 'SHOULDER', alt: 'a child touching a shoulder', word: 'shoulder' }
      ]
    },
    {
      id: 'D', kind: 'build', name: 'Sentence building', marksEach: 3,
      help: 'Tap the words in the correct order to make a sentence.',
      qs: [
        { id: 'D1', pic: '1F6B2', alt: 'a bicycle', ans: ['I', 'can', 'ride', 'my', 'bike', '.'] },
        { id: 'D2', pic: 'TIGER', alt: 'a tiger', ans: ['Tigers', 'live', 'in', 'the', 'jungle', '.'] },
        { id: 'D3', pic: 'CAMEL', alt: 'a camel', ans: ['Camels', 'live', 'in', 'the', 'desert', '.'] },
        { id: 'D4', pic: '1F916', alt: 'a robot', ans: ['The', 'robot', 'has', 'two', 'arms', '.'] },
        { id: 'D5', pic: '1F3F0', alt: 'a sandcastle with a bucket and spade', ans: ['I', 'can', 'make', 'a', 'sandcastle', '.'] }
      ]
    }
  ]
};

export const CHALLENGE = {
  id: 'challenge-1', key: 'challenge', level: 'challenge', after: 'practice1',
  title: 'English Explorer Challenge',
  subtitle: 'Challenge for set 1',
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
        { id: 'D1', pic: '1F916', alt: 'a robot', ans: ['The', 'robot', 'has', 'two', 'long', 'arms', '.'] },
        { id: 'D2', pic: '1F980', alt: 'a crab', ans: ['The', 'crab', 'has', 'two', 'big', 'claws', '.'] },
        { id: 'D3', pic: '1F47B', alt: 'a ghost', ans: ['I', 'can', 'see', 'a', 'friendly', 'ghost', '.'] },
        { id: 'D4', pic: '1F457', alt: 'a dress', ans: ['She', 'is', 'wearing', 'a', 'pink', 'dress', '.'] },
        { id: 'D5', pic: '1F6B2', alt: 'a bicycle', ans: ['I', 'can', 'ride', 'my', 'bike', '.'] }
      ]
    }
  ]
};

export const CHALLENGE2 = {
  // The challenge for Practice set 2: only for pupils who scored every mark in Practice set 2.
  id: 'challenge-2', key: 'challenge2', level: 'challenge', after: 'practice2',
  title: 'English Explorer Challenge',
  subtitle: 'Challenge for set 2',
  parts: [
    {
      id: 'A', kind: 'choose', name: 'Vocabulary', marksEach: 1,
      help: 'Look at the picture. Tap the correct word.',
      qs: [
        { id: 'A1', pic: 'POLARBEAR', alt: 'a polar bear', ans: 'polar bear', opts: ['polar bear', 'penguin', 'goat'] },
        { id: 'A2', pic: 'MOUNTAINS', alt: 'mountains', ans: 'mountains', opts: ['mountains', 'desert', 'jungle'] },
        { id: 'A3', pic: 'JELLYFISH', alt: 'a jellyfish', ans: 'jellyfish', opts: ['jellyfish', 'shark', 'snake'] },
        { id: 'A4', pic: '1F41A', alt: 'shells', ans: 'look for shells', opts: ['look for shells', 'make a sandcastle', 'take a photo'] },
        { id: 'A5', pic: '1F3B8', alt: 'a guitar', ans: 'play the guitar', opts: ['play the guitar', 'paint a picture', 'listen to music'] },
        { id: 'A6', pic: '1F9D1-200D-1F373', alt: 'a kitchen', ans: 'kitchen', opts: ['kitchen', 'bathroom', 'garden'] }
      ]
    },
    {
      // Whole word: every letter is typed. One mark if exactly one letter is wrong.
      id: 'B', kind: 'letters', exact: true, name: 'Spelling', marksEach: 2,
      help: 'Look at the picture. Type the whole word.',
      qs: [
        { id: 'B1', pic: '1F456', alt: 'jeans', word: 'jeans' },
        { id: 'B2', pic: '1F9D1-200D-1F373', alt: 'a kitchen', word: 'kitchen' },
        { id: 'B3', pic: '1F41A', alt: 'shells', word: 'shells' },
        { id: 'B4', pic: '1F6CF', alt: 'a bed', word: 'bedroom' },
        { id: 'B5', pic: '26BD', alt: 'a football', word: 'football' },
        { id: 'B6', pic: 'LIZARD', alt: 'a lizard', word: 'lizard' }
      ]
    },
    {
      id: 'C', kind: 'gap', name: 'Grammar', marksEach: 1,
      help: 'Tap the word that fits the sentence.',
      qs: [
        { id: 'C1', pic: '1F47E', alt: 'a monster', text: 'The monster is ___ the cellar.', ans: 'in', opts: ['in', 'on', 'at'] },
        { id: 'C2', pic: '1F456', alt: 'jeans', text: 'I am wearing blue ___.', ans: 'jeans', opts: ['jeans', 'jean', 'a jeans'] },
        { id: 'C3', pic: '26BD', alt: 'a football', text: 'He likes ___ football.', ans: 'playing', opts: ['playing', 'plays', 'play'] },
        { id: 'C4', pic: '1F41A', alt: 'shells', text: 'The shells ___ on the sand.', ans: 'are', opts: ['are', 'is', 'am'] },
        { id: 'C5', pic: '1F4F7', alt: 'a camera', text: "Let's ___ a photo.", ans: 'take', opts: ['take', 'takes', 'taking'] },
        { id: 'C6', pic: 'TIGER', alt: 'a tiger', text: 'Tigers ___ in the jungle.', ans: 'live', opts: ['live', 'lives', 'living'] }
      ]
    },
    {
      id: 'D', kind: 'build', name: 'Sentence building', marksEach: 3,
      help: 'Tap the words in the correct order to make a sentence.',
      qs: [
        { id: 'D1', pic: '1F3F0', alt: 'a sandcastle with a bucket and spade', ans: ['I', 'can', 'make', 'a', 'big', 'sandcastle', '.'] },
        { id: 'D2', pic: '26BD', alt: 'a football', ans: ['My', 'brother', 'likes', 'to', 'play', 'football', '.'] },
        { id: 'D3', pic: '1F47E', alt: 'a monster', ans: ['There', 'is', 'a', 'monster', 'in', 'the', 'cellar', '.'] },
        { id: 'D4', pic: '1F456', alt: 'jeans', ans: ['I', 'am', 'wearing', 'my', 'new', 'jeans', '.'] },
        { id: 'D5', pic: 'PARROT', alt: 'a parrot', ans: ['Parrots', 'live', 'in', 'the', 'green', 'jungle', '.'] }
      ]
    }
  ]
};

export const REAL = {
  // The REAL quiz (competition), built to Miss Irene's "Design and Marking Guide": 5 parts, 30 questions, 60 marks.
  // Content: Super Minds 1 Units 5-9 (Teacher's Book word lists, incl. Unit 6 English for school: habitats and animals).
  // Different words and sentences from the practice sets. Grammar (C) and Find the mistake (E) come from a small
  // question bank (`vs`): each pupil gets ONE version of each, chosen from their class and name (`pickVariant`),
  // so neighbours usually see different sentences. Ranking: total, then Grammar, then Word order, then Find the mistake, then time.
  id: 'real-quiz-1', key: 'real', level: 'real',
  title: 'English Explorer Challenge',
  subtitle: 'Real quiz',
  rank: ['C', 'D', 'E'],
  parts: [
    {
      id: 'A', kind: 'choose', name: 'Vocabulary', marksEach: 1,
      help: 'Look at the picture. Tap the correct word.',
      qs: [
        { id: 'A1', pic: 'GOAT', alt: 'a goat', ans: 'goat', opts: ['goat', 'camel', 'kangaroo'] },
        { id: 'A2', pic: 'STAIRS', alt: 'stairs', ans: 'stairs', opts: ['stairs', 'hall', 'cellar'] },
        { id: 'A3', pic: 'SWEATER', alt: 'a sweater', ans: 'sweater', opts: ['sweater', 'jacket', 'skirt'] },
        { id: 'A4', pic: 'KNEE', alt: 'a child pointing at a knee', ans: 'knee', opts: ['knee', 'toes', 'arm'] },
        { id: 'A5', pic: 'PAINT', alt: 'a child painting a picture', ans: 'paint a picture', opts: ['paint a picture', 'listen to music', 'read a book'] },
        { id: 'A6', pic: 'POLAR', alt: 'snow and ice', ans: 'polar region', opts: ['polar region', 'desert', 'jungle'] },
        { id: 'A7', pic: 'PIANO', alt: 'a child playing the piano', ans: 'play the piano', opts: ['play the piano', 'ride my pony', 'go swimming'] },
        { id: 'A8', pic: 'KANGAROO', alt: 'a kangaroo', ans: 'kangaroo', opts: ['kangaroo', 'cheetah', 'dolphin'] }
      ]
    },
    {
      // 4 whole words typed on lines (2 marks; 1 if same length with one wrong letter; a missing or extra letter = 0)
      // and 2 missing-letter words (1 mark per letter), so weaker pupils can still score.
      id: 'B', kind: 'word', name: 'Spelling', marksEach: 2,
      help: 'Look at the picture. Spell the word.',
      qs: [
        { id: 'B1', pic: 'SKIRT', alt: 'a skirt', word: 'skirt' },
        { id: 'B2', pic: 'GARDEN', alt: 'a garden', word: 'garden' },
        { id: 'B3', pic: 'DOLPHIN', alt: 'a dolphin', word: 'dolphin' },
        { id: 'B4', pic: 'LADYBIRD', alt: 'a ladybird', word: 'ladybird' },
        { id: 'B5', kind: 'letters', pic: 'TROUSERS', alt: 'trousers', word: 'trousers', blanks: [3, 5] },
        { id: 'B6', kind: 'letters', pic: 'CHEETAH', alt: 'a cheetah', word: 'cheetah', blanks: [2, 3] }
      ]
    },
    {
      // Each question has 2-3 versions of the same difficulty; a pupil sees one.
      id: 'C', kind: 'gap', name: 'Grammar', marksEach: 2,
      help: 'Tap the word that fits the sentence.',
      qs: [
        { id: 'C1', vs: [
          { pic: '1F47E', alt: 'a monster', text: 'There ___ a monster in the cellar.', ans: 'is', opts: ['is', 'are', 'am'] },
          { pic: '1F41A', alt: 'shells', text: 'There ___ two shells on the sand.', ans: 'are', opts: ['are', 'is', 'am'] }] },
        { id: 'C2', vs: [
          { pic: '1F47B', alt: 'a ghost', text: '___ there a ghost in the house?', ans: 'Is', opts: ['Is', 'Are', 'Am'] },
          { pic: '1F9E6', alt: 'socks', text: '___ there any socks in the bag?', ans: 'Are', opts: ['Are', 'Is', 'Am'] }] },
        { id: 'C3', vs: [
          { pic: '1F9A9', alt: 'a child standing on one leg', text: 'He ___ stand on one leg.', ans: 'can', opts: ['can', "can't", 'cans'] },
          { pic: 'PENGUIN', alt: 'a penguin', text: 'Penguins ___ fly.', ans: "can't", opts: ["can't", 'can', 'cans'] }] },
        { id: 'C4', vs: [
          { pic: '1F9E5', alt: 'a green jacket', text: 'He ___ wearing a green jacket.', ans: 'is', opts: ['is', 'are', 'am'] },
          { pic: '1F456', alt: 'jeans', text: 'I ___ wearing my new jeans.', ans: 'am', opts: ['am', 'is', 'are'] }] },
        { id: 'C5', vs: [
          { pic: '1F45F', alt: 'shoes', text: 'Do you like ___ shoes?', ans: 'these', opts: ['these', 'this', 'a'] },
          { pic: '1F9E2', alt: 'a cap', text: 'Do you like ___ cap?', ans: 'this', opts: ['this', 'these', 'an'] }] },
        { id: 'C6', vs: [
          { pic: 'LIZARD', alt: 'a lizard on a rock', text: 'The lizard is ___ the rock.', ans: 'on', opts: ['on', 'in', 'under'] },
          { pic: 'POLARBEAR', alt: 'a polar bear on the ice', text: 'The polar bear is ___ the ice.', ans: 'on', opts: ['on', 'in', 'under'] }] },
        { id: 'C7', vs: [
          { pic: '1F4D6', alt: 'a book', text: "Where's the book? ___ in the bag.", ans: "It's", opts: ["It's", "They're", 'Is'] },
          { pic: '1F41A', alt: 'shells', text: "Where are the shells? ___ on the sand.", ans: "They're", opts: ["They're", "It's", 'Are'] }] },
        { id: 'C8', vs: [
          { pic: '26BD', alt: 'a football', text: '___ you play football at the weekend?', ans: 'Do', opts: ['Do', 'Does', 'Are'] },
          { pic: '1F6B2', alt: 'a bicycle', text: 'I ___ my bike on Saturdays.', ans: 'ride', opts: ['ride', 'rides', 'riding'] }] },
        { id: 'C9', vs: [
          { pic: '1F916', alt: 'a robot', text: 'The robot ___ two long arms.', ans: 'has', opts: ['has', 'have', 'is'] },
          { pic: '1F980', alt: 'a crab', text: 'Crabs ___ two big claws.', ans: 'have', opts: ['have', 'has', 'is'] }] },
        { id: 'C10', vs: [
          { pic: 'CAMEL', alt: 'a camel', text: 'Camels ___ in the desert.', ans: 'live', opts: ['live', 'lives', 'living'] },
          { pic: 'SHARK', alt: 'a shark', text: 'A shark ___ in the ocean.', ans: 'lives', opts: ['lives', 'live', 'living'] }] }
      ]
    },
    {
      // Word order: statements AND questions (so the part is not called "Sentence building").
      // Every answer has ONE natural word order (marking compares tiles in a fixed order).
      id: 'D', kind: 'build', name: 'Word order', marksEach: 3,
      help: 'Tap the words in the correct order.',
      qs: [
        { id: 'D1', pic: '1F45F', alt: 'shoes', ans: ['Do', 'you', 'like', 'these', 'shoes', '?'] },
        { id: 'D2', pic: '1F41A', alt: 'shells', ans: ['How', 'many', 'shells', 'are', 'there', '?'] },
        { id: 'D3', pic: 'CAMEL', alt: 'a camel', ans: ['You', 'find', 'camels', 'in', 'the', 'desert', '.'] },
        { id: 'D4', pic: 'DOLPHIN', alt: 'a dolphin', ans: ['Dolphins', 'can', 'swim', 'very', 'fast', '.'] },
        { id: 'D5', pic: 'PAINT', alt: 'a child painting a picture', ans: ["Let's", 'paint', 'a', 'picture', '.'] }
      ]
    },
    {
      // Find and fix the mistake: 2 marks for tapping the wrong word, 3 more for writing the correct word.
      id: 'E', kind: 'fix', name: 'Find the mistake', marksEach: 5, spotMarks: 2,
      help: 'One word is wrong. Tap it, then write the correct word.',
      qs: [
        { id: 'E1', vs: [
          { pic: 'SKIRT', alt: 'a blue skirt', words: ['She', 'are', 'wearing', 'a', 'blue', 'skirt', '.'], wrong: 1, fix: 'is' },
          { pic: '1F916', alt: 'a robot', words: ['The', 'robot', 'have', 'two', 'arms', '.'], wrong: 2, fix: 'has' },
          { pic: 'TIGER', alt: 'a tiger', words: ['Tigers', 'lives', 'in', 'the', 'jungle', '.'], wrong: 1, fix: 'live' }] }
      ]
    }
  ]
};

export const QUIZZES = { practice1: PRACTICE, practice2: PRACTICE2, challenge: CHALLENGE, challenge2: CHALLENGE2, real: REAL };
// Each practice set has its own challenge: full marks in practice1 unlock `challenge`, full marks in practice2 unlock `challenge2`.
// The tests the teacher can open or close for pupils, in the order shown. `real` has no questions yet.
export const SETS = [
  { key: 'practice1', label: 'Practice set 1', ready: true, openByDefault: true },
  { key: 'practice2', label: 'Practice set 2', ready: true, openByDefault: false },
  { key: 'challenge', label: 'Challenge for set 1', ready: true, openByDefault: true, linkedTo: 'practice1' },
  { key: 'challenge2', label: 'Challenge for set 2', ready: true, openByDefault: false, linkedTo: 'practice2' },
  { key: 'real', label: 'Real quiz', ready: true, openByDefault: false }
];
// 'practice' is the old name of Practice set 1 (pages opened before the update still send it).
export const getQuiz = key => QUIZZES[key === 'practice' ? 'practice1' : key] || PRACTICE;
export const totalOf = quiz => quiz.parts.reduce((s, p) => s + p.qs.length * p.marksEach, 0);

// Words that always keep a capital letter (I, days of the week). The first word is capitalised too.
const capsOf = ans => ans.filter((w, i) => /^[A-Z]/.test(w) && (i > 0 || w === 'I'));
const capFirst = w => w.charAt(0).toUpperCase() + w.slice(1);
const showWords = (words, caps) => words.map((w, i) => {
  const lw = w.toLowerCase();
  return i === 0 || caps.some(c => c.toLowerCase() === lw) ? capFirst(lw) : lw;
});

// true when the two words have the same length and differ in exactly one letter.
// A missing or an extra letter does NOT count (it gets 0 marks).
function oneLetterWrong(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) diff++;
  return diff === 1;
}

// Question bank: which version of a question this pupil gets. The page uses the SAME formula, so it shows the version the server marks.
const normWho = s => String(s || '').replace(/\s+/g, ' ').trim().toLowerCase();
export function pickVariant(n, klass, name, qid) {
  const str = String(klass || '').trim().toUpperCase() + '|' + normWho(name) + '|' + qid;
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return (h >>> 0) % n;
}
const resolveQ = (q, who) => q.vs ? { id: q.id, kind: q.kind, ...q.vs[pickVariant(q.vs.length, who.klass, who.name, q.id)] } : q;
const kindOf = (p, q) => q.kind || p.kind;

function publicQ(k, q) {
  if (k === 'choose') return { pic: q.pic, alt: q.alt, opts: q.opts };
  if (k === 'gap') return { pic: q.pic, alt: q.alt, text: q.text, opts: q.opts };
  if (k === 'word') return { pic: q.pic, alt: q.alt };
  if (k === 'fix') return { pic: q.pic, alt: q.alt, words: q.words };
  if (k === 'letters') {
    const blanks = q.blanks || q.word.split('').map((_, i) => i);
    return { pic: q.pic, alt: q.alt, len: q.word.length, blanks, shown: q.word.split('').map((c, i) => blanks.includes(i) ? '' : c) };
  }
  // Word tiles are sent in lower case so a capital letter does not show which word is first.
  return { pic: q.pic, alt: q.alt, tiles: q.ans.map(w => w.toLowerCase()), caps: capsOf(q.ans) };
}

export function publicQuiz(quiz = PRACTICE) {
  return {
    id: quiz.id, key: quiz.key, level: quiz.level, next: quiz.next || '', title: quiz.title, subtitle: quiz.subtitle, total: totalOf(quiz),
    parts: quiz.parts.map(p => ({
      id: p.id, kind: p.kind, name: p.name, marksEach: p.marksEach, help: p.help,
      qs: p.qs.map(q => {
        const k = kindOf(p, q);
        const base = { id: q.id, ...(q.kind ? { kind: q.kind } : {}) };
        return q.vs ? { ...base, vs: q.vs.map(v => publicQ(k, v)) } : { ...base, ...publicQ(k, q) };
      })
    }))
  };
}

const joinWords = w => w.join(' ').replace(/ ([.?!])/g, '$1');

// `who` = { klass, name }: needed to know which version of a bank question this pupil got.
export function mark(quiz, answers, who = {}) {
  const a = answers && typeof answers === 'object' ? answers : {};
  const rows = []; const parts = {};
  for (const p of quiz.parts) {
    parts[p.id] = 0;
    for (const q0 of p.qs) {
      const q = resolveQ(q0, who), k = kindOf(p, q0);
      const given = a[q.id];
      let got = 0, correct, shown, question;
      if (k === 'choose' || k === 'gap') {
        shown = typeof given === 'string' ? given.slice(0, 40) : '';
        correct = q.ans;
        got = shown === q.ans ? p.marksEach : 0;
        if (k === 'gap') question = q.text;
      } else if (k === 'word') {
        shown = typeof given === 'string' ? given.replace(/\s+/g, ' ').trim().slice(0, 40) : '';
        correct = q.word;
        const typed = shown.toLowerCase().replace(/\s+/g, '');
        got = typed === q.word ? p.marksEach : (oneLetterWrong(typed, q.word) ? 1 : 0);
      } else if (k === 'letters') {
        const blanks = q.blanks || q.word.split('').map((_, i) => i);
        const letters = Array.isArray(given) ? given.map(x => String(x || '').trim().slice(0, 1).toLowerCase()) : [];
        shown = q.word.split('').map((c, i) => {
          const j = blanks.indexOf(i);
          return j < 0 ? c : (letters[j] || '_');
        }).join('');
        correct = q.word;
        const right = blanks.filter((pos, j) => letters[j] === q.word[pos]).length;
        if (p.exact) got = right === blanks.length ? p.marksEach : (right === blanks.length - 1 ? 1 : 0);
        else got = Math.round(p.marksEach * right / blanks.length);
      } else if (k === 'fix') {
        const g = given && typeof given === 'object' ? given : {};
        const w = Number.isInteger(g.w) ? g.w : -1;
        const t = String(g.t || '').replace(/\s+/g, ' ').trim().slice(0, 30);
        const spot = w === q.wrong;
        got = spot ? (p.spotMarks || 2) + (t.toLowerCase() === q.fix.toLowerCase() ? p.marksEach - (p.spotMarks || 2) : 0) : 0;
        question = joinWords(q.words);
        shown = (w >= 0 && w < q.words.length ? 'tapped "' + q.words[w] + '"' : 'no word tapped') + (t ? ', wrote "' + t + '"' : '');
        correct = '"' + q.words[q.wrong] + '" → "' + q.fix + '"';
      } else {
        const tiles = Array.isArray(given) ? given.map(x => String(x || '').slice(0, 20).toLowerCase()) : [];
        const n = q.ans.length;
        const right = q.ans.filter((w, i) => tiles[i] === w.toLowerCase()).length;
        got = (right === n && tiles.length === n) ? p.marksEach : Math.min(p.marksEach - 1, Math.floor(p.marksEach * right / n));
        shown = joinWords(showWords(tiles, capsOf(q.ans)));
        correct = joinWords(q.ans);
      }
      parts[p.id] += got;
      rows.push({ q: q.id, part: p.id, given: shown, correct, got, max: p.marksEach, ...(question ? { question } : {}) });
    }
  }
  const score = Object.values(parts).reduce((s, x) => s + x, 0);
  return { score, total: totalOf(quiz), parts, rows };
}
