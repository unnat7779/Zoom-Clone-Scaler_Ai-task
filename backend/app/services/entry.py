"""Entering and ending a live meeting: validate, start (host path), join (attendee path), end.

The role is decided by the entry path, not by the account (PRD §3): ``start`` makes the caller
host unless another browser already hosts; ``join`` always enters as attendee.
"""

from collections.abc import Callable
from dataclasses import dataclass
from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from app.core.config import Settings
from app.core.errors import AppError
from app.core.security import ParticipantTokens
from app.models import Meeting, MeetingInstance, Participant, ParticipantRole, ParticipantStatus
from app.repositories import meetings as meetings_repo
from app.repositories import participants as participants_repo
from app.schemas.entry import EntryResponse, JoinRequest, StartRequest, ValidateResponse
from app.services import errors, instances, meetings, presenters


@dataclass(frozen=True)
class EntryContext:
    settings: Settings
    tokens: ParticipantTokens
    connected_ids: Callable[[int], set[int]]


def validate(db: Session, number: str, pwd: str | None) -> ValidateResponse:
    try:
        meeting, instance = instances.resolve_for_entry(db, number)
    except AppError:
        return ValidateResponse(exists=False)
    has_host = instance is not None and bool(
        participants_repo.instance_ids_with_host(db, [instance.id])
    )
    return ValidateResponse(
        exists=True,
        topic=meeting.topic,
        is_live=instance is not None,
        has_host=has_host,
        requires_passcode=meeting.passcode is not None,
        passcode_ok=meeting.passcode is None or _token_matches(db, number, pwd),
        join_before_host=meeting.join_before_host,
        start_time=meeting.start_time,
        is_recurring=meeting.is_recurring,
        duration_minutes=meeting.duration_minutes,
        participant_video_on=meeting.participant_video_on,
        mute_upon_entry=instance.mute_on_entry if instance else meeting.mute_upon_entry,
    )


def start(
    db: Session,
    number: str,
    meeting_id: int | None,
    request: StartRequest,
    ctx: EntryContext,
    now: datetime,
) -> EntryResponse:
    target = meetings.resolve(db, number, meeting_id)
    _, instance = instances.ensure_live(db, target, now)
    others = _admissible_others(db, instance, request.client_id, ctx, now)
    has_host = any(participant.is_host for participant in others)
    participant = Participant(
        instance=instance,
        user_id=target.host_id,
        client_id=request.client_id,
        display_name=request.display_name,
        role=ParticipantRole.ATTENDEE if has_host else ParticipantRole.HOST,
        status=ParticipantStatus.IN_MEETING,
        audio_muted=True,
        video_on=False,
        joined_at=now,
    )
    return _admit(db, participant, ctx)


def join(
    db: Session, number: str, request: JoinRequest, ctx: EntryContext, now: datetime
) -> EntryResponse:
    meeting, instance = instances.resolve_for_entry(db, number)
    if meeting.passcode is not None and not _credentials_match(db, number, request):
        raise errors.wrong_passcode()
    if instance is None:
        if not meeting.join_before_host:
            raise errors.meeting_not_started()
        instance = instances.open_instance(db, meeting, now)
    _admissible_others(db, instance, request.client_id, ctx, now)
    participant = Participant(
        instance=instance,
        user_id=None,
        client_id=request.client_id,
        display_name=request.display_name,
        role=ParticipantRole.ATTENDEE,
        status=ParticipantStatus.IN_MEETING,
        audio_muted=request.audio_muted or instance.mute_on_entry,
        video_on=request.video_on,
        joined_at=now,
    )
    return _admit(db, participant, ctx)


def end(
    db: Session, number: str, token: str, tokens: ParticipantTokens, now: datetime
) -> tuple[int, int]:
    """End the caller's instance for everyone. Returns ``(instance_id, host participant id)``."""
    claims = tokens.verify(token)
    participant = participants_repo.get(db, claims.participant_id) if claims else None
    if claims is None or participant is None or participant.instance_id != claims.instance_id:
        raise errors.unauthorized()
    instance = participant.instance
    if instance.meeting.meeting_number != number:
        raise errors.unauthorized()
    if not participant.is_host or not participant.in_meeting:
        raise errors.not_host()
    if instance.is_live:
        instances.end(db, instance, now)
        db.commit()
    return instance.id, participant.id


def _admissible_others(
    db: Session, instance: MeetingInstance, client_id: str, ctx: EntryContext, now: datetime
) -> list[Participant]:
    """Check REMOVED / MEETING_FULL and return the other browsers currently in the instance.

    Rows of the same browser are ignored: its old tab is displaced when the new socket connects.
    """
    instances.reap_stale_participants(
        db,
        instance,
        ctx.connected_ids(instance.id),
        now,
        timedelta(seconds=ctx.settings.connect_grace_seconds),
    )
    own_rows = participants_repo.list_for_client(db, instance.id, client_id)
    if any(row.status == ParticipantStatus.REMOVED for row in own_rows):
        raise errors.removed()
    others = [
        row
        for row in participants_repo.list_in_meeting(db, instance.id)
        if row.client_id != client_id
    ]
    if len(others) >= ctx.settings.max_participants:
        raise errors.meeting_full()
    return others


def _admit(db: Session, participant: Participant, ctx: EntryContext) -> EntryResponse:
    db.add(participant)
    db.commit()
    return EntryResponse(
        participant=presenters.participant(participant),
        token=ctx.tokens.issue(participant.id, participant.instance_id),
        instance_id=participant.instance_id,
    )


def _token_matches(db: Session, number: str, pwd: str | None) -> bool:
    """Any invite token of a row sharing the number opens it (PMI and its calendar entries)."""
    return bool(pwd) and any(
        row.invite_token == pwd for row in meetings_repo.list_sharing_number(db, number)
    )


def _credentials_match(db: Session, number: str, request: JoinRequest) -> bool:
    if _token_matches(db, number, request.pwd):
        return True
    rows: list[Meeting] = meetings_repo.list_sharing_number(db, number)
    return bool(request.passcode) and any(row.passcode == request.passcode for row in rows)
