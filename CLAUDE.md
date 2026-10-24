# English Explorer Challenge (kk2englishexplorer)

Online English quiz competition for Year 2 pupils at SJK(C) Kuo Kuang 2, Johor Bahru.
Content: Super Minds 1, Units 5-9 (Free time, The old house, Get dressed!, The robot, At the beach).
Owner: Miss Irene (English teacher). Plain, friendly explanations please; she is new to Claude Code.

## Live
- Pupils: https://kk2englishexplorer.vercel.app
- Teacher results: https://kk2englishexplorer.vercel.app/teacher
- Vercel team: haisweys-projects (team_7LlvJnd6nJV9LEPcgGNIvNGd), Pro plan
- Vercel project: kk2englishexplorer (prj_FQQcdUMOvy7plEc4n5cofIrfxJZW)
- Results storage: Vercel Blob store "kk2englishexplorer-results" (BLOB_READ_WRITE_TOKEN is already set in the project)
- Deployment protection: preview only, so the production link is open to pupils.

To publish from this folder: `npx vercel link` (choose the existing project kk2englishexplorer), then `npx vercel --prod`.

## How it works
- No build step. Static pages in `public/`, serverless functions in `api/` (Node, ES modules).
- `api/_quiz.js`: the question bank WITH answers, `publicQuiz()` (answers removed) and `mark()`. Change `QUIZ.id`
  whenever the questions change, so new results are stored separately from old ones.
- Pupil names and Year 2 classes come live from the spelling app (https://kk2spelling.vercel.app/api/roster,
  needs a class and at least 3 typed letters). Never copy the full name list into this project.
- Pupil names are compared without capitals or extra spaces (saved progress on the device, the challenge unlock in
  `hasFullMarks`, first attempt vs retake on the teacher page, and the one-attempt rule), so "Tan Mei Ling" and
  "tan mei ling" are one pupil.
- BLOB OPERATIONS (list/put/copy are "advanced" and metered): pupil requests must never call `list()`. Pupil paths only
  read single files by URL (cheap). A pupil's marker `attempts/<quiz id>/<class>-<hash>.json` holds their first result and
  `full` (any attempt had every mark), so the challenge unlock is one marker read, not a scan of all results. Results
  saved before markers existed get markers once (`ensureBackfilled` in `api/_lib.js`, flag file `attempts/<id>/_done.json`).
  Cost: a submit is 2 puts (marker + result); the teacher page lists once per load. The class list is cached 60 minutes.
- ONE ATTEMPT per pupil per test (practice and challenge). The first submit writes a marker file
  `attempts/<quiz id>/<class>-<name hash>.json`; later submits get HTTP 409 with the first result and the page shows it.
  `/api/attempt` tells the page before the pupil starts. Results saved before markers existed are also found.
  To allow a retake, the teacher deletes that pupil's attempt on the teacher page (this removes the marker).
- The name screen has a "My name is not here" button: the pupil types their full name (for example a new transfer pupil).
  `api/submit.js` then saves the result tagged "name not on list" (`verified: false`) so the teacher can see it.
- `api/submit.js` marks on the server and saves one JSON file per attempt in Blob under `results/<quiz id>/`.
- `api/results.js` (POST): PIN check, then list or delete results. Any teacher PIN can LIST scores; only the ADMIN PIN
  can DELETE them (`checkPin` returns 'admin' or 'teacher'; the teacher page simply has no Delete button for a teacher). The **Lock** button in the page header logs out
  (forgets the PIN on that device), like the Lock button in the spelling app's admin page.
  Deleting an attempt also lets that pupil take the test again. The PIN is checked against the
  spelling app (`/api/admin`, action "load", which says whether the PIN is admin or teacher); a `QUIZ_PIN` env var counts as admin.
