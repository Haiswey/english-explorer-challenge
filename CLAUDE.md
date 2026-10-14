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

## Practice test: mock-easy-3 (easy level, 19 questions, 35 marks)
- A Vocabulary: picture, choose the word, 8 x 1 mark
- B Spelling: picture, TYPE the 2 missing letters (no letter choices shown), 6 x 2 marks (1 per letter)
- D Sentence building: tap word tiles in order, 5 x 3 marks (partial marks by words in the right place). Tiles are lower case; the page capitalises the first word, "I" and days when placed, so a capital never shows the first word
- No listening items (audio may not work on some school devices).
- Sentence-building rule: every sentence must have ONE natural word order (no movable time or place phrases like "on Saturdays" or "in the park", no "walk and talk" pairs), because marking compares tiles in a fixed order.

## Rules from Miss Irene
- Images for teaching tools must be EMBEDDED in the files (inline SVG or base64 data URIs), never linked from
  external URLs. Done: the 29 quiz pictures (children's picture-book style, made with Canva AI, credited on the home screen) are
  embedded as base64 WebP (480x480) in the `PICS` map in `public/index.html` (page is about 590 KB). A new picture
  code in `api/_quiz.js` must be added to `PICS` (otherwise the plain emoji shows instead). To make a new one: Canva
  `generate-image` with one style line, then place it on a page of a Canva design and `export-design` as PNG.
  Fonts (Andika, Baloo 2; SIL OFL) are subset woff2 files in `public/fonts/`, loaded from `style.css`. Nothing is loaded from outside sites.
- If any sound is ever added: edge-tts MP3s embedded as base64 (voices en-SG-LunaNeural, en-GB-SoniaNeural or
  en-US-AnaNeural, rate -10%). Never use speechSynthesis.
- Year 2 friendly: big tap targets, short instructions, no negative marking.

## Challenge level: challenge-1 (39 marks, unlocked by full marks in the practice test)
- A pupil who has EVER scored 35/35 in the practice test is offered the Challenge level: on the result screen and on the
  "Hello, <name>" screen, on any device and after a retake. The page asks the server (`/api/quiz?level=challenge`, which
  checks the pupil's practice results in Blob with `hasFullMarks` in `api/_lib.js`); `/api/submit` (level "challenge")
  checks the same, so typing the address does not skip the practice test.
- A Vocabulary 6 x 1; B Spelling: type the WHOLE word, 6 x 2 (1 mark if exactly one letter is wrong);
  C Grammar: tap the word that fits the sentence, 6 x 1; D Sentence building, 7-8 words, 5 x 3.
- Both quizzes live in `api/_quiz.js` (PRACTICE, CHALLENGE). Every new picture code must be added to `PICS`
  in `public/index.html`. The teacher page has a Test selector (Practice / Challenge level).
- The practice screen shows "Let's practice!" (no "Mock test" wording for pupils).

## Planned tests
1. Mock test 1, easy (current): Sections A, B, D, 35 marks.
2. Mock test 2, medium: add Section C Grammar; spelling becomes typing the whole word.
3. Final competition: full 60-mark paper, Sections A-E, with a question bank so pupils get different versions.
