"""Meeting response models (PRD §10.4)."""

from datetime import datetime

from pydantic import Field

from app.models.enums import MeetingType
from app.schemas.common import ApiModel


class Meeting(ApiModel):
    """Full meeting definition (detail page, edit form, PMI)."""

    id: int
    meeting_number: str
    type: MeetingType
    uses_pmi: bool
    topic: str
    description: str | None
    start_time: datetime | None = Field(description="UTC; null for instant and PMI meetings")
    duration_minutes: int
    timezone: str
    time_label: str | None = Field(
        description='Scheduled only, e.g. "Oct 8, 2026 11:00 AM India"', examples=[None]
    )
    passcode: str | None
    invite_url: str
    waiting_room: bool
    join_before_host: bool
    mute_upon_entry: bool
    host_video_on: bool
    participant_video_on: bool
    is_recurring: bool
    host_id: int
    host_name: str
    is_live: bool
    invitees: list[str]
    created_at: datetime
    updated_at: datetime


class MeetingListItem(ApiModel):
    """A row of Meetings → Upcoming and of the Home day view. Never carries the passcode."""

    id: int
    meeting_number: str
    type: MeetingType
    uses_pmi: bool
    topic: str
    start_time: datetime = Field(
        description="Scheduled start (UTC); for a live instant/PMI meeting, when it started"
    )
    duration_minutes: int
    timezone: str
    host_name: str
    is_live: bool
    has_instance: bool = Field(description="At least one instance ever ran (the `joined` style)")
    has_host: bool = Field(description="A live instance currently has a host in it")


class InstantMeetingResponse(ApiModel):
    meeting: Meeting
    invite_url: str
    start_url: str


class Invitation(ApiModel):
    text: str = Field(description="Zoom's invitation text with CRLF line endings")
