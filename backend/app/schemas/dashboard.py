from datetime import date

from pydantic import BaseModel, ConfigDict


class RecommendationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    icon: str
    title: str
    description: str


class ForecastOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

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


class SymptomLikelihoodOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    symptom: str
    likelihood: float
    occurrences: int


class DashboardOut(BaseModel):
    greeting: str
    forecast: ForecastOut
    recent_energy: int | None
    recent_mood: int | None
    recent_sleep_hours: float | None
    recent_stress: int | None
    recommendations: list[RecommendationOut]
    likely_upcoming_symptoms: list[SymptomLikelihoodOut]
    disclaimer: str
