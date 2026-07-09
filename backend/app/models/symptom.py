from datetime import date

from sqlalchemy import JSON, Date, Float, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.core.encryption import EncryptedText
from app.models.base import TimestampMixin, UUIDPrimaryKeyMixin


class Symptom(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    """A single day's wellness log: mood, energy, sleep, stress, pain, symptoms."""

    __tablename__ = "symptoms"

    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    cycle_id: Mapped[str | None] = mapped_column(
        ForeignKey("cycles.id", ondelete="SET NULL"), nullable=True, index=True
    )

    log_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)

    mood: Mapped[int | None] = mapped_column(Integer, nullable=True)  # 1-5
    energy: Mapped[int | None] = mapped_column(Integer, nullable=True)  # 1-5
    stress: Mapped[int | None] = mapped_column(Integer, nullable=True)  # 1-5
    pain_level: Mapped[int | None] = mapped_column(Integer, nullable=True)  # 0-5
    sleep_hours: Mapped[float | None] = mapped_column(Float, nullable=True)

    symptoms: Mapped[list[str] | None] = mapped_column(JSON, nullable=True)  # e.g. ["cramps","headache"]
    cravings: Mapped[list[str] | None] = mapped_column(JSON, nullable=True)

    notes: Mapped[str | None] = mapped_column(EncryptedText(2000), nullable=True)

    user: Mapped["User"] = relationship(back_populates="symptoms")
