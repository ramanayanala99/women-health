from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.schemas.dashboard import ForecastOut
from app.services.cycle_prediction import build_forecast

router = APIRouter(tags=["forecast"])


@router.get("/forecast", response_model=ForecastOut)
def get_forecast(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ForecastOut:
    return build_forecast(db, current_user.id)
