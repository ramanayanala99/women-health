# Universal Maths

The attached Universal Online Maths Tutor snapshot was integrated into the existing Next.js project. The home page introduces the tutor; `/tutor/index.html` opens the original curriculum library and classroom. Previous women's health URLs redirect to the new home page.

## Teaching and conversation

### Animated and interactive visual teaching

Matched Grade 7 and Grade 8 lessons include animated concept models. Choose **Try the model** to pause and explore, then **Return to voice lesson** to continue at the same step. Fractions, number lines, graphs, equations, geometry, statistics and scientific notation have dedicated models. Independent exercises hide the lab. Mathematical display and English speech use explicit powers, roots, fractions and squared/cubed units. The **Visual maths lab** navigation button opens a standalone demonstration. See `docs/VISUAL_TEACHING_REUSE.md` for supported topics, limitations and instructions for reusing the browser-only toolkit in another app.

### Grade 8 international voice lessons

Choose **Grade 8 voice classes** for one unified international course with 18 chapters, 42 subchapters and 60 original voice lessons. Each class follows the Grade 7 format: two worked examples, an understanding check, four guided replies, and a ten-question scored exercise. Search by chapter, subchapter or skill; resume a saved class and review results in the Grade 8 dashboard. Typed answers work with the microphone off. The course guide explains checked sources and grade-placement differences; this is not an exhaustive import of every country's syllabus. See `docs/GRADE8_INTERNATIONAL.md` for scope and validation.

Prepared lessons, examples, diagrams, worksheets, scratchpad, guided questions, and the original learning reports remain available. Choose a level, chapter, and topic in the classroom. Start a prepared lesson, or choose **Start AI conversation** to discuss the selected topic. The tutor answers one step at a time, offers hints, and checks understanding rather than just supplying answers.

Live conversation uses the modern Netlify Function at `/api/tutor/teacher` and Netlify AI Gateway. No external Worker address or browser API key is needed. The supported gateway model is `gpt-5.4-mini`. Usage consumes Netlify AI credits. Live AI mode waits for the student's next reply rather than automatically generating more paid replies after a short timeout. The endpoint limits questions to 1,000 characters and conversation to 100 turns per hour per network address, with a separate platform request limit.

Speech playback uses browser speech synthesis. Browser microphone recognition requires permission and a supported browser, usually Chrome or Edge over HTTPS. Typing is always available. Provider-generated audio, voice cloning, talking portraits, photo analysis, and automatic generation of missing lessons are not connected in this version; their unavailable media controls are hidden. Missing curriculum topics must not be mistaken for prepared lessons.

### One-to-one chat with the microphone off

In the classroom's Tutor panel, choose **Start one-to-one chat**, then type an answer or question and press **Send**. Follow-up messages stay in the same AI conversation rather than being treated as interruptions to a prepared lesson. Conversation history opens when the chat starts.

The microphone starts off and is never enabled just by starting a chat. Choose **Turn microphone on** to explicitly request permission, then choose **Allow** in the browser prompt. **Type instead** stops listening and focuses the reply field. The indicator follows both continuous listening and the existing one-reply **Speak** control. If permission is blocked, the inline help explains site permissions, device mute checks, and opening the classroom in a separate tab. Unsupported browsers fall back to typing without attempting the unconnected recorded-audio service.

### Natural spoken conversation

Choose **Start talking with your tutor** in the Tutor panel. The app checks the deployed AI connection, requests microphone permission, then starts a spoken greeting and a short question. Speak normally: the browser transcribes your words, the AI answers your actual question using the recent conversation, and the tutor reads the answer and its follow-up aloud. The tutor waits for you instead of automatically generating another paid turn.

Speech playback uses the selected browser voice, language, and speaking speed. You can interrupt a reply to ask something else; stale audio completion events do not restart narration. Use headphones to reduce speaker echo. **Stop conversation**, saying **stop conversation**, or leaving live AI mode stops listening and cancels speech. **Type instead** turns off listening without discarding the conversation. Hardware microphone access, browser speech support, and a deployed AI endpoint are required; blocked embedded previews must be opened in a separate tab. A failed readiness check is shown explicitly rather than replaced with a simulated AI reply.

Dedicated conversation instructions ask the tutor to greet naturally, answer directly, explain in everyday language, and ask just one relevant follow-up before waiting. Prepared lessons and their interruption/resume rules remain separate.

## Saved learning and privacy

Progress, preferences, worksheets, and conversation resume checkpoints use Netlify Database. A random HttpOnly, same-site cookie links this browser to its own saved records; this is not a login or a cross-device account. Clearing cookies loses access to those records. Do not use a shared browser for private learning details.

The classroom first loads saved state, then starts the imported scripts. Its synchronous compatibility layer is a temporary cache only; persistence occurs through the database endpoint, not local storage. Save failures are displayed in the classroom status bar. **Retry saving** reconnects or retries pending writes. **Delete my saved learning** requires confirmation and deletes this browser's records.

Progress expires after 30 days without an update to each record. The daily scheduled cleanup removes expired progress and rate-limit counters. The schema is supplied in `netlify/database/migrations/`; Netlify applies the migration during deployment. A nickname is sufficient. AI questions and recent lesson context are sent to the AI provider with response storage disabled. Browser speech recognition may use the browser vendor's speech service.

AI is a learning companion, not a guaranteed replacement for a qualified teacher. Important answers should be checked with a teacher or trusted adult. Automated prepared-lesson scores and AI conversation are separate; conversation alone does not establish mastery.

## Validation

- Type checking: `npx tsc --noEmit`
- Integration and endpoint tests: `node --test tutor/tests/netlify-integration.test.cjs tutor/tests/tutor-service.test.mjs tutor/tests/conversation-instructions.test.mjs`
- Imported classroom smoke tests: `node tutor/tests/classroom-smoke.cjs`
- Imported curriculum and teaching tests are in `tutor/tests/`; paths were updated for the Next.js public folder.

The original author’s curriculum and review notes are retained in `tutor/docs/` as historical reference. The original Worker and its tests are retained privately in `tutor/backend/` for comparison; that Worker is not deployed or served publicly. These files describe the uploaded snapshot, not the Netlify backend setup. Some older isolated conversation tests omit scripts required by the latest Grade 7 pack; the full classroom integration tests cover actual load order. No build command is needed during editing; the deployment system validates the build.
