"""Meeting definitions: schedule, edit, soft-delete, PMI, instant meetings (PRD §7.3, §7.6–7.8)."""

from datetime import UTC, datetime, timedelta
from typing import Any
from zoneinfo import ZoneInfo

from sqlalchemy.orm import Session

from app.models import Meeting, MeetingInstance, MeetingInvitee, MeetingType, User
from app.repositories import instances as instances_repo
from app.repositories import meetings as meetings_repo
from app.schemas.schedule import MeetingUpdateRequest, PmiUpdateRequest, ScheduleRequest
from app.services import errors, id_generator, instances

PAST_START_TOLERANCE = timedelta(minutes=5)
_COLUMN_FOR_FIELD = {"waiting_room": "waiting_room_enabled"}
_SPECIAL_FIELDS = {"start_local", "timezone", "invitees", "use_pmi"}


def resolve(db: Session, number: str, meeting_id: int | None = None) -> Meeting:
    """The owner row of ``number``, or the row ``meeting_id`` sharing it (``uses_pmi`` entries)."""
    if meeting_id is None:
        meeting = meetings_repo.find_owner(db, number)
    else:
        meeting = meetings_repo.find_by_id(db, number, meeting_id)
    if meeting is None:
        raise errors.meeting_not_found()
    return meeting


def is_live(db: Session, meeting: Meeting) -> bool:
    return meeting.id in instances_repo.live_by_meeting(db, [meeting.id])


def get_pmi(db: Session, host: User) -> Meeting:
    meeting = meetings_repo.get_pmi(db, host.id)
    if meeting is None:
        raise errors.meeting_not_found()
    return meeting


def schedule(db: Session, host: User, request: ScheduleRequest, now: datetime) -> Meeting:
    start_time = _to_utc(request.start_local, request.timezone)
    _ensure_not_past(start_time, now)
    meeting = Meeting(
        meeting_number=host.pmi if request.use_pmi else _new_meeting_number(db),
        uses_pmi=request.use_pmi,
        host_id=host.id,
        type=MeetingType.SCHEDULED,
        start_time=start_time,
        timezone=request.timezone,
        invite_token=_new_invite_token(db),
        invitees=[MeetingInvitee(email=email) for email in request.invitees],
    )
    _apply(meeting, request.model_dump())
    db.add(meeting)
    db.commit()
    return meeting


def update(db: Session, meeting: Meeting, request: MeetingUpdateRequest, now: datetime) -> Meeting:
    if meeting.type != MeetingType.SCHEDULED:
        raise errors.not_scheduled()
    _ensure_not_live(db, meeting)
    changes = request.model_dump(exclude_unset=True)
    if "start_local" in changes or "timezone" in changes:
        _reschedule(meeting, changes.get("start_local"), changes.get("timezone"), now)
    if "invitees" in changes:
        _replace_invitees(meeting, changes["invitees"])
    _apply(meeting, changes)
    db.commit()
    return meeting


def _replace_invitees(meeting: Meeting, emails: list[str]) -> None:
    """Diff instead of reassigning: SQLAlchemy would insert the new rows before deleting the
    old ones, so an email kept in the list would violate UNIQUE(meeting_id, email)."""
    wanted = list(dict.fromkeys(emails))
    kept = [invitee for invitee in meeting.invitees if invitee.email in wanted]
    existing = {invitee.email for invitee in kept}
    meeting.invitees = kept + [
        MeetingInvitee(email=email) for email in wanted if email not in existing
    ]


def update_pmi(db: Session, host: User, request: PmiUpdateRequest) -> Meeting:
    meeting = get_pmi(db, host)
    _ensure_not_live(db, meeting)
    _apply(meeting, request.model_dump(exclude_unset=True))
    db.commit()
    return meeting


def delete(db: Session, meeting: Meeting, now: datetime) -> None:
    """Soft delete: Zoom's copy promises recovery within 7 days."""
    if meeting.type == MeetingType.PMI:
        raise errors.pmi_not_deletable()
    _ensure_not_live(db, meeting)
    meeting.deleted_at = now
    db.commit()


def create_instant(
    db: Session, host: User, use_pmi: bool, now: datetime
) -> tuple[Meeting, MeetingInstance]:
    """Create an instant meeting (or reuse the PMI) and make sure it has a live instance."""
    if use_pmi:
        meeting = get_pmi(db, host)
    else:
        meeting = Meeting(
            meeting_number=_new_meeting_number(db),
            host_id=host.id,
            type=MeetingType.INSTANT,
            topic=f"{host.display_name}'s Zoom Meeting",
            timezone=host.timezone,
            passcode=id_generator.passcode(),
            invite_token=_new_invite_token(db),
        )
        db.add(meeting)
        db.flush()
    _, instance = instances.ensure_live(db, meeting, now)
    db.commit()
    return meeting, instance


def _apply(meeting: Meeting, fields: dict[str, Any]) -> None:
    for name, value in fields.items():
        if name not in _SPECIAL_FIELDS:
            setattr(meeting, _COLUMN_FOR_FIELD.get(name, name), value)


def _reschedule(
    meeting: Meeting, start_local: datetime | None, timezone: str | None, now: datetime
) -> None:
    new_timezone = timezone or meeting.timezone
    if start_local is None and meeting.start_time is not None:
        start_local = meeting.start_time.astimezone(ZoneInfo(meeting.timezone)).replace(tzinfo=None)
    if start_local is None:
        raise errors.validation("start_local is required")
    start_time = _to_utc(start_local, new_timezone)
    if start_time != meeting.start_time:
        _ensure_not_past(start_time, now)
    meeting.start_time = start_time
    meeting.timezone = new_timezone


def _to_utc(start_local: datetime, timezone: str) -> datetime:
    return start_local.replace(tzinfo=ZoneInfo(timezone)).astimezone(UTC)


def _ensure_not_past(start_time: datetime, now: datetime) -> None:
    if start_time < now - PAST_START_TOLERANCE:
        raise errors.start_in_past()


def _ensure_not_live(db: Session, meeting: Meeting) -> None:
    if is_live(db, meeting):
        raise errors.meeting_live()


def _new_meeting_number(db: Session) -> str:
    return id_generator.unique(
        id_generator.meeting_number, lambda value: meetings_repo.number_taken(db, value)
    )


def _new_invite_token(db: Session) -> str:
    return id_generator.unique(
        id_generator.invite_token, lambda value: meetings_repo.invite_token_taken(db, value)
    )
