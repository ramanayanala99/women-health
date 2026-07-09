from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field


class CycleCreate(BaseModel):
    start_date: date
    period_length_days: int | None = Field(default=None, ge=1, le=14)
    flow_intensity: str | None = Field(default=None, pattern="^(light|medium|heavy)$")
    notes: str | None = Field(default=None, max_length=2000)


class CycleRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    start_date: date
    period_length_days: int | None
    cycle_length_days: int | None
    flow_intensity: str | None
    notes: str | None
    created_at: datetime
