"""Monthly, doctor-friendly report generation.

Summarizes a calendar month of logged data into plain figures a
healthcare provider can skim in under a minute. Explicitly framed as a
conversation starter, not a diagnosis — see `services.safety`.
"""

from __future__ import annotations

import calendar
import statistics
from collections import Counter
from datetime import date

from sqlalchemy.orm import Session

from app.models.cycle import Cycle
from app.models.report import Report
from app.models.symptom import Symptom


def _month_bounds(year: int, month: int) -> tuple[date, date]:
    last_day = calendar.monthrange(year, month)[1]
    return date(year, month, 1), date(year, month, last_day)


def generate_monthly_report(db: Session, user_id: str, year: int, month: int) -> Report:
    period_start, period_end = _month_bounds(year, month)

    existing = (
        db.query(Report)
        .filter(
            Report.user_id == user_id,
            Report.period_start == period_start,
            Report.period_end == period_end,
        )
        .first()
    )
    if existing:
        return existing

    logs = (
        db.query(Symptom)
        .filter(
            Symptom.user_id == user_id,
            Symptom.log_date >= period_start,
            Symptom.log_date <= period_end,
        )
        .all()
    )
    cycles_in_range = (
        db.query(Cycle)
        .filter(
            Cycle.user_id == user_id,
            Cycle.start_date >= period_start,
            Cycle.start_date <= period_end,
        )
        .all()
    )

    def avg(values: list[float]) -> float | None:
        return round(statistics.fmean(values), 2) if values else None

    symptom_counter: Counter[str] = Counter()
    for log in logs:
        symptom_counter.update(log.symptoms or [])

    days_logged = len({log.log_date for log in logs})
    symptom_free_days = sum(1 for log in logs if not (log.symptoms or []))

    summary = {
        "days_logged": days_logged,
        "periods_started": len(cycles_in_range),
        "avg_mood": avg([log.mood for log in logs if log.mood is not None]),
        "avg_energy": avg([log.energy for log in logs if log.energy is not None]),
        "avg_sleep_hours": avg([log.sleep_hours for log in logs if log.sleep_hours is not None]),
        "avg_stress": avg([log.stress for log in logs if log.stress is not None]),
        "avg_pain_level": avg([log.pain_level for log in logs if log.pain_level is not None]),
        "symptom_free_days": symptom_free_days,
        "most_common_symptoms": [
            {"symptom": symptom, "days": count} for symptom, count in symptom_counter.most_common(5)
        ],
        "note": (
            "This summary reflects self-reported data and is intended to support a "
            "conversation with a healthcare professional — it is not a diagnosis."
        ),
    }

    report = Report(
        user_id=user_id,
        period_start=period_start,
        period_end=period_end,
        summary=summary,
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report
