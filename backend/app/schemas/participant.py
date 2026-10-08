from datetime import datetime

from app.models.enums import ParticipantRole, ParticipantStatus
from app.schemas.common import ApiModel


class Participant(ApiModel):
    """A participant as seen inside a live meeting (REST entry responses and WebSocket)."""

    id: int
    display_name: str
    role: ParticipantRole
    is_guest: bool
    audio_muted: bool
    video_on: bool
    joined_at: datetime


class ParticipantRecord(ApiModel):
    """A participant of a past meeting (Meetings → Previous detail)."""

    id: int
    display_name: str
    role: ParticipantRole
    is_guest: bool
    status: ParticipantStatus
    joined_at: datetime
    left_at: datetime | None
