"""Domain vocabularies stored as TEXT columns guarded by CHECK constraints."""

from enum import StrEnum


class MeetingType(StrEnum):
    INSTANT = "instant"
    SCHEDULED = "scheduled"
    PMI = "pmi"


class ParticipantRole(StrEnum):
    HOST = "host"
    ATTENDEE = "attendee"


class ParticipantStatus(StrEnum):
    IN_MEETING = "in_meeting"
    LEFT = "left"
    REMOVED = "removed"


def sql_in(enum: type[StrEnum]) -> str:
    """``'a','b','c'`` for use in a CHECK constraint."""
    return ",".join(f"'{member.value}'" for member in enum)
