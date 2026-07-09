from sqlalchemy import Boolean, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.base import TimestampMixin, UUIDPrimaryKeyMixin

# Self-reported, not inferred from age — see services/cycle_prediction.py and
# services/ai_coach.py for how this changes forecasting and AI Coach behavior.
LIFE_STAGES = ("reproductive", "perimenopause", "menopause", "postmenopause", "unsure")


class User(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str | None] = mapped_column(String(255), nullable=True)

    # One of LIFE_STAGES. Collected at onboarding so CycleAI doesn't assume a
    # textbook ovulatory cycle for users who are perimenopausal or beyond.
    life_stage: Mapped[str] = mapped_column(String(20), default="unsure", server_default="unsure")

    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    cycles: Mapped[list["Cycle"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    symptoms: Mapped[list["Symptom"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    predictions: Mapped[list["Prediction"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    conversations: Mapped[list["AIConversation"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    insights: Mapped[list["Insight"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    reports: Mapped[list["Report"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    notifications: Mapped[list["Notification"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    settings: Mapped["UserSettings | None"] = relationship(
        back_populates="user", cascade="all, delete-orphan", uselist=False
    )
