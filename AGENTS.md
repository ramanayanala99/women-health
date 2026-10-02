<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:base44-agent-rules -->
# Base44 dev environment (imported app)

- Stack: Next.js 16.2.10 web (`src/`) + FastAPI backend (`backend/`), wired separately over HTTPS.
- `docker compose -f docker-compose.base44.yml up -d` boots: db (postgres 16), redis, api (uvicorn --reload, port 8000), web (next dev, port 3000).
- Web talks to the API via `NEXT_PUBLIC_API_URL=https://8000-$BASE44_PUBLIC_HOST_SUFFIX`; the API CORS allowlist must include `https://3000-$BASE44_PUBLIC_HOST_SUFFIX`.
- `next.config.ts` derives `allowedDevOrigins` from `BASE44_PUBLIC_HOST_SUFFIX` (never hardcode hosts).
- API env comes from `/run/base44/app.env` (JWT_SECRET_KEY, APP_ENCRYPTION_KEY; OPENAI_API_KEY optional — template fallback exists).
- Migrations run automatically at api startup (`alembic upgrade head`).
- Verify: `curl http://localhost:8000/health` → `{"status":"ok"}`; open preview at `/`.
- Backend tests: `docker compose -f docker-compose.base44.yml exec -T api pytest`.
<!-- END:base44-agent-rules -->
