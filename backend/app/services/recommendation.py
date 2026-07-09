"""Recommendation Engine.

Turns the current phase, recent logs, and detected patterns into a
short list of gentle, actionable wellness suggestions. Always general
wellness guidance (hydration, movement, rest, stress management) —
never a treatment plan.
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date, timedelta

from sqlalchemy.orm import Session

from app.models.symptom import Symptom
from app.services.cycle_prediction import CycleForecast

RECENT_WINDOW_DAYS = 7


@dataclass
class Recommendation:
    icon: str
    title: str
    description: str


def _recent_logs(db: Session, user_id: str, today: date) -> list[Symptom]:
    since = today - timedelta(days=RECENT_WINDOW_DAYS)
    return (
        db.query(Symptom)
        .filter(Symptom.user_id == user_id, Symptom.log_date >= since)
        .order_by(Symptom.log_date.desc())
        .all()
    )


def generate_recommendations(
    db: Session, user_id: str, forecast: CycleForecast, today: date | None = None
) -> list[Recommendation]:
    today = today or date.today()
    logs = _recent_logs(db, user_id, today)

    recs: list[Recommendation] = []

    sleep_values = [log.sleep_hours for log in logs if log.sleep_hours is not None]
    avg_sleep = sum(sleep_values) / len(sleep_values) if sleep_values else None

    stress_values = [log.stress for log in logs if log.stress is not None]
    avg_stress = sum(stress_values) / len(stress_values) if stress_values else None

    pain_values = [log.pain_level for log in logs if log.pain_level is not None]
    max_pain = max(pain_values) if pain_values else None

    energy_values = [log.energy for log in logs if log.energy is not None]
    avg_energy = sum(energy_values) / len(energy_values) if energy_values else None

    if avg_sleep is not None and avg_sleep < 7:
        recs.append(
            Recommendation(
                icon="😴",
                title="Wind down a little earlier tonight",
                description="Your logged sleep has averaged under 7 hours this week — an earlier bedtime tonight may help energy tomorrow.",
            )
        )

    if avg_stress is not None and avg_stress >= 4:
        recs.append(
            Recommendation(
                icon="🧘",
                title="Try a short breathing break",
                description="Stress has been running high in your recent logs. A few minutes of slow breathing or a short walk can help you reset.",
            )
        )

    if max_pain is not None and max_pain >= 4:
        recs.append(
            Recommendation(
                icon="🩹",
                title="Be gentle with yourself today",
                description="You've logged higher pain recently. Warmth, rest, and gentle stretching often help — and if it feels severe or unusual, please check in with a healthcare professional.",
            )
        )

    if forecast.has_data and forecast.current_phase == "luteal":
        recs.append(
            Recommendation(
                icon="🍽️",
                title="Steady meals help steady energy",
                description="You're in your luteal phase, when cravings and energy dips are common. Balanced meals with protein and fiber can help even things out.",
            )
        )

    if forecast.has_data and forecast.current_phase == "ovulation":
        recs.append(
            Recommendation(
                icon="🚶",
                title="A good window for movement",
                description="Energy often peaks around ovulation — today could be a great day for a workout you enjoy.",
            )
        )

    if avg_energy is not None and avg_energy <= 2:
        recs.append(
            Recommendation(
                icon="💧",
                title="Hydrate and take it slow",
                description="Your energy has been logged lower this week. Staying hydrated and pacing your day gently can help.",
            )
        )

    if not recs:
        recs.append(
            Recommendation(
                icon="🌿",
                title="Keep logging to unlock personal insights",
                description="A few more days of logging will help CycleAI tailor recommendations specifically to your patterns.",
            )
        )

    return recs[:4]
