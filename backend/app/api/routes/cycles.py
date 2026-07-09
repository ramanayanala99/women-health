from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.cycle import Cycle
from app.models.user import User
from app.schemas.cycle import CycleCreate, CycleRead
from app.services.cycle_prediction import backfill_previous_cycle_length

router = APIRouter(prefix="/cycles", tags=["cycles"])


@router.post("", response_model=CycleRead, status_code=status.HTTP_201_CREATED)
def create_cycle(
    payload: CycleCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Cycle:
    cycle = Cycle(user_id=current_user.id, **payload.model_dump())
    db.add(cycle)

    backfill_previous_cycle_length(db, current_user.id, payload.start_date)

    db.commit()
    db.refresh(cycle)
    return cycle


@router.get("", response_model=list[CycleRead])
def list_cycles(
    limit: int = 50,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[Cycle]:
    return (
        db.query(Cycle)
        .filter(Cycle.user_id == current_user.id)
        .order_by(Cycle.start_date.desc())
        .limit(min(limit, 200))
        .all()
    )
