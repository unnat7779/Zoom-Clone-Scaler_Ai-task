from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import CheckConstraint, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.clock import utcnow
from app.models.base import UTC_NOW_SQL, Base, UtcDateTime

if TYPE_CHECKING:
    from app.models.meeting import Meeting


class User(Base):
    """An account. Only the seeded default user hosts; the others are contacts (PRD §3)."""

    __tablename__ = "users"
    __table_args__ = (
        CheckConstraint("length(pmi) = 10", name="ck_users_pmi_length"),
        {"sqlite_autoincrement": True},
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    display_name: Mapped[str] = mapped_column(Text, nullable=False)
    email: Mapped[str] = mapped_column(Text, nullable=False, unique=True)
    pmi: Mapped[str] = mapped_column(Text, nullable=False, unique=True)
    timezone: Mapped[str] = mapped_column(Text, nullable=False, server_default="Asia/Kolkata")
    created_at: Mapped[datetime] = mapped_column(
        UtcDateTime, nullable=False, default=utcnow, server_default=UTC_NOW_SQL
    )

    meetings: Mapped[list[Meeting]] = relationship(back_populates="host", passive_deletes=True)
