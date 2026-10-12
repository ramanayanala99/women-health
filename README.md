# MathsMadeEasyAI

MathsMadeEasyAI is a personal maths-learning website with guided lessons, an interactive teaching board, practice worksheets, and one-to-one AI conversation. The existing maths classroom was restored from the project history, replacing the former CycleAI women’s-health application.

Open `/tutor/index.html` from the home page to enter the classroom. Prepared lessons remain available when the AI connection is unavailable. Voice input and spoken replies depend on browser speech support and microphone permission.

## Netlify

The project uses Next.js with Netlify Functions for the AI tutor and Netlify Database for saved learning. Netlify AI Gateway supplies the AI provider configuration without adding credentials to source code. Database migrations live in `netlify/database/migrations/` and are applied during deployment. The daily cleanup removes expired learning records and usage counters.

Saved learning belongs to this browser through an HttpOnly cookie, not a user account. Clearing cookies loses access to that saved learning. AI replies are learning guidance, not guaranteed correct answers.

## Local development

Install the locked dependencies with `npm ci`, then use `netlify dev --port 8889` for local platform emulation.

## Validation

Run `npx tsc --noEmit` for type checking and `node --test tutor/tests/site-restoration.test.mjs tutor/tests/tutor-service.test.mjs tutor/tests/conversation-instructions.test.mjs tutor/tests/netlify-integration.test.cjs tutor/tests/visual-teaching.test.mjs` for restoration, tutor, classroom, and visual-teaching checks. Further curriculum tests and feature notes are in `tutor/`.
