from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.insight import Insight
from app.models.user import User
from app.schemas.insight import InsightRead
from app.services.pattern_detection import detect_patterns

router = APIRouter(tags=["insights"])


@router.get("/insights", response_model=list[InsightRead])
def get_insights(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[Insight]:
    fresh_patterns = detect_patterns(db, current_user.id)

    # Replace previously auto-detected patterns with this run's results, so the
    # list always reflects the user's current data rather than accumulating stale entries.
    db.query(Insight).filter(Insight.user_id == current_user.id, Insight.category == "pattern").delete()

    for pattern in fresh_patterns:
        db.add(
            Insight(
                user_id=current_user.id,
                category=pattern.category,
                title=pattern.title,
                description=pattern.description,
                confidence=pattern.confidence,
                meta=pattern.meta,
            )
        )
    db.commit()

    return (
        db.query(Insight)
        .filter(Insight.user_id == current_user.id)
        .order_by(Insight.confidence.desc())
        .all()
    )
