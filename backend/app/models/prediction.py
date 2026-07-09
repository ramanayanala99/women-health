from datetime import date

from sqlalchemy import JSON, Date, Float, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.base import TimestampMixin, UUIDPrimaryKeyMixin


class Prediction(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    """Output of the Cycle Prediction / Symptom Prediction engines.

    Persisted so users can see how a forecast has changed over time and
    so /forecast doesn't need to recompute from scratch on every call.
    """

    __tablename__ = "predictions"

    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)

    prediction_type: Mapped[str] = mapped_column(String(30), index=True)  # cycle|ovulation|symptom
    predicted_date: Mapped[date] = mapped_column(Date, nullable=False)
    confidence: Mapped[float] = mapped_column(Float, nullable=False)  # 0.0 - 1.0
    details: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    model_version: Mapped[str] = mapped_column(String(50), default="rule-based-v1")

    user: Mapped["User"] = relationship(back_populates="predictions")
