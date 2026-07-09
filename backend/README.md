# CycleAI Backend

The API behind CycleAI — an AI Women's Health Operating System. Educational
and wellness guidance only: it does not diagnose, prescribe, or replace
professional medical care.

## Tech stack

- **FastAPI** — REST API framework
- **PostgreSQL** (SQLite fallback for local dev) — primary datastore
- **SQLAlchemy 2.0** + **Alembic** — ORM and migrations
- **JWT** (access + refresh tokens) — authentication
- **OpenAI API** — AI Coach, with a deterministic offline fallback
- **Redis** (optional) — response caching; the app runs fine without it
- **Fernet (cryptography)** — application-layer encryption for sensitive free text

## Architecture

```
app/
  core/            config, database session, JWT + password hashing, field encryption, cache
  models/          SQLAlchemy models — the 9 core tables
  schemas/         Pydantic request/response schemas
  api/routes/      one file per resource, thin — delegates to services/
  services/        the 5 AI systems + report generation + shared safety copy
alembic/           migrations (versioned schema history)
tests/             pytest suite, runs against an isolated in-memory SQLite DB
```

### Core tables

| Table | Purpose |
|---|---|
| `users` | account + hashed password |
| `cycles` | logged periods (start date, length, period length) |
| `symptoms` | daily wellness logs — mood, energy, sleep, stress, pain, symptoms, cravings, notes |
| `predictions` | persisted output of the prediction engines |
| `ai_conversations` | AI Coach chat turns (encrypted) |
| `insights` | detected patterns/trends |
| `reports` | generated monthly doctor-friendly summaries |
| `user_settings` | notification/theme/units/consent preferences |
| `notifications` | in-app notification queue |

### The 5 AI systems (`app/services/`)

All five are transparent, rule-based / statistical engines learned from a
user's *own* data — not opaque trained ML models. That's a deliberate MVP
choice: every number they produce is explainable and traceable back to a
specific calculation, which matters a lot for a health product.

1. **Cycle Prediction Engine** (`cycle_prediction.py`) — learns the user's
   average cycle/period length from their own logged cycles, predicts the
   next period, ovulation date, and fertile window, and reports a confidence
   score plus an irregularity flag. It's also **life-stage aware**: it reads
   the user's self-reported `life_stage` (`reproductive` / `perimenopause` /
   `menopause` / `postmenopause` / `unsure`, set via `PUT /profile`) so it
   doesn't force a 45-year-old in perimenopause into a textbook 28-day
   forecast. Perimenopause (or a data-driven long gap / very long logged
   cycle, detected independent of self-report) switches the phase to
   `"irregular"` with capped confidence and a note explaining why. Menopause
   and postmenopause stop forecasting a next period entirely, since one
   isn't expected.
2. **Symptom Prediction Engine** (`symptom_prediction.py`) — looks at which
   symptoms have historically clustered around the same point in past cycles
   and surfaces likely symptoms for the next few days.
