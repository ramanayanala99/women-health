# Grade 8 international voice course

The standalone classroom now provides 18 original chapters, 42 subchapters and 60 prepared skill lessons. Select **Grade 8 voice classes** in the navigation, or Grade 8 in the universal course picker. This is a unified international course, not a country-by-country curriculum import.

Every lesson uses the shared Grade 7 one-to-one engine: introduction and definition, two voiced worked examples, an understanding gate, four guided questions, ten independent exercise questions, scoring, mistake review and a resumable checkpoint. Existing typed and spoken conversations remain available. Prepared classes do not need AI inference or microphone permission.

The source-checking notes, official references, topic map and limitations are published in `public/tutor/grade8-course-guide.html`. Source checks on 9 October 2026 retrieved the Common Core Grade 8 overview, England's stage-wide KS3 programme and South Africa's Senior Phase CAPS PDF. The NCERT Grade 8 PDF was unavailable; no NCERT-edition alignment or exhaustive worldwide coverage was asserted. Some included topics are stage-wide enrichment rather than a universal Grade 8 requirement.

## Data and teaching

- `public/tutor/grade8-class-data.js` contains original topic definitions and parameterised question recipes. Each lesson contains 16 questions: two worked examples, four guided questions and ten exercise questions.
- `public/tutor/grade8-class.js` registers the lessons, course browser, sources, learner-specific dashboard and practical review.
- `public/tutor/grade7-class.js` resolves the selected grade's registry without duplicating the teaching engine. Grade 7 content and history remain separate.
- Grade 8 attempts use one `ut-grade8-class-attempt-v1:<attempt-id>` record per attempt through the existing Netlify Database-backed `tutorStorage` adapter. Checkpoint keys already include learner and unique lesson ID. No new database schema is required. Retention remains governed by the existing service's 30-day browser session.
- Compass-and-straightedge work has a separate parent/teacher review. Automatic scoring measures the ten supporting numerical questions, not drawing quality or proof.

## Validation

Run `node tutor/tests/grade8-class.mjs` for catalogue uniqueness, independently recalculated numeric answers, visual schema, all lessons reaching a voiced understanding gate, grade switching, search, guided replies, marking, grade/learner isolation, resume, next-topic navigation and practical review. Run `node tutor/tests/grade7-class.cjs` for shared-engine regressions. Browser audio is simulated; no microphone hardware or paid AI inference is tested.

The course is not a comprehensive assessment of every national standard. Single-coordinate and coefficient questions intentionally assess component skills. Proofs, varied representations, construction evidence, broader open-ended reasoning and additional national mappings need teacher review or subsequent work.
