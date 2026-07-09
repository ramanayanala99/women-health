from datetime import date

from sqlalchemy import Date, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.base import TimestampMixin, UUIDPrimaryKeyMixin


class Cycle(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    """A single logged menstrual cycle, anchored on its period start date."""

    __tablename__ = "cycles"

    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)

    start_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    period_length_days: Mapped[int | None] = mapped_column(Integer, nullable=True)

    # Filled in once the *next* cycle's start_date is known.
    cycle_length_days: Mapped[int | None] = mapped_column(Integer, nullable=True)

    flow_intensity: Mapped[str | None] = mapped_column(String(20), nullable=True)  # light|medium|heavy
    notes: Mapped[str | None] = mapped_column(String(2000), nullable=True)

    user: Mapped["User"] = relationship(back_populates="cycles")
