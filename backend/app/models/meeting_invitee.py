from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Integer, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.meeting import Meeting


class MeetingInvitee(Base):
    """An email address invited to a scheduled meeting (stored only; no email is sent)."""

    __tablename__ = "meeting_invitees"
    __table_args__ = (
        UniqueConstraint("meeting_id", "email", name="uq_meeting_invitees_meeting_email"),
        {"sqlite_autoincrement": True},
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    meeting_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("meetings.id", ondelete="CASCADE"), nullable=False
    )
    email: Mapped[str] = mapped_column(Text, nullable=False)

    meeting: Mapped[Meeting] = relationship(back_populates="invitees")
