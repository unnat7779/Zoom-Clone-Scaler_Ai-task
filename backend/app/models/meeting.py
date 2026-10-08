from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import CheckConstraint, ForeignKey, Index, Integer, Text, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.clock import utcnow
from app.models.base import FALSE_SQL, TRUE_SQL, UTC_NOW_SQL, Base, IntBool, UtcDateTime
from app.models.enums import MeetingType, sql_in

if TYPE_CHECKING:
    from app.models.meeting_instance import MeetingInstance
    from app.models.meeting_invitee import MeetingInvitee
    from app.models.user import User


class Meeting(Base):
    """A meeting definition: what was scheduled (or the PMI / an instant meeting).

    A ``uses_pmi`` row is a scheduled calendar entry that runs on the host's PMI number, so
    the meeting number is unique only among "owner" rows (``uses_pmi = 0``).
    """

    __tablename__ = "meetings"
    __table_args__ = (
        CheckConstraint(
            "length(meeting_number) BETWEEN 10 AND 11", name="ck_meetings_number_length"
        ),
        CheckConstraint(f"type IN ({sql_in(MeetingType)})", name="ck_meetings_type"),
        CheckConstraint("length(topic) BETWEEN 1 AND 200", name="ck_meetings_topic_length"),
        CheckConstraint(
            "description IS NULL OR length(description) <= 2000",
            name="ck_meetings_description_length",
        ),
        CheckConstraint("duration_minutes BETWEEN 0 AND 1440", name="ck_meetings_duration_range"),
        CheckConstraint(
            "passcode IS NULL OR length(passcode) BETWEEN 1 AND 10",
            name="ck_meetings_passcode_length",
        ),
        CheckConstraint(
            "type <> 'scheduled' OR start_time IS NOT NULL", name="ck_meetings_scheduled_start"
        ),
        CheckConstraint("uses_pmi = 0 OR type = 'scheduled'", name="ck_meetings_uses_pmi"),
        Index(
            "ux_meetings_number", "meeting_number", unique=True, sqlite_where=text("uses_pmi = 0")
        ),
        Index("ux_meetings_one_pmi", "host_id", unique=True, sqlite_where=text("type = 'pmi'")),
        Index(
            "ix_meetings_host_start",
            "host_id",
            "start_time",
            sqlite_where=text("deleted_at IS NULL"),
        ),
        {"sqlite_autoincrement": True},
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    meeting_number: Mapped[str] = mapped_column(Text, nullable=False)
    uses_pmi: Mapped[bool] = mapped_column(
        IntBool, nullable=False, default=False, server_default=FALSE_SQL
    )
    host_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    type: Mapped[str] = mapped_column(Text, nullable=False)
    topic: Mapped[str] = mapped_column(Text, nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    start_time: Mapped[datetime | None] = mapped_column(UtcDateTime)
    duration_minutes: Mapped[int] = mapped_column(
        Integer, nullable=False, default=40, server_default=text("40")
    )
    timezone: Mapped[str] = mapped_column(Text, nullable=False)
    passcode: Mapped[str | None] = mapped_column(Text)
    invite_token: Mapped[str] = mapped_column(Text, nullable=False, unique=True)
    waiting_room_enabled: Mapped[bool] = mapped_column(
        IntBool, nullable=False, default=False, server_default=FALSE_SQL
    )
    join_before_host: Mapped[bool] = mapped_column(
        IntBool, nullable=False, default=True, server_default=TRUE_SQL
    )
    mute_upon_entry: Mapped[bool] = mapped_column(
        IntBool, nullable=False, default=False, server_default=FALSE_SQL
    )
    host_video_on: Mapped[bool] = mapped_column(
        IntBool, nullable=False, default=True, server_default=TRUE_SQL
    )
    participant_video_on: Mapped[bool] = mapped_column(
        IntBool, nullable=False, default=True, server_default=TRUE_SQL
    )
    is_recurring: Mapped[bool] = mapped_column(
        IntBool, nullable=False, default=False, server_default=FALSE_SQL
    )
    deleted_at: Mapped[datetime | None] = mapped_column(UtcDateTime)
    created_at: Mapped[datetime] = mapped_column(
        UtcDateTime, nullable=False, default=utcnow, server_default=UTC_NOW_SQL
    )
    updated_at: Mapped[datetime] = mapped_column(
        UtcDateTime, nullable=False, default=utcnow, onupdate=utcnow, server_default=UTC_NOW_SQL
    )

    host: Mapped[User] = relationship(back_populates="meetings")
    invitees: Mapped[list[MeetingInvitee]] = relationship(
        back_populates="meeting",
        cascade="all, delete-orphan",
        passive_deletes=True,
        order_by="MeetingInvitee.id",
    )
    instances: Mapped[list[MeetingInstance]] = relationship(
        back_populates="meeting", passive_deletes=True
    )
