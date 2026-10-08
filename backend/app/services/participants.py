"""In-meeting participant state: socket admission, departures, host transfer, media state and
the host commands (PRD §3, §8.15, §9). Every host command is authorised here, server-side.
"""

from dataclasses import dataclass
from datetime import datetime

from sqlalchemy.orm import Session

from app.core.security import TokenClaims
from app.models import Participant, ParticipantRole, ParticipantStatus
from app.repositories import participants as participants_repo
from app.services import errors
from app.services.instances import mark_left


@dataclass(frozen=True)
class HostChange:
    host_id: int
    previous_host_id: int


def authenticate(db: Session, number: str, claims: TokenClaims | None) -> Participant:
    participant = participants_repo.get(db, claims.participant_id) if claims else None
    if (
        claims is None
        or participant is None
        or participant.instance_id != claims.instance_id
        or participant.instance.meeting.meeting_number != number
    ):
        raise errors.unauthorized()
    if participant.status == ParticipantStatus.REMOVED:
        raise errors.removed()
    return participant


def mark_connected(db: Session, participant: Participant) -> None:
    """(Re)enter the meeting; a returning ex-host comes back as attendee if someone else hosts."""
    participant.status = ParticipantStatus.IN_MEETING
    participant.left_at = None
    if participant.is_host and _other_host(db, participant) is not None:
        participant.role = ParticipantRole.ATTENDEE
    db.commit()


def depart(
    db: Session, participant_id: int, connected_ids: set[int], now: datetime
) -> HostChange | None:
    """Record that a participant's socket is gone; hand the host role on if needed."""
    participant = participants_repo.get(db, participant_id)
    if participant is None:
        return None
    if participant.in_meeting:
        mark_left(participant, now)
    change = _transfer_host(db, participant, connected_ids) if participant.is_host else None
    db.commit()
    return change


def set_media_state(
    db: Session, participant: Participant, audio_muted: bool, video_on: bool
) -> bool:
    """Persist mic/camera state. Returns ``False`` when an unmute was refused by Mute All."""
    allowed = audio_muted or participant.is_host or participant.instance.allow_unmute
    participant.audio_muted = audio_muted or not allowed
    participant.video_on = video_on
    db.commit()
    return allowed


def require_host(participant: Participant) -> None:
    if not participant.is_host or not participant.in_meeting:
        raise errors.not_host()


def mute_all(db: Session, host: Participant, allow_unmute: bool) -> list[Participant]:
    """Mute everyone but the host; joiners start muted; optionally forbid self-unmute."""
    require_host(host)
    instance = host.instance
    instance.allow_unmute = allow_unmute
    instance.mute_on_entry = True
    others = [p for p in participants_repo.list_in_meeting(db, instance.id) if p.id != host.id]
    for participant in others:
        participant.audio_muted = True
    db.commit()
    return others


def mute(db: Session, host: Participant, target_id: int) -> Participant:
    require_host(host)
    target = _target(db, host, target_id)
    target.audio_muted = True
    db.commit()
    return target


def remove(db: Session, host: Participant, target_id: int, now: datetime) -> Participant:
    """Remove a participant; they cannot rejoin this instance (``REMOVED``)."""
    require_host(host)
    target = _target(db, host, target_id)
    if target.id == host.id:
        raise errors.bad_message("The host cannot remove themselves")
    target.status = ParticipantStatus.REMOVED
    target.left_at = now
    db.commit()
    return target


def _target(db: Session, host: Participant, target_id: int) -> Participant:
    target = participants_repo.get(db, target_id)
    if target is None or target.instance_id != host.instance_id or not target.in_meeting:
        raise errors.bad_message("That participant is not in this meeting")
    return target


def _other_host(db: Session, participant: Participant) -> Participant | None:
    in_meeting = participants_repo.list_in_meeting(db, participant.instance_id)
    return next((p for p in in_meeting if p.is_host and p.id != participant.id), None)


def _transfer_host(
    db: Session, departed: Participant, connected_ids: set[int]
) -> HostChange | None:
    """Give the role to the connected attendee who joined first (PRD §3)."""
    remaining = [
        p
        for p in participants_repo.list_in_meeting(db, departed.instance_id)
        if p.id in connected_ids and p.id != departed.id
    ]
    if not remaining or any(p.is_host for p in remaining):
        return None
    successor = remaining[0]
    successor.role = ParticipantRole.HOST
    departed.role = ParticipantRole.ATTENDEE
    return HostChange(host_id=successor.id, previous_host_id=departed.id)