3. **Pattern Detection Engine** (`pattern_detection.py`) — computes real
   statistical correlations (Pearson's r) between logged metrics, e.g.
   sleep vs. next-day mood, always labeled as an observed correlation with a
   sample size, never a proven cause.
4. **Recommendation Engine** (`recommendation.py`) — turns the current phase
   and recent logs into 1-4 short, actionable wellness suggestions
   (hydration, movement, rest, stress management).
5. **AI Coach** (`ai_coach.py`) — wraps the OpenAI Chat Completions API with a
   safety-first system prompt and the user's own context. If no
   `OPENAI_API_KEY` is configured, it falls back to a deterministic templated
   reply — grounded in the same context and real Recommendation Engine
   output — so the endpoint is always usable, and still genuinely helpful,
   without a live model.

### AI safety (`app/services/safety.py`)

CycleAI is not a doctor. It does not diagnose, does not prescribe, and does
not replace professional medical care. It may explain general health and
cycle-related patterns, give wellness education, and suggest hydration,
rest, gentle movement, nutrition, sleep, and stress reduction. One shared
module of safety copy and rules enforces this everywhere the AI surfaces
content (dashboard, AI Coach, insights, reports):

- Never diagnoses a condition or names a disease.
- Never prescribes medication or dosages.
- Never makes emergency medical claims.
- Always explains uncertainty (confidence scores, sample sizes, "estimate not
  a guarantee" language).
- Calm, supportive, clear, non-scary tone — enforced via the system prompt,
  even in the escalation notice itself.

Escalation to "please see a healthcare professional" is checked two
independent ways, and either one is enough to trigger it:

1. **Message-based** (`detect_severity_flag`) — phrase matching for severe
   pain, very heavy bleeding, language suggesting a symptom is unusual or
   persistent for that user, sudden worsening, fear/danger/emergency
   language, and pregnancy mentioned alongside a concerning symptom.
2. **Data-based** (`has_persistent_or_worsening_pattern`) — looks at the
   user's own last 5 days of symptom logs, independent of what they just
   typed, and flags high pain or a repeated symptom recurring across most of
   those days, or today's pain level jumping well above their own recent
   baseline. This is what catches "persistent" and "suddenly worse" even
   when the current message doesn't mention it at all.
3. **Data-based** (`has_notable_bleeding_pattern`) — looks at the Cycle
   table (not symptom logs) and flags any recently-logged period once a
   user has told us she's in menopause or postmenopause, or a period that
   follows a much longer gap than her own usual pattern. This is the
   perimenopause-relevant check: bleeding after menopause, or after a long
   unexplained gap, is always worth a professional look regardless of what
   the conversation is actually about.

All three checks are intentionally conservative and biased toward
over-flagging, not under-flagging — this is a safety net layered on top of
the model's own judgment, not a substitute for it.

### Security

- Passwords hashed with bcrypt (`passlib`), never stored or logged in plaintext.
- JWT access (60 min) + refresh (30 day) tokens, `HS256`, unique `jti` per token.
- `Symptom.notes` and `AIConversation.message` are encrypted at the field
  level with Fernet before they ever reach the database (see
  `core/encryption.py`) — verified in this repo's smoke test by reading the
  raw SQLite row and confirming it's ciphertext, not plaintext.
- CORS is allow-listed via `CORS_ORIGINS`; the app is designed to sit behind
  HTTPS in any real deployment (terminate TLS at your load balancer/ingress).
- `DELETE /account` requires re-entering the password and cascades to every
  table that references the user (real deletion, not a soft-delete flag).
- `GET /account/export` returns a full, portable JSON export of everything
  CycleAI stores about the user.

## API

| Method | Path | Notes |
|---|---|---|
| POST | `/auth/register` | creates account + default settings, returns tokens |
| POST | `/auth/login` | returns tokens |
| GET | `/profile` | current user |
| PUT | `/profile` | update display name |
| POST | `/cycles` | log a cycle; backfills the previous cycle's length |
| GET | `/cycles` | list logged cycles |
| POST | `/symptoms` | log a day's mood/energy/sleep/stress/pain/symptoms/cravings/notes |
| GET | `/symptoms` | list logs, optional `start`/`end` date filters |
| GET | `/dashboard` | greeting, forecast, recent metrics, recommendations, likely symptoms |
| GET | `/forecast` | Cycle Prediction Engine output on its own |
| POST | `/ai/chat` | AI Coach — `{message, session_id?}` |
| GET | `/insights` | Pattern Detection Engine output |
| GET | `/reports/monthly` | generates (or returns cached) doctor-friendly summary; `?year=&month=` |
| GET / PUT | `/settings` | notification/theme/units/consent preferences |
| DELETE | `/account` | permanent deletion, requires `{password}` |
| GET | `/account/export` | full data export (additive, beyond the original spec, to satisfy the "data export" security requirement) |

Full interactive docs at `/docs` (Swagger) and `/redoc` once running.

## Running locally (SQLite, zero config)

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

cp .env.example .env
# Minimum for local dev: leave DATABASE_URL as the sqlite default,
# and set JWT_SECRET_KEY / APP_ENCRYPTION_KEY (see .env.example for how to generate).

alembic upgrade head
uvicorn app.main:app --reload
```

Then open http://localhost:8000/docs.

## Running with Docker Compose (Postgres + Redis)

```bash
cd backend
export JWT_SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_urlsafe(64))")
export APP_ENCRYPTION_KEY=$(python3 -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())")
docker compose up --build
```

## Tests

```bash
source .venv/bin/activate
pytest -q
```

Each test gets a fresh, isolated in-memory SQLite database (see
`tests/conftest.py`) — no shared state between tests, no external services
required. The AI Coach tests run against the offline template fallback
(no `OPENAI_API_KEY` needed to pass CI).

## Environment variables

See `.env.example` for the full list with generation instructions. The
important ones:

- `DATABASE_URL` — Postgres in production, SQLite is fine for local dev.
- `JWT_SECRET_KEY` — long random string; rotating it invalidates all tokens.
- `APP_ENCRYPTION_KEY` — Fernet key for encrypted columns. **Back this up** —
  losing it makes existing encrypted notes/messages unrecoverable.
- `OPENAI_API_KEY` — optional; AI Coach runs in offline template mode without it.
- `REDIS_URL` — optional; caching is silently disabled without it.
