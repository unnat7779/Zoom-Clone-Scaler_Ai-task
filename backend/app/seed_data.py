"""Demo data for ``app.seed`` (PRD §10.6). Times are relative to "now" in the user's time zone."""

from dataclasses import dataclass, field
from datetime import time

from app.models import MeetingType

USER_TIMEZONE = "Asia/Kolkata"

CONTACTS: tuple[tuple[str, str], ...] = (
    ("Priya Sharma", "priya.sharma@example.com"),
    ("Rahul Verma", "rahul.verma@example.com"),
    ("Emily Chen", "emily.chen@example.com"),
    ("Daniel Kim", "daniel.kim@example.com"),
    ("Sara Ali", "sara.ali@example.com"),
)


@dataclass(frozen=True)
class UpcomingSeed:
    """A scheduled meeting. ``at`` is a wall-clock time ``day_offset`` days from today, or
    ``None`` to use ``minutes_from_now`` (rounded to the quarter hour)."""

    topic: str
    duration_minutes: int
    day_offset: int = 0
    at: time | None = None
    minutes_from_now: int = 0
    next_full_hour: bool = False
    description: str | None = None
    invitees: tuple[str, ...] = ()
    #: False → guests wait on the "waiting for the host" page until the host starts
    join_before_host: bool = True


@dataclass(frozen=True)
class PastSeed:
    """An ended meeting: its definition (unless PMI) plus one instance with participants.

    Instant and PMI topics are derived from the host's name, so ``topic`` is ``None`` for them.
    """

    topic: str | None
    kind: MeetingType
    day_offset: int
    at: time
    duration_minutes: int
    attendees: tuple[str, ...] = field(default=())


UPCOMING: tuple[UpcomingSeed, ...] = (
    UpcomingSeed("Morning Standup", 15, minutes_from_now=-120),
    UpcomingSeed(
        "Weekly Team Sync",
        30,
        next_full_hour=True,
        description="Status updates, blockers and next steps for the week.",
    ),
    UpcomingSeed("Design Review: Zoom Clone", 40, minutes_from_now=180, join_before_host=False),
    UpcomingSeed("1:1 with Priya", 30, day_offset=1, at=time(10, 0), join_before_host=False),
    UpcomingSeed("Sprint Planning", 40, day_offset=2, at=time(11, 0)),
    UpcomingSeed(
        "Client Demo – Acme Corp",
        40,
        day_offset=6,
        at=time(16, 0),
        description="Walkthrough of the new scheduling flow for the Acme team.",
        invitees=(
            "jane.doe@acme.example.com",
            "mark.lee@acme.example.com",
            "priya.sharma@example.com",
        ),
    ),
    UpcomingSeed("All Hands", 40, day_offset=9, at=time(9, 30)),
)

PREVIOUS: tuple[PastSeed, ...] = (
    PastSeed(
        "Daily Standup",
        MeetingType.SCHEDULED,
        -1,
        time(9, 30),
        15,
        ("Priya Sharma", "Rahul Verma", "Emily Chen"),
    ),
    PastSeed(
        "Product Roadmap Q4",
        MeetingType.SCHEDULED,
        -2,
        time(15, 0),
        40,
        ("Priya Sharma", "Rahul Verma", "Emily Chen", "Daniel Kim", "Sara Ali"),
    ),
    PastSeed(None, MeetingType.INSTANT, -3, time(17, 10), 18, ("Daniel Kim",)),
    PastSeed(None, MeetingType.PMI, -4, time(12, 0), 34, ("Sara Ali", "Emily Chen")),
    PastSeed(
        "Interview – Frontend Engineer",
        MeetingType.SCHEDULED,
        -6,
        time(11, 0),
        38,
        ("Emily Chen", "Jordan Lee"),
    ),
    PastSeed(
        "Retro",
        MeetingType.SCHEDULED,
        -8,
        time(16, 30),
        40,
        ("Priya Sharma", "Rahul Verma", "Daniel Kim", "Sara Ali"),
    ),
)
