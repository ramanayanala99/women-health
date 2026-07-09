"""Cycle Prediction Engine.

A transparent, rule-based / statistical model (not a black-box ML model)
that learns a user's *own* baseline from their logged cycles, rather than
assuming a textbook 28-day cycle. Every output includes a confidence score
and is explicit about being an estimate, not a guarantee.

Life stage matters here. The standard menstrual/follicular/ovulation/luteal
model assumes a fairly regular, ovulatory cycle — which doesn't hold for
users in perimenopause (cycles skip and vary widely) or menopause/
postmenopause (periods have stopped). Rather than force those users into a
28-day-shaped prediction that will just be wrong, this engine:

- reads the user's self-reported `life_stage` (see models.user.LIFE_STAGES)
- also detects a long gap since the last logged period independently of
  self-report, since that's the clearest data-driven signal something has
  changed regardless of what a user selected at onboarding
- switches to an "irregular" phase and lower, capped confidence for
  perimenopause-like patterns, and stops forecasting a next period at all
  once a user has told us periods have stopped
"""

from __future__ import annotations

import statistics
from dataclasses import dataclass
from datetime import date, timedelta

from sqlalchemy.orm import Session

from app.models.cycle import Cycle

DEFAULT_CYCLE_LENGTH = 28
DEFAULT_PERIOD_LENGTH = 5
LUTEAL_PHASE_LENGTH = 14  # days from ovulation to next period; fairly consistent across people
FERTILE_WINDOW_BEFORE_OVULATION = 5
FERTILE_WINDOW_AFTER_OVULATION = 1
IRREGULARITY_STDEV_THRESHOLD = 4.0

# A gap this much longer than usual (or this many days with no data at all)
# is notable regardless of self-reported life stage.
LONG_GAP_DAYS = 60
MAX_CONFIDENCE_WHEN_IRREGULAR = 0.5

PERIMENOPAUSE_STAGE = "perimenopause"
NO_PERIOD_STAGES = ("menopause", "postmenopause")


@dataclass
class CycleForecast:
    has_data: bool
    last_period_start: date | None
    current_cycle_day: int | None
    current_phase: str | None
    avg_cycle_length_days: float
    avg_period_length_days: float
    predicted_next_period: date | None
    predicted_ovulation_date: date | None
    fertile_window_start: date | None
    fertile_window_end: date | None
    days_until_next_period: int | None
    is_irregular: bool
    confidence: float
    sample_size: int
    note: str


def _phase_for_day(day: int, period_length: float, ovulation_day: float, cycle_length: float) -> str:
    if day <= period_length:
        return "menstrual"
    if day < ovulation_day - 1:
        return "follicular"
    if ovulation_day - 1 <= day <= ovulation_day + 1:
        return "ovulation"
    if day <= cycle_length:
        return "luteal"
    return "luteal"  # cycle running longer than average; still in luteal-equivalent waiting phase


