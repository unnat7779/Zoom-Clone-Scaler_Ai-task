from collections.abc import Iterable

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models import Meeting, MeetingInstance, Participant


def get_by_uuid(db: Session, uuid: str) -> MeetingInstance | None:
    return db.scalar(select(MeetingInstance).where(MeetingInstance.uuid == uuid))


def live_by_meeting(db: Session, meeting_ids: Iterable[int]) -> dict[int, MeetingInstance]:
    statement = select(MeetingInstance).where(
        MeetingInstance.meeting_id.in_(list(meeting_ids)), MeetingInstance.ended_at.is_(None)
    )
    return {instance.meeting_id: instance for instance in db.scalars(statement)}


def meeting_ids_with_instances(db: Session, meeting_ids: Iterable[int]) -> set[int]:
    statement = select(MeetingInstance.meeting_id).where(
        MeetingInstance.meeting_id.in_(list(meeting_ids))
    )
    return set(db.scalars(statement.distinct()))


def list_live(db: Session) -> list[MeetingInstance]:
    return list(db.scalars(select(MeetingInstance).where(MeetingInstance.ended_at.is_(None))))


def list_ended(db: Session, host_id: int, limit: int) -> list[tuple[MeetingInstance, int]]:
    """Ended instances of ``host_id``'s meetings, newest first, with distinct-browser counts."""
    participant_count = (
        select(func.count(func.distinct(Participant.client_id)))
        .where(Participant.instance_id == MeetingInstance.id)
        .scalar_subquery()
    )
    statement = (
        select(MeetingInstance, participant_count)
        .join(Meeting, Meeting.id == MeetingInstance.meeting_id)
        .where(Meeting.host_id == host_id, MeetingInstance.ended_at.is_not(None))
        .order_by(MeetingInstance.ended_at.desc(), MeetingInstance.id.desc())
        .limit(limit)
    )
    return [(instance, count) for instance, count in db.execute(statement)]


def distinct_participant_count(db: Session, instance_id: int) -> int:
    statement = select(func.count(func.distinct(Participant.client_id))).where(
        Participant.instance_id == instance_id
    )
    return db.scalar(statement) or 0