- Ranking (teacher page): total, then sentence building (D), then spelling (B), then shorter time.
  The same order is used for the Challenge level (Grammar is not a tie-breaker). Result column headers are two lines
  (part name, then /max). The results table must NEVER need sideways scrolling: the Name column takes the leftover width and
  a long name wraps to a second line; "name not on list" and "retake" tags sit on a second line under the name; screens
  900 px wide or less show each pupil as a small card instead of a table row.
  Only each pupil's first attempt is ranked; retakes are shown separately.
  Time: the pupil's device clock measures it (start tap to submit). Over 3 hours means the device clock was wrong, so the server saves `seconds: null` and the teacher page shows a dash and ranks it last among equal scores (older records with huge times are treated the same way).

## Tests and the open/close switches
- Tests (registry in `api/_quiz.js`: `QUIZZES`, `SETS`, `getQuiz(key)`): `practice1` (id `mock-easy-3`, shown as "Practice set 1"),
  `practice2` (id `practice-set-2`), `challenge` (id `challenge-1`, "Challenge for set 1"), `challenge2` (id `challenge-2`, "Challenge for set 2"), `real` (id `real-quiz-1`, "Real quiz", the competition; CLOSED until the admin opens it), `challenge3` (id `challenge-real-1`, "Challenge for the real quiz").
  Pages and APIs pass `set=<key>` (old `level=practice|challenge` still works; no key means set 1).
- Open/close: one file `config/open.json` in Blob (`getOpenState`, `setOpen`, `mayHandIn` in `api/_lib.js`). Defaults: set 1 open, set 2 closed, real closed.
  A challenge is LINKED to its practice set (`linkedTo` in `SETS`): it is open exactly when its practice set is open, and opening or closing either one
  changes the pair (one put). The teacher panel shows one row per practice set ("and its challenge"). ONLY the admin PIN can open/close (`api/results.js` answers 403 to a teacher PIN; the teacher page shows a plain line "Open for pupils now: ..." plus the test pupil note to everyone, and a collapsed "Admin: open or close tests" section with the Open/Close buttons only for the admin) and only the admin can delete scores.
  Pupils only see open tests (`/api/quiz` lists them; one open test goes straight to class choice, several show "Choose your test").
  Closed test: start gets 403 `{closed:true}`; a pupil who started before closing may still hand in for 2 hours.
  Cost: a pupil reads the file by URL (cheap); opening/closing is 1 put.
- Each practice set has its OWN challenge: full marks in Practice set 1 unlock `challenge`, full marks in Practice set 2 unlock `challenge2`
  (`after` on the challenge quiz names its practice set; `next` on the practice set names its challenge; `hasFullMarks(klass, name, practiceKey)`).

## Test pupils (for teachers)
- Five test pupils in EVERY class: `Test Pupil 1` to `Test Pupil 5` (`TEST_NAMES`, `isTestPupil`, `testNames` in `api/_lib.js`). A teacher picks any class, types "test" (4+ letters,
  so real pupils never see them) and taps a name. They are not in the spelling app roster; `api/roster.js` adds them to the search.
- They behave like pupils but save NO result: `api/submit.js` marks and returns the score with `test: true` (no result file, no one-attempt marker), they can repeat every test
  (`/api/attempt` says not done; the page ignores saved progress for them). Their scores never show on the teacher page. A test must still be OPEN for them to start it
  (they do not bypass the open/close switches). The teacher page explains this in the open/close panel.
- Challenge: **Test Pupil 1** earns it like a real pupil: each practice try leaves ONE small marker (`rememberTestResult`, overwrite, 1 put) and its LATEST try decides
  (full marks unlocks, a later non-full try locks again). **Test Pupils 2-5** can always enter an open challenge (`challengeAlwaysOpen` in `api/_lib.js`).

