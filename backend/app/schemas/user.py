from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr

LifeStage = Literal["reproductive", "perimenopause", "menopause", "postmenopause", "unsure"]


class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    email: EmailStr
    full_name: str | None = None
    life_stage: LifeStage
    is_active: bool
    created_at: datetime


class UserUpdate(BaseModel):
    full_name: str | None = None
    life_stage: LifeStage | None = None
