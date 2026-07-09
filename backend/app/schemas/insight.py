from datetime import datetime

from pydantic import BaseModel, ConfigDict


class InsightRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    category: str
    title: str
    description: str
    confidence: float
    meta: dict | None
    created_at: datetime
