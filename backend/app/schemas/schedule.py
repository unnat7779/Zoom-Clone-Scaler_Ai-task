"""Request bodies for scheduling and editing meetings (PRD §7.6, §7.7, §10.4)."""

from datetime import datetime
from typing import Any

from pydantic import EmailStr, Field, field_validator, model_validator

from app.schemas.common import RequestModel
from app.services import id_generator
from app.services.timezones import is_valid_timezone

MAX_INVITEES = 100


class _MeetingFieldRules(RequestModel):
    """Field validators shared by the create and the partial-update bodies."""

    @field_validator("topic", mode="before", check_fields=False)
    @classmethod
    def _topic_required(cls, value: Any) -> Any:
        if isinstance(value, str):
            value = value.strip()
            if not value:
                raise ValueError("Topic is required")
            if len(value) > 200:
                raise ValueError("Topic must be at most 200 characters")
        return value

    @field_validator("description", mode="before", check_fields=False)
    @classmethod
    def _blank_description_is_none(cls, value: Any) -> Any:
        if isinstance(value, str) and not value.strip():
            return None
        if isinstance(value, str) and len(value) > 2000:
            raise ValueError("Description must be at most 2000 characters")
        return value

    @field_validator("start_local", check_fields=False)
    @classmethod
    def _start_is_wall_clock(cls, value: datetime | None) -> datetime | None:
        if value is not None and value.tzinfo is not None:
            raise ValueError("start_local must be a local date-time without a UTC offset")
        return value

    @field_validator("timezone", check_fields=False)
    @classmethod
    def _known_timezone(cls, value: str | None) -> str | None:
        if value is not None and not is_valid_timezone(value):
            raise ValueError(f"Unknown time zone: {value}")
        return value

    @field_validator("passcode", check_fields=False)
    @classmethod
    def _passcode_length(cls, value: str | None) -> str | None:
        if value is not None and not 1 <= len(value) <= 10:
            raise ValueError("Passcode must be 1 to 10 characters")
        return value

    @field_validator("invitees", check_fields=False)
    @classmethod
    def _normalise_invitees(cls, value: list[str] | None) -> list[str] | None:
        if value is None:
            return None
        return list(dict.fromkeys(email.lower() for email in value))

    @model_validator(mode="after")
    def _no_null_for_required_columns(self) -> "_MeetingFieldRules":
        nullable = {"description", "passcode"}
        for name in self.model_fields_set - nullable:
            if getattr(self, name) is None:
                raise ValueError(f"{name} cannot be null")
        return self


class ScheduleRequest(_MeetingFieldRules):
    topic: str = Field(examples=["Weekly Team Sync"])
    description: str | None = None
    start_local: datetime = Field(
        description="Wall-clock start in `timezone`, e.g. 2026-10-08T11:00"
    )
    timezone: str = Field(examples=["Asia/Kolkata"])
    duration_minutes: int = Field(ge=0, le=1440)
    is_recurring: bool = False
    use_pmi: bool = False
    passcode: str | None = Field(
        default_factory=id_generator.passcode,
        description="Omitted → a random passcode; null → no passcode",
    )
    waiting_room: bool = False
    join_before_host: bool = True
    mute_upon_entry: bool = False
    host_video_on: bool = True
    participant_video_on: bool = True
    invitees: list[EmailStr] = Field(default_factory=list, max_length=MAX_INVITEES)


class MeetingUpdateRequest(_MeetingFieldRules):
    """Partial update: only the fields present in the body change (the number never changes)."""

    topic: str | None = None
    description: str | None = None
    start_local: datetime | None = None
    timezone: str | None = None
    duration_minutes: int | None = Field(default=None, ge=0, le=1440)
    is_recurring: bool | None = None
    passcode: str | None = None
    waiting_room: bool | None = None
    join_before_host: bool | None = None
    mute_upon_entry: bool | None = None
    host_video_on: bool | None = None
    participant_video_on: bool | None = None
    invitees: list[EmailStr] | None = Field(default=None, max_length=MAX_INVITEES)


class PmiUpdateRequest(_MeetingFieldRules):
    passcode: str | None = None
    waiting_room: bool | None = None
    join_before_host: bool | None = None
    mute_upon_entry: bool | None = None
    host_video_on: bool | None = None
    participant_video_on: bool | None = None


class InstantMeetingRequest(RequestModel):
    use_pmi: bool = False
