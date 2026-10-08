"""WebSocket message protocol (PRD §9.2). Every message is JSON ``{"type": ...}``.

Client → server messages are validated with :data:`client_message_adapter`; anything that does not
match gets ``error {code: "BAD_MESSAGE"}``. Server → client messages are built from the models
below and serialised with :func:`dump`.
"""

from datetime import datetime
from typing import Annotated, Any, Literal

from pydantic import BaseModel, ConfigDict, Field, TypeAdapter

from app.schemas.participant import Participant

MAX_SDP_LENGTH = 200_000


class _Message(BaseModel):
    model_config = ConfigDict(extra="forbid", populate_by_name=True)


# ----- client → server ------------------------------------------------------------------------


class OfferIn(_Message):
    type: Literal["offer"]
    to: int
    sdp: str = Field(max_length=MAX_SDP_LENGTH)


class AnswerIn(_Message):
    type: Literal["answer"]
    to: int
    sdp: str = Field(max_length=MAX_SDP_LENGTH)


class IceIn(_Message):
    type: Literal["ice"]
    to: int
    candidate: dict[str, Any] | None = Field(description="RTCIceCandidateInit, null = end")


class MediaStateIn(_Message):
    type: Literal["media_state"]
    audio_muted: bool
    video_on: bool


class LeaveIn(_Message):
    type: Literal["leave"]


class PingIn(_Message):
    type: Literal["ping"]


class MuteAllCommand(_Message):
    type: Literal["host_command"]
    command: Literal["mute_all"]
    allow_unmute: bool = True


class MuteCommand(_Message):
    type: Literal["host_command"]
    command: Literal["mute"]
    target: int


class RemoveCommand(_Message):
    type: Literal["host_command"]
    command: Literal["remove"]
    target: int


HostCommandIn = Annotated[
    MuteAllCommand | MuteCommand | RemoveCommand, Field(discriminator="command")
]
ClientMessage = Annotated[
    OfferIn | AnswerIn | IceIn | MediaStateIn | LeaveIn | PingIn | HostCommandIn,
    Field(discriminator="type"),
]
client_message_adapter: TypeAdapter[ClientMessage] = TypeAdapter(ClientMessage)


# ----- server → client ------------------------------------------------------------------------


class WelcomeMeeting(BaseModel):
    number: str
    topic: str
    host_name: str
    invite_url: str
    passcode: str | None
    numeric_passcode: str | None = Field(description="Info popover phone passcode")
    start_time: datetime | None
    duration_minutes: int


class MeetingSettings(BaseModel):
    allow_unmute: bool
    mute_on_entry: bool


class Welcome(_Message):
    type: Literal["welcome"] = "welcome"
    self_: Participant = Field(alias="self")
    participants: list[Participant] = Field(description="Everyone already connected, except self")
    meeting: WelcomeMeeting
    settings: MeetingSettings


class ParticipantJoined(_Message):
    type: Literal["participant_joined"] = "participant_joined"
    participant: Participant


class ParticipantUpdated(_Message):
    type: Literal["participant_updated"] = "participant_updated"
    participant: Participant


LeaveReason = Literal["left", "removed", "disconnected"]


class ParticipantLeft(_Message):
    type: Literal["participant_left"] = "participant_left"
    participant_id: int
    reason: LeaveReason


class SdpRelay(_Message):
    type: Literal["offer", "answer"]
    from_: int = Field(alias="from")
    to: int
    sdp: str


class IceRelay(_Message):
    type: Literal["ice"] = "ice"
    from_: int = Field(alias="from")
    to: int
    candidate: dict[str, Any] | None


class HostChanged(_Message):
    type: Literal["host_changed"] = "host_changed"
    host_id: int
    previous_host_id: int


class MeetingEnded(_Message):
    type: Literal["meeting_ended"] = "meeting_ended"
    by: int | None = Field(description="Participant id of the host who ended it; null = system")


class ForceMute(_Message):
    type: Literal["force_mute"] = "force_mute"
    by: int


class Removed(_Message):
    type: Literal["removed"] = "removed"
    by: int


class SettingsUpdated(_Message):
    type: Literal["settings_updated"] = "settings_updated"
    allow_unmute: bool
    mute_on_entry: bool


ErrorCode = Literal["UNAUTHORIZED", "REMOVED", "DUPLICATE_SESSION", "NOT_HOST", "BAD_MESSAGE"]


class ErrorOut(_Message):
    type: Literal["error"] = "error"
    code: ErrorCode
    message: str


class Pong(_Message):
    type: Literal["pong"] = "pong"


ServerMessage = (
    Welcome
    | ParticipantJoined
    | ParticipantUpdated
    | ParticipantLeft
    | SdpRelay
    | IceRelay
    | HostChanged
    | MeetingEnded
    | ForceMute
    | Removed
    | SettingsUpdated
    | ErrorOut
    | Pong
)


def dump(message: ServerMessage) -> dict[str, Any]:
    return message.model_dump(mode="json", by_alias=True)
