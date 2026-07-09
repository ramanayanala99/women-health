from datetime import date, datetime

from pydantic import BaseModel, ConfigDict


class MonthlyReportOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    period_start: date
    period_end: date
    summary: dict
    created_at: datetime