## Practice set 2: practice-set-2 (20 questions, 37 marks)
- Words come from the school's "Year 2 Spelling List 2026" (Miss Irene's docx; Topics 5-9 plus habitats and animals). Different words and sentences from Practice set 1.
  A Vocabulary 8 x 1 (take a photo, make a sandcastle, T-shirt, desert, jungle, ocean, penguin, robot);
  B Spelling: picture and ONE writing line only (four ruled lines were too narrow for the letters), type the WHOLE word, 7 x 2 (kind `word`; 1 mark if same length with exactly one wrong letter; a missing or extra letter = 0):
  jacket, guitar, camel, snake, parrot, shark, shoulder* (* = the one extra word, beyond the list but inside the Unit 8 body theme; easy to change);
  D Sentence building 5 x 3 (bike; "Tigers live in the jungle"; "Camels live in the desert" (habitat sentences use the plural, as in Miss Irene's list style); robot has two arms; sandcastle).
  Habitat and animal pictures (DESERT, JUNGLE, OCEAN, MOUNTAINS, PENGUIN, CAMEL, TIGER, SNAKE, SHARK, POLARBEAR, PARROT, JELLYFISH, LIZARD) and SHOULDER are in `PICS`.
- Practice set 1 and Challenge for set 1 do NOT have habitat questions yet (they are live with results; changing their questions needs a new id).

## Practice set 1: mock-easy-3 (easy level, 19 questions, 35 marks)
- A Vocabulary: picture, choose the word, 8 x 1 mark
- B Spelling: picture, TYPE the 2 missing letters (no letter choices shown), 6 x 2 marks (1 per letter)
- D Sentence building: tap word tiles in order, 5 x 3 marks (partial marks by words in the right place). Tiles are lower case; the page capitalises the first word, "I" and days when placed, so a capital never shows the first word
- No listening items (audio may not work on some school devices).
- Sentence-building rule: every sentence must have ONE natural word order (no movable time or place phrases like "on Saturdays" or "in the park", no "walk and talk" pairs), because marking compares tiles in a fixed order.

## Rules from Miss Irene
- Images for teaching tools must be EMBEDDED in the files (inline SVG or base64 data URIs), never linked from
  external URLs. Done: the 57 quiz pictures (children's picture-book style, made with Canva AI, credited on the home screen) are
  embedded as base64 WebP (480x480) in the `PICS` map in `public/index.html` (page is about 1.25 MB). A new picture
  code in `api/_quiz.js` must be added to `PICS` (otherwise the plain emoji shows instead). To make a new one: Canva
  `generate-image` with one style line, then place it on a page of a Canva design and `export-design` as PNG.
  Fonts (Andika, Baloo 2; SIL OFL) are subset woff2 files in `public/fonts/`, loaded from `style.css`. Nothing is loaded from outside sites.
- If any sound is ever added: edge-tts MP3s embedded as base64 (voices en-SG-LunaNeural, en-GB-SoniaNeural or
  en-US-AnaNeural, rate -10%). Never use speechSynthesis.
- Year 2 friendly: big tap targets, short instructions, no negative marking.

## Challenge levels (39 marks each; one per practice set)
- `challenge-1` ("Challenge for set 1") is only for pupils who EVER scored 35/35 in Practice set 1; `challenge-2` ("Challenge for set 2") only for 37/37 in Practice set 2.
  The pupil is offered it on the result screen and on the "Hello, <name>" screen of THAT practice set, on any device and after a retake.
  The page asks the server (`/api/quiz?set=<challenge key>&klass=&name=`, which checks the pupil's marker for the practice set with `hasFullMarks` in `api/_lib.js`);
  `/api/submit` checks the same, so typing the address does not skip the practice set.
- Same shape in both: A Vocabulary 6 x 1; B Spelling: type the WHOLE word in letter boxes, 6 x 2 (1 mark if exactly one letter is wrong);
  C Grammar: tap the word that fits the sentence, 6 x 1; D Sentence building, 7-8 tiles, 5 x 3.
- Challenge 2 (all words from the school spelling list): vocabulary polar bear, mountains, jellyfish, look for shells, play the guitar, kitchen; spelling jeans, kitchen, shells (the picture shows TWO shells, so the answer is plural), bedroom, football, lizard;
  grammar about monster/cellar, jeans, football, shells, camera, "Tigers ___ in the jungle"; sentences about sandcastle, football, monster, jeans, "Parrots live in the green jungle".
- Quizzes live in `api/_quiz.js` (PRACTICE, PRACTICE2, CHALLENGE, CHALLENGE2). Every new picture code must be added to `PICS`
  in `public/index.html`. The teacher page has a Test selector listing every test with questions.
- The practice screen shows the set name (no "Mock test" wording for pupils).

## Real quiz: real-quiz-1 (30 questions, 60 marks) - built to Miss Irene's "Design and Marking Guide" (Drive PDF)
- Content from the Super Minds 1 Teacher's Book (Units 5-9 word lists + Unit 6 English for school: habitats and their animals). Different words from the practice sets.
- A Vocabulary 8 x 1: topic words from the book plus a few extra words inside the same topics (*): goat, stairs, sweater, shoulder*, paint a picture,
  polar region, play the piano, sunglasses*.
- B Spelling 6 x 2: ALL typed as whole words (no missing letters, Miss Irene's rule), her chosen words: tongue, gloves, kitchen, dolphin, cheetah, blouse.
  No spelling word appears anywhere else in the quiz (option, sentence or tile), so nothing gives a spelling away.
- C Grammar 10 x 2, from the Unit 5-9 grammar lessons and the mistakes Year 2 pupils often make: there is/are; short answers (Yes, there is / No, there aren't;
  Yes, he is / No, she isn't; No, it can't / Yes, he can; Yes, I do); It's (one) / They're (more than one); this/these; am/is + wearing; can + plain verb;
  Do you ...?; Let's + plain verb.
- D "Word order" 5 x 3 (NOT called sentence building: it mixes statements and questions, e.g. "Do you like these shoes?", "How many shells are there?").
- E "Find the mistake" 1 x 5 (kind `fix`): tap the wrong word (2 marks) then write the correct word (3 more). Versions: These shoes is red / She are wearing a red sweater / I rides my bike on Sundays.
- QUESTION BANK: C and E questions have versions (`vs`); each pupil gets one, chosen from class + name by `pickVariant` (FNV hash). The page uses the
  SAME formula (index.html `pickVariant`), so it shows the version the server marks. `mark(quiz, answers, { klass, name })` needs the pupil.
- Ranking for the real quiz (`rank: ['C','D','E']`): total, then Grammar, then Word order, then Find the mistake, then time (practice sets keep D then B).
- Pictures made for it: GOAT, STAIRS, SWEATER, PAINT, POLAR, PIANO, KANGAROO, DOLPHIN, CHEETAH, SUNGLASSES, TONGUE, GLOVES, BLOUSE; page about 1.25 MB with 57 pictures (no unused ones).
- It has its OWN challenge: `challenge3` (id `challenge-real-1`, "Challenge for the real quiz"), only for pupils with 60/60 in the real quiz (`after: 'real'`, `next` on REAL),
  linked to the real quiz's switch (opens/closes with it). Same 5 parts, harder, 28 questions, 60 marks: A Vocabulary 7 x 1 (close distractors: ocean/lake, jungle/forest,
  kangaroo/koala, bedroom/living room ...), B Spelling 6 x 2 typed (penguin, bathroom, sweater, mountains, jellyfish, sandcastle), C Grammar 8 x 2 with versions,
  D Word order 5 x 3, E Find the mistake 2 x 5 with versions. Ranking C, D, E like the real quiz. The page offers a challenge after ANY test that has `next`.

## Planned tests
1. Mock test 1, easy (current): Sections A, B, D, 35 marks.
2. Mock test 2, medium: add Section C Grammar (Practice set 2 already types the whole spelling word).
3. Final competition: DONE as the Real quiz (above).

- Check singular/plural against the picture (shells, socks, shoes and jeans show more than one; a monster, a crab and a boat show one). Picture counts must match the words.

- Pupil question screen: a sticky bar at the top (name and class, "Question X of N", and the numbered circles) stays visible while scrolling. The circles ARE the progress bar:
  a circle lights up green when its question is answered, the yellow one is where the pupil is now; with many questions the numbers are hidden and they show as plain lights (`fitTrail`).
