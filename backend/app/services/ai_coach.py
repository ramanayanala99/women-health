"""AI Coach.

Wraps the OpenAI Chat Completions API with:
- a safety-first system prompt (see `services.safety`)
- the user's own cycle/context data, so answers feel personal
- a deterministic offline fallback so the endpoint works in dev/CI
  without an API key, and stays available if OpenAI has an outage
- conversation persistence to AIConversation (encrypted at rest)
"""

from __future__ import annotations

import logging
import uuid

from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.ai_conversation import AIConversation
from app.models.symptom import Symptom
from app.models.user import User
from app.services.cycle_prediction import build_forecast
from app.services.recommendation import generate_recommendations
from app.services.safety import (
    AI_COACH_SYSTEM_PROMPT,
    ESCALATION_NOTICE,
    detect_severity_flag,
    has_notable_bleeding_pattern,
    has_persistent_or_worsening_pattern,
)

logger = logging.getLogger(__name__)

MAX_HISTORY_TURNS = 10

LIFE_STAGE_LABELS = {
    "reproductive": "reproductive years",
    "perimenopause": "perimenopause",
    "menopause": "menopause",
    "postmenopause": "postmenopause",
    "unsure": "not specified",
}


def _build_context_summary(db: Session, user: User) -> str:
    forecast = build_forecast(db, user.id, life_stage=user.life_stage)
    latest_log = (
        db.query(Symptom)
        .filter(Symptom.user_id == user.id)
        .order_by(Symptom.log_date.desc())
        .first()
    )

    lines = [f"Life stage: {LIFE_STAGE_LABELS.get(user.life_stage, 'not specified')}."]
    if forecast.has_data:
        lines.append(
            f"Current cycle day: {forecast.current_cycle_day} ({forecast.current_phase} phase)."
        )
        if forecast.predicted_next_period is not None:
            lines.append(
                f"Predicted next period in {forecast.days_until_next_period} day(s); "
                f"confidence {forecast.confidence}."
            )
        lines.append(forecast.note)
    else:
        lines.append("The user has not logged any cycles yet.")

    if latest_log:
        parts = []
        if latest_log.mood is not None:
            parts.append(f"mood {latest_log.mood}/5")
        if latest_log.energy is not None:
            parts.append(f"energy {latest_log.energy}/5")
        if latest_log.sleep_hours is not None:
            parts.append(f"sleep {latest_log.sleep_hours}h")
        if latest_log.stress is not None:
            parts.append(f"stress {latest_log.stress}/5")
        if latest_log.symptoms:
            parts.append("symptoms: " + ", ".join(latest_log.symptoms))
        if parts:
            lines.append(f"Most recent log ({latest_log.log_date}): " + ", ".join(parts))

    return "\n".join(lines)


def _offline_template_reply(db: Session, user: User, message: str, context_summary: str) -> str:
    """A safe, honest fallback used when no OPENAI_API_KEY is configured.

    Still genuinely useful rather than just an apology: it grounds the reply
    in the user's real context and offers real wellness suggestions from the
    Recommendation Engine, so the "what CycleAI may do" list (explain
    patterns, give wellness education, suggest hydration/rest/movement/
    nutrition/sleep/stress reduction) holds even without a live model.
    """
    forecast = build_forecast(db, user.id, life_stage=user.life_stage)
    recommendations = generate_recommendations(db, user.id, forecast)
    suggestion_lines = "\n".join(f"- {rec.title}: {rec.description}" for rec in recommendations[:2])

    return (
        "Here's what I can see in your patterns:\n\n"
        f"{context_summary}\n\n"
        f"On \"{message.strip()}\" — I'm currently running in offline demo mode (no OpenAI API key "
        "configured), so I can't reason about your specific question the way I would live. Based "
        "on your recent data, though, here's some general wellness guidance that may help:\n\n"
        f"{suggestion_lines}\n\n"
        "This is general educational guidance, not a diagnosis — if something feels severe, "
        "persistent, or unusual for you, please talk to a healthcare professional."
    )


def _call_openai(
    system_prompt: str, history: list[dict], message: str
) -> str | None:
    if not settings.OPENAI_API_KEY:
        return None

    try:
        from openai import OpenAI

        client = OpenAI(api_key=settings.OPENAI_API_KEY)
        messages = [{"role": "system", "content": system_prompt}, *history, {"role": "user", "content": message}]
        response = client.chat.completions.create(
            model=settings.OPENAI_MODEL,
            messages=messages,
            temperature=0.6,
            max_tokens=400,
        )
        return response.choices[0].message.content
    except Exception:  # noqa: BLE001 - never let a provider outage break the chat endpoint
        logger.exception("OpenAI call failed; falling back to offline template reply")
        return None


def chat(db: Session, user: User, message: str, session_id: str | None) -> tuple[str, bool, str]:
    session_id = session_id or str(uuid.uuid4())
    context_summary = _build_context_summary(db, user)

    # Three independent signals: what the user just typed, what their recent
    # symptom logs show, and what their cycle history shows. Any one is
    # enough — see services.safety for why.
    escalation_flagged = (
        detect_severity_flag(message)
        or has_persistent_or_worsening_pattern(db, user.id)
        or has_notable_bleeding_pattern(db, user.id, user.life_stage)
    )

    history_rows = (
        db.query(AIConversation)
        .filter(AIConversation.user_id == user.id, AIConversation.session_id == session_id)
        .order_by(AIConversation.created_at.asc())
        .limit(MAX_HISTORY_TURNS)
        .all()
    )
    history = [{"role": row.role, "content": row.message} for row in history_rows]

    system_prompt = f"{AI_COACH_SYSTEM_PROMPT}\n\nUser context:\n{context_summary}"
    reply = _call_openai(system_prompt, history, message)
    if reply is None:
        reply = _offline_template_reply(db, user, message, context_summary)

    if escalation_flagged and ESCALATION_NOTICE not in reply:
        reply = f"{reply}\n\n{ESCALATION_NOTICE}"

    db.add(AIConversation(user_id=user.id, session_id=session_id, role="user", message=message))
    db.add(
        AIConversation(
            user_id=user.id,
            session_id=session_id,
            role="assistant",
            message=reply,
            escalation_flagged=escalation_flagged,
        )
    )
    db.commit()

    return reply, escalation_flagged, session_id
