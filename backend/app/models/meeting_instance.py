from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Index, Integer, Text, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import FALSE_SQL, TRUE_SQL, Base, IntBool, UtcDateTime

if TYPE_CHECKING:
    from app.models.meeting import Meeting
    from app.models.participant import Participant


class MeetingInstance(Base):
    """One actual occurrence of a meeting. ``ended_at IS NULL`` means it is live."""

    __tablename__ = "meeting_instances"
    __table_args__ = (
        Index("ix_instances_meeting", "meeting_id", "started_at"),
        Index(
            "ux_one_live_instance",
            "meeting_id",
            unique=True,
            sqlite_where=text("ended_at IS NULL"),
        ),
        {"sqlite_autoincrement": True},
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    meeting_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("meetings.id", ondelete="CASCADE"), nullable=False
    )
    uuid: Mapped[str] = mapped_column(Text, nullable=False, unique=True)
    started_at: Mapped[datetime] = mapped_column(UtcDateTime, nullable=False)
    ended_at: Mapped[datetime | None] = mapped_column(UtcDateTime)
    allow_unmute: Mapped[bool] = mapped_column(
        IntBool, nullable=False, default=True, server_default=TRUE_SQL
    )
    mute_on_entry: Mapped[bool] = mapped_column(
        IntBool, nullable=False, default=False, server_default=FALSE_SQL
    )

    meeting: Mapped[Meeting] = relationship(back_populates="instances")
    participants: Mapped[list[Participant]] = relationship(
        back_populates="instance", passive_deletes=True, order_by="Participant.joined_at"
    )

    @property
    def is_live(self) -> bool:
        return self.ended_at is None
