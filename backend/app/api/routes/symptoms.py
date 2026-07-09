from datetime import date

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.symptom import Symptom
from app.models.user import User
from app.schemas.symptom import SymptomCreate, SymptomRead

router = APIRouter(prefix="/symptoms", tags=["symptoms"])


@router.post("", response_model=SymptomRead, status_code=status.HTTP_201_CREATED)
def create_symptom_log(
    payload: SymptomCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Symptom:
    log = Symptom(user_id=current_user.id, **payload.model_dump())
    db.add(log)
    db.commit()
    db.refresh(log)
    return log


@router.get("", response_model=list[SymptomRead])
def list_symptom_logs(
    start: date | None = None,
    end: date | None = None,
    limit: int = 90,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[Symptom]:
    query = db.query(Symptom).filter(Symptom.user_id == current_user.id)
    if start:
        query = query.filter(Symptom.log_date >= start)
    if end:
        query = query.filter(Symptom.log_date <= end)
    return query.order_by(Symptom.log_date.desc()).limit(min(limit, 365)).all()
