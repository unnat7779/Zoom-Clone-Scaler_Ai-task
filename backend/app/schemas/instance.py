"""Ended meeting instances: Meetings → Previous and Home → Recent meetings (PRD §10.1, §10.4)."""

from datetime import datetime

from pydantic import Field

from app.models.enums import MeetingType
from app.schemas.common import ApiModel
from app.schemas.meeting import Meeting
from app.schemas.participant import ParticipantRecord


class InstanceListItem(ApiModel):
    uuid: str
    meeting_id: int
    meeting_number: str
    type: MeetingType
    uses_pmi: bool
    topic: str
    host_name: str
    started_at: datetime
    ended_at: datetime
    duration_minutes: int = Field(description="ended_at − started_at, rounded up, at least 1")
    participant_count: int = Field(description="Distinct browsers (client ids) that joined")
    meeting_exists: bool = Field(description="False once the meeting definition is deleted")


class InstanceDetail(ApiModel):
    instance: InstanceListItem
    meeting: Meeting | None = Field(description="Null when the meeting has been deleted")
    participants: list[ParticipantRecord]
