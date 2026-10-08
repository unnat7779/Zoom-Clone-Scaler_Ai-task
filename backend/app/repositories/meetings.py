from datetime import datetime

from sqlalchemy import Select, exists, false, select
from sqlalchemy.orm import Session

from app.models import Meeting, MeetingInstance, MeetingType


def _active() -> Select[tuple[Meeting]]:
    return select(Meeting).where(Meeting.deleted_at.is_(None))


def find_owner(db: Session, number: str) -> Meeting | None:
    """The non-deleted row that owns ``number`` (a generated meeting or the PMI)."""
    statement = _active().where(Meeting.meeting_number == number, Meeting.uses_pmi == false())
    return db.scalar(statement)


def find_by_id(db: Session, number: str, meeting_id: int) -> Meeting | None:
    statement = _active().where(Meeting.id == meeting_id, Meeting.meeting_number == number)
    return db.scalar(statement)


def list_sharing_number(db: Session, number: str) -> list[Meeting]:
    """Every non-deleted row using ``number`` (the owner plus ``uses_pmi`` calendar entries)."""
    return list(db.scalars(_active().where(Meeting.meeting_number == number)))


def get_pmi(db: Session, host_id: int) -> Meeting | None:
    return db.scalar(
        select(Meeting).where(Meeting.host_id == host_id, Meeting.type == MeetingType.PMI)
    )


def number_taken(db: Session, number: str) -> bool:
    """Deleted rows keep their number reserved (``ux_meetings_number`` covers them too)."""
    statement = exists().where(Meeting.meeting_number == number, Meeting.uses_pmi == false())
    return bool(db.scalar(select(statement)))


def invite_token_taken(db: Session, token: str) -> bool:
    return bool(db.scalar(select(exists().where(Meeting.invite_token == token))))


def list_scheduled(
    db: Session, host_id: int, start_from: datetime, start_before: datetime | None = None
) -> list[Meeting]:
    statement = _active().where(
        Meeting.host_id == host_id,
        Meeting.type == MeetingType.SCHEDULED,
        Meeting.start_time >= start_from,
    )
    if start_before is not None:
        statement = statement.where(Meeting.start_time < start_before)
    return list(db.scalars(statement.order_by(Meeting.start_time, Meeting.id)))


def list_live(
    db: Session, host_id: int, types: tuple[MeetingType, ...]
) -> list[tuple[Meeting, MeetingInstance]]:
    """Non-deleted meetings of the given types that have a live instance."""
    statement = (
        select(Meeting, MeetingInstance)
        .join(MeetingInstance, MeetingInstance.meeting_id == Meeting.id)
        .where(
            Meeting.host_id == host_id,
            Meeting.deleted_at.is_(None),
            Meeting.type.in_(types),
            MeetingInstance.ended_at.is_(None),
        )
    )
    return [(meeting, instance) for meeting, instance in db.execute(statement)]
