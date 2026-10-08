"""Bodies for validating, starting, joining and ending a live meeting (PRD §7.10, §9.1, §10.4)."""

from datetime import datetime

from pydantic import Field

from app.schemas.common import ApiModel, ClientId, DisplayName, RequestModel
from app.schemas.participant import Participant


class ValidateResponse(ApiModel):
    """Pre-join check (never leaks the passcode). ``exists=false`` → the invalid-link page."""

    exists: bool
    topic: str | None = None
    is_live: bool = False
    has_host: bool = False
    requires_passcode: bool = False
    passcode_ok: bool = Field(
        default=False,
        description="True when no passcode is needed or `pwd` is a valid invite token",
    )
    join_before_host: bool = False
    start_time: datetime | None = None
    is_recurring: bool = Field(
        default=False, description="Waiting room shows 'This is a recurring meeting'"
    )
    duration_minutes: int | None = None
    participant_video_on: bool = False
    mute_upon_entry: bool = Field(
        default=False, description="Joiners start muted (meeting option or the host's Mute All)"
    )


class StartRequest(RequestModel):
    client_id: ClientId
    display_name: DisplayName


class JoinRequest(RequestModel):
    client_id: ClientId
    display_name: DisplayName
    pwd: str | None = Field(default=None, max_length=64, description="Invite-link token")
    passcode: str | None = Field(default=None, max_length=64)
    audio_muted: bool = True
    video_on: bool = False


class EntryResponse(ApiModel):
    participant: Participant
    token: str = Field(description="Signed participant token for the WebSocket (12 h)")
    instance_id: int


class EndRequest(RequestModel):
    token: str
