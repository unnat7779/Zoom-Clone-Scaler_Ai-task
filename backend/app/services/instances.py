"""Instance lifecycle: open, find the live one for a number, end, and clean up abandoned ones.

"Connected" participants are the ones with an open WebSocket; callers pass their ids in, so this
module stays independent of the realtime layer.
"""

from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from app.models import Meeting, MeetingInstance, Participant, ParticipantStatus
from app.repositories import instances as instances_repo
from app.repositories import meetings as meetings_repo
from app.repositories import participants as participants_repo
from app.services import errors, id_generator


def find_live(db: Session, number: str) -> tuple[Meeting, MeetingInstance] | None:
    """The live instance of any non-deleted row sharing ``number`` (at most one exists)."""
    rows = meetings_repo.list_sharing_number(db, number)
    live = instances_repo.live_by_meeting(db, [row.id for row in rows])
    return next(((row, live[row.id]) for row in rows if row.id in live), None)


def resolve_for_entry(db: Session, number: str) -> tuple[Meeting, MeetingInstance | None]:
    """Join-by-number target: the row with the live instance, else the owner row."""
    live = find_live(db, number)
    if live is not None:
        return live
    owner = meetings_repo.find_owner(db, number)
    if owner is None:
        raise errors.meeting_not_found()
    return owner, None


def open_instance(db: Session, meeting: Meeting, now: datetime) -> MeetingInstance:
    instance = MeetingInstance(
        meeting=meeting,
        uuid=id_generator.instance_uuid(),
        started_at=now,
        allow_unmute=True,
        mute_on_entry=meeting.mute_upon_entry,
    )
    db.add(instance)
    db.flush()
    return instance


def ensure_live(db: Session, meeting: Meeting, now: datetime) -> tuple[Meeting, MeetingInstance]:
    """Reuse the live instance of the number (refusing a second one), or open one on ``meeting``."""
    return find_live(db, meeting.meeting_number) or (meeting, open_instance(db, meeting, now))


def end(db: Session, instance: MeetingInstance, now: datetime) -> None:
    instance.ended_at = now
    for participant in participants_repo.list_in_meeting(db, instance.id):
        mark_left(participant, now)


def reap_stale_participants(
    db: Session,
    instance: MeetingInstance,
    connected_ids: set[int],
    now: datetime,
    connect_grace: timedelta,
) -> None:
    """Mark ``in_meeting`` rows whose browser never opened (or lost) its socket as ``left``."""
    for participant in participants_repo.list_in_meeting(db, instance.id):
        if participant.id not in connected_ids and participant.joined_at < now - connect_grace:
            mark_left(participant, now)


def close_if_abandoned(
    db: Session,
    instance: MeetingInstance,
    connected_ids: set[int],
    now: datetime,
    empty_grace: timedelta,
) -> bool:
    """End a live instance nobody is in once ``empty_grace`` has passed since its last activity.

    ``ended_at`` is that last activity (the last leave), so Previous shows the real duration.
    """
    if connected_ids or participants_repo.list_in_meeting(db, instance.id):
        return False
    activity = [instance.started_at]
    for participant in participants_repo.list_for_instance(db, instance.id):
        activity += [participant.joined_at, participant.left_at or participant.joined_at]
    last_activity = max(activity)
    if last_activity > now - empty_grace:
        return False
    instance.ended_at = last_activity
    return True


def end_all_live(db: Session, now: datetime) -> int:
    """Startup recovery: sockets do not survive a restart, so no instance can still be live."""
    live = instances_repo.list_live(db)
    for instance in live:
        end(db, instance, now)
    db.commit()
    return len(live)


def mark_left(participant: Participant, now: datetime) -> None:
    participant.status = ParticipantStatus.LEFT
    participant.left_at = now
