HANDOFF FOR REVIEW

The user needs a natural one-to-one class: teach briefly, draw on the board,
listen to an interruption, answer that student's question, then continue
from the same unfinished lesson step. Acknowledgements such as “I am good”
should move the interaction forward. Guided practice must include all four
questions and their full working, followed by ten independently scored items.

Current focus files
- dist/grade7-class.js: prepared Grade 7 flow and connected AI conversations.
- dist/classroom-live-mic.js: native recognition and recorded fallback.
- dist/classroom-conversation.js: general classroom conversation handling.
- backend/teacher-worker.mjs: provider requests and backend routes.
- dist/style.css and dist/classroom.js: board appearance and controls.

Latest automated checks passed using simulated browser/provider services:
Grade 7 lesson/data checks, spoken decimals/fractions, split final speech events,
acknowledgement during working, AI question/response and resume, stale-response
cancellation, general conversation scenarios and recorded microphone fallback.

Known verification limits
Real-device microphone, acoustic echo, actual provider replies and voice timing
are not verified by these simulations. The user has reported recurring voice
and practice-flow problems; test a complete real conversation before claiming
that these are resolved. Use the same selected lesson throughout the test.
Browser speech recognition quality can vary. A backend must be connected for
open-ended AI replies. Browser-local progress is not shared cloud storage.

Coverage
Grade 7 currently includes 219 audited textbook skill lessons, 59 retained
legacy/extra lessons, 15 textbook chapters and 65 numbered sections.
Other catalogues are included; do not claim verified complete global coverage.

To run frontend regression tests, install jsdom in the extracted project
(e.g. npm install --no-save jsdom), then run from the project folder:
node tests/grade7-class.cjs
node tests/natural-classroom.cjs
node tests/live-recorded-classroom.cjs
Backend unit checks:
node --test backend/teacher-worker.test.mjs

Frontend tests mock browser and provider services; they do not spend API credits.
