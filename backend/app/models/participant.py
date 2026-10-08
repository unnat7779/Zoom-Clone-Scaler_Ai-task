from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import CheckConstraint, ForeignKey, Index, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import FALSE_SQL, TRUE_SQL, Base, IntBool, UtcDateTime
from app.models.enums import ParticipantRole, ParticipantStatus, sql_in

if TYPE_CHECKING:
    from app.models.meeting_instance import MeetingInstance
    from app.models.user import User


class Participant(Base):
    """One entry of a browser (``client_id``) into a meeting instance."""

    __tablename__ = "participants"
    __table_args__ = (
        CheckConstraint(
            "length(display_name) BETWEEN 1 AND 64", name="ck_participants_display_name_length"
        ),
        CheckConstraint(f"role IN ({sql_in(ParticipantRole)})", name="ck_participants_role"),
        CheckConstraint(f"status IN ({sql_in(ParticipantStatus)})", name="ck_participants_status"),
        Index("ix_participants_instance_status", "instance_id", "status"),
        Index("ix_participants_instance_client", "instance_id", "client_id"),
        {"sqlite_autoincrement": True},
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    instance_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("meeting_instances.id", ondelete="CASCADE"), nullable=False
    )
    user_id: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="SET NULL")
    )
    client_id: Mapped[str] = mapped_column(Text, nullable=False)
    display_name: Mapped[str] = mapped_column(Text, nullable=False)
    role: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(Text, nullable=False)
    audio_muted: Mapped[bool] = mapped_column(
        IntBool, nullable=False, default=True, server_default=TRUE_SQL
    )
    video_on: Mapped[bool] = mapped_column(
        IntBool, nullable=False, default=False, server_default=FALSE_SQL
    )
    joined_at: Mapped[datetime] = mapped_column(UtcDateTime, nullable=False)
    left_at: Mapped[datetime | None] = mapped_column(UtcDateTime)

    instance: Mapped[MeetingInstance] = relationship(back_populates="participants")
    user: Mapped[User | None] = relationship()

    @property
    def is_host(self) -> bool:
        return self.role == ParticipantRole.HOST

    @property
    def is_guest(self) -> bool:
        """Entered through a join path (no account attached), shown as "(Guest)"."""
        return self.user_id is None

    @property
    def in_meeting(self) -> bool:
        return self.status == ParticipantStatus.IN_MEETING
