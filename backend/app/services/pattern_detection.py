"""Pattern Detection Engine.

Surfaces statistical correlations between logged metrics (e.g. sleep and
next-day mood). Every finding is labeled as an observed correlation in
the user's own data, with a sample size and confidence — never framed as
a proven cause, and never as a diagnosis.
"""

from __future__ import annotations

import statistics
from dataclasses import dataclass

from sqlalchemy.orm import Session

from app.models.symptom import Symptom

MIN_SAMPLE_SIZE = 5
MEANINGFUL_CORRELATION = 0.3


@dataclass
class PatternInsight:
    category: str
    title: str
    description: str
    confidence: float
    meta: dict


def _confidence_from_correlation(r: float, sample_size: int) -> float:
    strength = min(abs(r), 1.0)
    sample_factor = min(sample_size / 20, 1.0)
    return round(min(0.5 + 0.4 * strength * sample_factor, 0.95), 2)


def _paired_sleep_vs_next_day(logs: list[Symptom], next_day_attr: str) -> tuple[list[float], list[float]]:
    """Pair each day's sleep_hours with the *next* day's value of next_day_attr,
    but only across genuinely consecutive logged days (no gap-filling)."""
    by_date = {log.log_date: log for log in logs}
    dates = sorted(by_date)

    sleep_values: list[float] = []
    next_values: list[float] = []

    for i in range(len(dates) - 1):
        if (dates[i + 1] - dates[i]).days != 1:
            continue
        today_log = by_date[dates[i]]
        next_log = by_date[dates[i + 1]]
        next_value = getattr(next_log, next_day_attr)
        if today_log.sleep_hours is None or next_value is None:
            continue
        sleep_values.append(today_log.sleep_hours)
        next_values.append(next_value)

    return sleep_values, next_values


def _correlation_insight(
    x: list[float], y: list[float], *, category: str, title: str, description_template: str, meta_key: str
) -> PatternInsight | None:
    if len(x) < MIN_SAMPLE_SIZE:
        return None
    try:
        r = statistics.correlation(x, y)
    except statistics.StatisticsError:
        return None
    if abs(r) < MEANINGFUL_CORRELATION:
        return None

    direction = "higher" if r > 0 else "lower"
    return PatternInsight(
        category=category,
        title=title,
        description=description_template.format(direction=direction),
        confidence=_confidence_from_correlation(r, len(x)),
        meta={"metric": meta_key, "r": round(r, 2), "n": len(x)},
    )


def _sleep_mood_energy_pattern(logs: list[Symptom]) -> list[PatternInsight]:
    """Does last night's sleep correlate with today's mood/energy?"""
    insights: list[PatternInsight] = []

    sleep_vs_mood = _paired_sleep_vs_next_day(logs, "mood")
    mood_insight = _correlation_insight(
        *sleep_vs_mood,
        category="pattern",
        title="Sleep and next-day mood are linked",
        description_template="On nights with more sleep, your next-day mood tends to be {direction} in your logs so far.",
        meta_key="sleep_hours_vs_next_mood",
    )
    if mood_insight:
        insights.append(mood_insight)

    sleep_vs_energy = _paired_sleep_vs_next_day(logs, "energy")
    energy_insight = _correlation_insight(
        *sleep_vs_energy,
        category="pattern",
        title="Sleep and next-day energy are linked",
        description_template="On nights with more sleep, your next-day energy tends to be {direction} in your logs so far.",
        meta_key="sleep_hours_vs_next_energy",
    )
    if energy_insight:
        insights.append(energy_insight)

    return insights


def _stress_pain_pattern(logs: list[Symptom]) -> list[PatternInsight]:
    paired = [(log.stress, log.pain_level) for log in logs if log.stress is not None and log.pain_level is not None]
    if not paired:
        return []
    stress_values, pain_values = (list(v) for v in zip(*paired, strict=True))

    insight = _correlation_insight(
        stress_values,
        pain_values,
        category="pattern",
        title="Stress and pain levels move together",
        description_template="On days you log more stress, your pain level tends to be {direction} too.",
        meta_key="stress_vs_pain",
    )
    return [insight] if insight else []


def detect_patterns(db: Session, user_id: str) -> list[PatternInsight]:
    logs = (
        db.query(Symptom)
        .filter(Symptom.user_id == user_id)
        .order_by(Symptom.log_date.asc())
        .all()
    )

    if len(logs) < MIN_SAMPLE_SIZE:
        return []

    patterns: list[PatternInsight] = []
    patterns.extend(_sleep_mood_energy_pattern(logs))
    patterns.extend(_stress_pain_pattern(logs))
    return patterns
