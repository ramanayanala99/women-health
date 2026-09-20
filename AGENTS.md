<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project setup (CycleAI — Women's Health app)

Fullstack app: **Next.js 16** frontend (port 3000) + **FastAPI** backend (port 8000, separate origins).

- `docker-compose.base44.yml` is the dev entry point — runs from cloned source with live reload.
- Frontend talks to the backend via `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:8000`). In the Base44 preview it's set to the public backend URL.
- Backend uses PostgreSQL (required) and Redis (optional cache). Both run as compose services.
- `JWT_SECRET_KEY` and `APP_ENCRYPTION_KEY` are delivered via `/run/base44/app.env` (generated for dev). The app boots fine without them (defaults/no-encryption fallback), but they're set for a proper dev experience.
- `OPENAI_API_KEY` is optional — the AI Coach falls back to a deterministic template responder when unset.
- Backend runs `alembic upgrade head` on startup before launching uvicorn with `--reload`.
- `next.config.ts` has `allowedDevOrigins` configured for the Base44 preview origin (required for Next dev assets/HMR).
- Verify: `curl localhost:8000/health` → `{"status":"ok"}` and `curl localhost:3000` → HTML page.
