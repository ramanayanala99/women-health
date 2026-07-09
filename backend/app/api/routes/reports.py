from datetime import date

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.report import Report
from app.models.user import User
from app.schemas.report import MonthlyReportOut
from app.services.reports import generate_monthly_report

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("/monthly", response_model=MonthlyReportOut)
def get_monthly_report(
    year: int = Query(default_factory=lambda: date.today().year, ge=2020, le=2100),
    month: int = Query(default_factory=lambda: date.today().month, ge=1, le=12),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Report:
    return generate_monthly_report(db, current_user.id, year, month)
