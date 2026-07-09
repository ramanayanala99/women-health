from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.core.security import verify_password
from app.models.ai_conversation import AIConversation
from app.models.cycle import Cycle
from app.models.insight import Insight
from app.models.notification import Notification
from app.models.prediction import Prediction
from app.models.report import Report
from app.models.symptom import Symptom
from app.models.user import User
from app.models.user_settings import UserSettings
from app.schemas.account import DeleteAccountRequest

router = APIRouter(tags=["account"])


@router.get("/account/export")
def export_account_data(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict:
    """A full, portable export of everything CycleAI stores about this user."""

    def serialize(rows: list) -> list[dict]:
        return [
            {c.name: getattr(row, c.name) for c in row.__table__.columns} for row in rows
        ]

    settings_row = db.query(UserSettings).filter(UserSettings.user_id == current_user.id).first()

    return {
        "profile": {
            "id": current_user.id,
            "email": current_user.email,
            "full_name": current_user.full_name,
            "created_at": current_user.created_at,
        },
        "settings": (
            {c.name: getattr(settings_row, c.name) for c in settings_row.__table__.columns}
            if settings_row
            else None
        ),
        "cycles": serialize(db.query(Cycle).filter(Cycle.user_id == current_user.id).all()),
        "symptoms": serialize(db.query(Symptom).filter(Symptom.user_id == current_user.id).all()),
        "predictions": serialize(db.query(Prediction).filter(Prediction.user_id == current_user.id).all()),
        "ai_conversations": serialize(
            db.query(AIConversation).filter(AIConversation.user_id == current_user.id).all()
        ),
        "insights": serialize(db.query(Insight).filter(Insight.user_id == current_user.id).all()),
        "reports": serialize(db.query(Report).filter(Report.user_id == current_user.id).all()),
        "notifications": serialize(
            db.query(Notification).filter(Notification.user_id == current_user.id).all()
        ),
    }


@router.delete("/account", status_code=status.HTTP_204_NO_CONTENT)
def delete_account(
    payload: DeleteAccountRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Response:
    """Permanently deletes the user and every row that references them.

    Requires re-entering the account password as a confirmation step —
    this is a genuinely irreversible action.
    """
    if not verify_password(payload.password, current_user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect password")

    db.delete(current_user)  # cascades to all related tables (see relationship `cascade` settings)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
