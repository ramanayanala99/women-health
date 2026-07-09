from pydantic import BaseModel, ConfigDict


class UserSettingsUpdate(BaseModel):
    notifications_enabled: bool | None = None
    ai_coach_enabled: bool | None = None
    units: str | None = None
    theme: str | None = None
    research_data_sharing_consent: bool | None = None


class UserSettingsRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    notifications_enabled: bool
    ai_coach_enabled: bool
    units: str
    theme: str
    research_data_sharing_consent: bool
