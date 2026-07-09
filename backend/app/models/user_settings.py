from sqlalchemy import Boolean, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.base import TimestampMixin, UUIDPrimaryKeyMixin


class UserSettings(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "user_settings"

    user_id: Mapped[str] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), unique=True, index=True
    )

    notifications_enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    ai_coach_enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    units: Mapped[str] = mapped_column(String(20), default="metric")  # metric|imperial
    theme: Mapped[str] = mapped_column(String(20), default="system")  # light|dark|system

    # Explicit, revocable consent — required before any research data sharing.
    research_data_sharing_consent: Mapped[bool] = mapped_column(Boolean, default=False)

    user: Mapped["User"] = relationship(back_populates="settings")
