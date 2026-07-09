from datetime import date, datetime

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.symptom import Symptom
from app.models.user import User
from app.schemas.dashboard import DashboardOut
from app.services.cycle_prediction import build_forecast
from app.services.recommendation import generate_recommendations
from app.services.safety import GENERAL_DISCLAIMER
from app.services.symptom_prediction import predict_upcoming_symptoms

router = APIRouter(tags=["dashboard"])


@router.get("/dashboard", response_model=DashboardOut)
def get_dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> DashboardOut:
    today = date.today()
    forecast = build_forecast(db, current_user.id, today)

    latest_log = (
        db.query(Symptom)
        .filter(Symptom.user_id == current_user.id)
        .order_by(Symptom.log_date.desc())
        .first()
    )

    recommendations = generate_recommendations(db, current_user.id, forecast, today)
    likely_symptoms = predict_upcoming_symptoms(db, current_user.id, forecast, today)

    first_name = (current_user.full_name or "there").split(" ")[0]
    hour = datetime.now().hour
    time_of_day = "morning" if hour < 12 else "afternoon" if hour < 18 else "evening"
    greeting = f"Good {time_of_day}, {first_name}"

    return DashboardOut(
        greeting=greeting,
        forecast=forecast,
        recent_energy=latest_log.energy if latest_log else None,
        recent_mood=latest_log.mood if latest_log else None,
        recent_sleep_hours=latest_log.sleep_hours if latest_log else None,
        recent_stress=latest_log.stress if latest_log else None,
        recommendations=recommendations,
        likely_upcoming_symptoms=likely_symptoms,
        disclaimer=GENERAL_DISCLAIMER,
    )
