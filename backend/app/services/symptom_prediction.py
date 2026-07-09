"""Symptom Prediction Engine.

Looks at which symptoms have historically clustered around the same
point in a user's own cycle, and surfaces the most frequent ones for
the days just ahead. This is frequency-based pattern matching against
the user's own history — not a diagnostic prediction.
"""

from __future__ import annotations

from collections import Counter
from dataclasses import dataclass
from datetime import date

from sqlalchemy.orm import Session

from app.models.cycle import Cycle
from app.models.symptom import Symptom
from app.services.cycle_prediction import CycleForecast

LOOKAHEAD_DAYS = 3
RELATIVE_DAY_TOLERANCE = 1


@dataclass
class SymptomLikelihood:
    symptom: str
    likelihood: float  # 0.0 - 1.0
    occurrences: int


def _relative_cycle_day(log_date: date, cycles: list[Cycle]) -> int | None:
    """Find which cycle a log falls in and return its 1-indexed day within that cycle."""
    covering = [c for c in cycles if c.start_date <= log_date]
    if not covering:
        return None
    cycle = max(covering, key=lambda c: c.start_date)
    return (log_date - cycle.start_date).days + 1


def predict_upcoming_symptoms(
    db: Session, user_id: str, forecast: CycleForecast, today: date | None = None
) -> list[SymptomLikelihood]:
    if not forecast.has_data or forecast.current_cycle_day is None:
        return []

    today = today or date.today()
    cycles = db.query(Cycle).filter(Cycle.user_id == user_id).order_by(Cycle.start_date.asc()).all()
    logs = db.query(Symptom).filter(Symptom.user_id == user_id).all()

    if not cycles or not logs:
        return []

    target_days = {forecast.current_cycle_day + offset for offset in range(1, LOOKAHEAD_DAYS + 1)}

    matched_logs = 0
    symptom_counter: Counter[str] = Counter()

    for log in logs:
        rel_day = _relative_cycle_day(log.log_date, cycles)
        if rel_day is None:
            continue
        if any(abs(rel_day - target) <= RELATIVE_DAY_TOLERANCE for target in target_days):
            matched_logs += 1
            for symptom in log.symptoms or []:
                symptom_counter[symptom] += 1

    if matched_logs == 0:
        return []

    results = [
        SymptomLikelihood(
            symptom=symptom,
            likelihood=round(min(count / matched_logs, 1.0), 2),
            occurrences=count,
        )
        for symptom, count in symptom_counter.most_common(5)
    ]
    return results
