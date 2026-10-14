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
- `api/submit.js` marks on the server and saves one JSON file per attempt in Blob under `results/<quiz id>/`.
- `api/results.js` (POST): teacher PIN check, then list or delete results. The PIN is checked against the
  spelling app's teacher PIN (`/api/admin`, action "load"); a `QUIZ_PIN` env var also works.
- Ranking (teacher page): total, then sentence building (D), then spelling (B), then shorter time.
  Only each pupil's first attempt is ranked; retakes are shown separately.

## Current test: mock-easy-2 (easy level, 19 questions, 35 marks)
- A Vocabulary: picture, choose the word, 8 x 1 mark
- B Spelling: picture, tap letter tiles for 2 missing letters, 6 x 2 marks (1 per letter)
- D Sentence building: tap word tiles in order, 5 x 3 marks (partial marks by words in the right place)
- No listening items (audio may not work on some school devices).

## Rules from Miss Irene
- Images for teaching tools must be EMBEDDED in the files (inline SVG or base64 data URIs), never linked from
  external URLs. Done: the 19 OpenMoji pictures (v15.1.0, CC BY-SA 4.0, credited on the home screen) are embedded
  as base64 SVG in the `PICS` map in `public/index.html`. A new picture code in `api/_quiz.js` must be added to `PICS`
  (otherwise the plain emoji shows instead). Fonts (Andika, Baloo 2; SIL OFL) are subset woff2 files in `public/fonts/`, loaded from `style.css`. Nothing is loaded from outside sites.
- If any sound is ever added: edge-tts MP3s embedded as base64 (voices en-SG-LunaNeural, en-GB-SoniaNeural or
  en-US-AnaNeural, rate -10%). Never use speechSynthesis.
- Year 2 friendly: big tap targets, short instructions, no negative marking.

## Planned tests
1. Mock test 1, easy (current): Sections A, B, D, 35 marks.
2. Mock test 2, medium: add Section C Grammar; spelling becomes typing the whole word.
3. Final competition: full 60-mark paper, Sections A-E, with a question bank so pupils get different versions.
