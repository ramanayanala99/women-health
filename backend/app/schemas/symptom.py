from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field


class SymptomCreate(BaseModel):
    log_date: date
    mood: int | None = Field(default=None, ge=1, le=5)
    energy: int | None = Field(default=None, ge=1, le=5)
    stress: int | None = Field(default=None, ge=1, le=5)
    pain_level: int | None = Field(default=None, ge=0, le=5)
    sleep_hours: float | None = Field(default=None, ge=0, le=24)
    symptoms: list[str] | None = None
    cravings: list[str] | None = None
    notes: str | None = Field(default=None, max_length=2000)
    cycle_id: str | None = None


class SymptomRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    log_date: date
    mood: int | None
    energy: int | None
    stress: int | None
    pain_level: int | None
    sleep_hours: float | None
    symptoms: list[str] | None
    cravings: list[str] | None
    notes: str | None
    cycle_id: str | None
    created_at: datetime
