# Natural classroom upgrade — 6 October 2026

This extends the existing tutor; it does not replace the lesson compiler, library, curriculum navigation, reviewed-plan approval, diagrams, workspace, worksheets, progress rules, parent summary, media controls or backend connection.

## What changed

- `dist/classroom-conversation.js`: conversational overlay, deterministic intent routing, explicit lesson state, temporary session memory, interrupted narration chunk, board snapshot, return controls, short narration segments, confidence signals and local fallback responses.
- `dist/classroom-live-mic.js`: opt-in open microphone, native speech-start interruption; recorded fallback uses local voice activity detection, rolling pre-roll, silence termination and authenticated transcription. Speak remains manual fallback.
- `dist/teacher-replies.js`: saves a resume point before composing or manually speaking.
- `dist/app.js`: retains full board text so unfinished writing can continue after an interruption.
- `dist/agent.js`: realistic voice failure can use browser narration.
- `dist/teacher-presence.js`: speaking/listening/processing/paused indicators follow the conversation controller.
- `dist/index.html` and `dist/style.css`: load the controllers and fit controls into the existing classroom.
- `backend/teacher-worker.mjs`: bounds and passes relevant curriculum, visual, question, mistake, confidence and resume context; short teacher replies, small-talk and safety instructions. Updated downloadable backend package/source match this file.

## Test it

1. Choose a prepared topic and start voice teaching.
2. Press Live listening and grant microphone permission. Use headphones.
3. Speak while the teacher is talking. Speech detection stops playback; the completed utterance is sent to the conversation controller.
4. Try “Wait”, “Why do we do that?”, “I don’t understand”, “Show another example”, “How are you?” and “Continue”.
5. The Back to our lesson button or Continue restores the same stage and question. Pause never resumes itself.
6. Turn live listening off or use Speak/typing whenever needed.

## State and return

A resume point stores topic/student/context identity, stage, question index, example/board step, introduction beat, narration chunk, board/visual HTML, pending board text, scoring counters, attempts, challenge and confidence-check flags, agent question/history and control visibility. Nested interruptions retain the original point. Restoring does not call the lesson renderer, which could reset question attempts. The interrupted speech chunk is replayed; sentence-level replay is intentional. It is not sample-accurate audio seeking.

The structured state exposes curriculum/course/grade/chapter/topic/objective, stage/example/step/question, visual/board, recent answers/mistakes, confidence and current audio mode. Detour context is bounded by the Worker. The lesson library remains authoritative; unreviewed clarification never overwrites a saved reviewed plan.

## Routing and adaptation

Intent routing covers answers, questions, confusion, repeat/hint/example requests, small talk, personal chat, off-topic requests, pause/resume, not knowing and sensitive disclosures. Weather is handled separately and never fabricated. English heuristics are deterministic; ambiguous or multilingual utterances may require clarification. This is not a fully multilingual intent model.

Prepared numeric answers still use the existing checked answer keys and mastery rules. Open-ended reasoning can receive AI feedback without gaining automatic credit. Confidence and repeated mistakes guide simpler AI examples, slower browser speech and existing prerequisite-refresher controls. Existing confidence buttons still choose the prepared practice pace. Optional five-second numeric timing offers help; it does not guess an answer or mark progress. Explicit demo autoplay remains separate.

Small talk is brief, honest about being AI and steered back after two turns. Raw detour history and casual facts stay in memory and are not written to checkpoints or progress. Sensitive disclosures receive a local supportive trusted-adult/urgent-help response; no private details are requested, no automatic notification is sent and the lesson stays paused.

## Verification and limits

`tests/natural-classroom.cjs` exercises the requested interruption, resume, question, confusion, wrong-answer, small-talk, off-topic, provider failure, stale-response and progress-isolation scenarios with full script loading. `tests/live-recorded-classroom.cjs` checks local VAD onset, buffered transcription, pause and stream cleanup. `tests/classroom-access.cjs` checks complete prepared lesson progression and permission diagnostics. Existing focused controller tests continue independently; the three focused legacy reply/session/timing tests omit the new overlay because their old assumption (every open question permanently activates Agent mode) was replaced by a temporary detour. Full integration checks load it.

All checks simulate audio and API services. Real microphone permissions, speech recognition, acoustic echo, silence thresholds, audio fragment decoding, provider latency, cloning and generated video require testing on physical browsers/services. Headphones reduce teacher-audio feedback, but this implementation does not guarantee acoustic echo rejection. It is an event-driven browser prototype, not a verified production full duplex voice service.

Your user-managed Cloudflare Worker is not updated by publishing the frontend. Deploy `backend/teacher-worker.mjs` there, retaining its secrets and allowed origin, to enable the structured context and recorded transcription. AI/voice/transcription requests incur provider usage. If disconnected, prepared teaching, hints, numeric checking and typing work; open-ended offline questions receive prepared help rather than invented answers.

## Voice reply recovery

The classroom toolbar now always shows Microphone on/off, recognized words, teacher activity and a Type a reply button. Native recognition submits pending recognized words 1.2 seconds after a speech-end event if the browser never emits a final result, or on recognition end. A late duplicate final result is ignored. Send spoken reply is available for manually submitting visible interim words. Incoming spoken replies open the Tutor tab so the response is visible. These paths are covered by simulated interim-only and late-final tests; actual device/service behavior remains unverified.

### Conversation routing correction

Casual-turn counts reset on returning to teaching, submitting a lesson answer, or asking for academic help. Unrecognised utterances default to a lesson question unless they answer an active casual exchange; explicit unrelated subjects still receive a brief return-to-lesson invitation. A short affirmative acknowledgement can resume after casual chat. Simulated integration checks cover fresh chat detours, mood replies, academic questions after the casual limit, and exact lesson-state restoration.

## Prepared Grade 7 conversations and chalkboard (October 8 update)

Prepared classes now send student questions to the configured `/teacher` endpoint without switching to Agent teaching mode. Conversation turns carry the selected lesson, current question, board steps and resume point. Follow-up replies stay in that conversation until the student continues, or the teacher finishes without asking a question. The prepared question, guided marks and exercise remain under the class controller. Cancelled or outdated replies are ignored. Missing connections are reported explicitly.

Spoken decimal, fraction and compound-number answers are parsed, and unfinished native-recognition fragments are held instead of being graded. Acknowledgements during worked steps resume the spoken chunk when browser word boundaries are available; provider audio resumes the current chunk. The blackboard uses white chalk writing and diagram outlines by default, with existing color controls retained.

The Grade 7 regression suite covers split final recognition, spoken answer forms, working-step acknowledgements, connected classroom questions, checkpoint restoration and stale-response cancellation. Provider and browser services are simulated; this does not establish real-device microphone or voice performance.
