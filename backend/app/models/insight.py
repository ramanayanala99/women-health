from sqlalchemy import JSON, Float, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.base import TimestampMixin, UUIDPrimaryKeyMixin


class Insight(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    """Output of the Pattern Detection Engine — a single observed pattern."""

    __tablename__ = "insights"

    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)

    category: Mapped[str] = mapped_column(String(30))  # pattern|trend|forecast
    title: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(String(1000))
    confidence: Mapped[float] = mapped_column(Float, default=0.5)  # 0.0 - 1.0
    meta: Mapped[dict | None] = mapped_column(JSON, nullable=True)

    user: Mapped["User"] = relationship(back_populates="insights")
