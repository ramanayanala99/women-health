from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.schemas.user import UserRead, UserUpdate

router = APIRouter(tags=["profile"])


@router.get("/profile", response_model=UserRead)
def get_profile(current_user: User = Depends(get_current_user)) -> User:
    return current_user


@router.put("/profile", response_model=UserRead)
def update_profile(
    payload: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> User:
    if payload.full_name is not None:
        current_user.full_name = payload.full_name

    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user
