from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import account, ai, cycles, dashboard, forecast, insights, profile, reports
from app.api.routes import auth as auth_routes
from app.api.routes import settings as settings_routes
from app.api.routes import symptoms as symptoms_routes
from app.core.config import settings

app = FastAPI(
    title="CycleAI API",
    description=(
        "Backend for CycleAI — an AI Women's Health Operating System. "
        "Educational and wellness guidance only; does not diagnose, prescribe, "
        "or replace professional medical care."
    ),
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router)
app.include_router(profile.router)
app.include_router(cycles.router)
app.include_router(symptoms_routes.router)
app.include_router(dashboard.router)
app.include_router(forecast.router)
app.include_router(ai.router)
app.include_router(insights.router)
app.include_router(reports.router)
app.include_router(settings_routes.router)
app.include_router(account.router)


@app.get("/health", tags=["meta"])
def health() -> dict:
    return {"status": "ok", "environment": settings.ENVIRONMENT}