def build_forecast(
    db: Session, user_id: str, today: date | None = None, life_stage: str = "unsure"
) -> CycleForecast:
    today = today or date.today()

    cycles = (
        db.query(Cycle)
        .filter(Cycle.user_id == user_id)
        .order_by(Cycle.start_date.asc())
        .all()
    )

    if not cycles:
        note = "Log your first cycle to start receiving personalized predictions."
        if life_stage in NO_PERIOD_STAGES:
            note = (
                "You've told CycleAI you're in menopause or postmenopause, so cycle "
                "predictions aren't shown — you can still log any symptoms you'd like to track."
            )
        return CycleForecast(
            has_data=False,
            last_period_start=None,
            current_cycle_day=None,
            current_phase=None,
            avg_cycle_length_days=DEFAULT_CYCLE_LENGTH,
            avg_period_length_days=DEFAULT_PERIOD_LENGTH,
            predicted_next_period=None,
            predicted_ovulation_date=None,
            fertile_window_start=None,
            fertile_window_end=None,
            days_until_next_period=None,
            is_irregular=False,
            confidence=0.0,
            sample_size=0,
            note=note,
        )

    known_cycle_lengths = [c.cycle_length_days for c in cycles if c.cycle_length_days]
    known_period_lengths = [c.period_length_days for c in cycles if c.period_length_days]

    avg_cycle_length = (
        statistics.fmean(known_cycle_lengths) if known_cycle_lengths else DEFAULT_CYCLE_LENGTH
    )
    avg_period_length = (
        statistics.fmean(known_period_lengths) if known_period_lengths else DEFAULT_PERIOD_LENGTH
    )

    stdev_cycle_length = (
        statistics.pstdev(known_cycle_lengths) if len(known_cycle_lengths) >= 2 else 0.0
    )
    # A single very long logged cycle is itself a sign of irregularity — stdev alone
    # can't see that with fewer than two data points.
    has_any_long_cycle = any(length > LONG_GAP_DAYS for length in known_cycle_lengths)
    is_irregular = stdev_cycle_length > IRREGULARITY_STDEV_THRESHOLD or has_any_long_cycle

    last_cycle = cycles[-1]
    current_cycle_day = (today - last_cycle.start_date).days + 1
    days_since_last_period = current_cycle_day - 1
    long_gap_detected = days_since_last_period > LONG_GAP_DAYS

    sample_size = len(known_cycle_lengths)
    confidence = min(0.9, 0.3 + 0.12 * sample_size)
    if is_irregular:
        confidence = max(0.2, confidence - 0.25)
    if sample_size == 0:
        confidence = 0.25

    # --- Menopause / postmenopause: periods have stopped, so don't forecast one. ---
    if life_stage in NO_PERIOD_STAGES:
        return CycleForecast(
            has_data=True,
            last_period_start=last_cycle.start_date,
            current_cycle_day=current_cycle_day,
            current_phase=life_stage,
            avg_cycle_length_days=round(avg_cycle_length, 1),
            avg_period_length_days=round(avg_period_length, 1),
            predicted_next_period=None,
            predicted_ovulation_date=None,
            fertile_window_start=None,
            fertile_window_end=None,
            days_until_next_period=None,
            is_irregular=False,
            confidence=0.3,
            sample_size=sample_size,
            note=(
                "You've told CycleAI you're in menopause or postmenopause, so we're not "
                "forecasting a next period. Any new bleeding is worth mentioning to a "
                "healthcare professional."
            ),
        )

    ovulation_day = max(avg_cycle_length - LUTEAL_PHASE_LENGTH, 1)
    predicted_next_period = last_cycle.start_date + timedelta(days=round(avg_cycle_length))
    predicted_ovulation_date = last_cycle.start_date + timedelta(days=round(ovulation_day))
    fertile_window_start = predicted_ovulation_date - timedelta(days=FERTILE_WINDOW_BEFORE_OVULATION)
    fertile_window_end = predicted_ovulation_date + timedelta(days=FERTILE_WINDOW_AFTER_OVULATION)
    days_until_next_period = (predicted_next_period - today).days

    # --- Perimenopause (self-reported) or a data-driven sign of a similarly
    # unpredictable pattern: don't force a textbook phase label, and cap confidence. ---
    if life_stage == PERIMENOPAUSE_STAGE or long_gap_detected or is_irregular:
        is_irregular = True
        current_phase = "irregular"
        confidence = min(confidence, MAX_CONFIDENCE_WHEN_IRREGULAR)

        if life_stage == PERIMENOPAUSE_STAGE:
            note = (
                "Cycles often become less predictable during perimenopause, so treat this "
                "as a rough guide rather than a firm prediction."
            )
        elif long_gap_detected:
            note = (
                f"It's been {days_since_last_period} days since your last logged period — "
                "longer than your usual pattern — so this prediction carries extra "
                "uncertainty. If this is a big change for you, it's worth mentioning to a "
                "healthcare professional."
            )
        else:
            note = (
                "Your cycle length has varied more than usual, so this prediction carries "
                "more uncertainty than usual."
            )
    else:
        current_phase = _phase_for_day(current_cycle_day, avg_period_length, ovulation_day, avg_cycle_length)
        if sample_size == 0:
            note = (
                "This is a rough estimate based on a typical cycle length — log one more "
                "cycle so CycleAI can learn your personal pattern."
            )
        else:
            note = "Based on your own logged cycles — an estimate, not a guarantee."

    return CycleForecast(
        has_data=True,
        last_period_start=last_cycle.start_date,
        current_cycle_day=current_cycle_day,
        current_phase=current_phase,
        avg_cycle_length_days=round(avg_cycle_length, 1),
        avg_period_length_days=round(avg_period_length, 1),
        predicted_next_period=predicted_next_period,
        predicted_ovulation_date=predicted_ovulation_date,
        fertile_window_start=fertile_window_start,
        fertile_window_end=fertile_window_end,
        days_until_next_period=days_until_next_period,
        is_irregular=is_irregular,
        confidence=round(confidence, 2),
        sample_size=sample_size,
        note=note,
    )


def backfill_previous_cycle_length(db: Session, user_id: str, new_start_date: date) -> None:
    """When a new cycle is logged, fill in cycle_length_days on the prior one."""
    previous = (
        db.query(Cycle)
        .filter(Cycle.user_id == user_id, Cycle.start_date < new_start_date)
        .order_by(Cycle.start_date.desc())
        .first()
    )
    if previous and previous.cycle_length_days is None:
        previous.cycle_length_days = (new_start_date - previous.start_date).days
        db.add(previous)
