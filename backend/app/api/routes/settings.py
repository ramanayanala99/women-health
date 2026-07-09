from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.models.user_settings import UserSettings
from app.schemas.settings import UserSettingsRead, UserSettingsUpdate

router = APIRouter(tags=["settings"])


@router.get("/settings", response_model=UserSettingsRead)
def get_settings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> UserSettings:
    settings_row = db.query(UserSettings).filter(UserSettings.user_id == current_user.id).first()
    if settings_row is None:
        # Defensive fallback for accounts created before settings existed.
        settings_row = UserSettings(user_id=current_user.id)
        db.add(settings_row)
        db.commit()
        db.refresh(settings_row)
    return settings_row


@router.put("/settings", response_model=UserSettingsRead)
def update_settings(
    payload: UserSettingsUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> UserSettings:
    settings_row = db.query(UserSettings).filter(UserSettings.user_id == current_user.id).first()
    if settings_row is None:
        settings_row = UserSettings(user_id=current_user.id)
        db.add(settings_row)

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(settings_row, field, value)

    db.commit()
    db.refresh(settings_row)
    return settings_row
