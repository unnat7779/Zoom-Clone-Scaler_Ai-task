"""Display formatting shared with the frontend's ``lib/format.ts`` (PRD §10.3, §5.8.14)."""

from datetime import datetime
from zoneinfo import ZoneInfo

from app.services.timezones import short_label

# Workplace (PWA) avatar palette, in Zoom's order; the current user is always purple.
PWA_AVATAR_COLORS = (
    "#247F40",
    "#9053C2",
    "#007C7C",
    "#2974A8",
    "#555B62",
    "#9D3B0F",
    "#B36200",
    "#DA1639",
)
CURRENT_USER_AVATAR_COLOR = "#9053C2"

_NUMBER_GROUPS = {9: (3, 3, 3), 10: (3, 3, 4), 11: (3, 4, 4)}


def format_meeting_number(number: str) -> str:
    """``81234567890`` → ``812 3456 7890``; ``5123456789`` → ``512 345 6789``."""
    groups = _NUMBER_GROUPS.get(len(number))
    if groups is None or not number.isdigit():
        return number
    parts, start = [], 0
    for size in groups:
        parts.append(number[start : start + size])
        start += size
    return " ".join(parts)


def initials(name: str) -> str:
    """First letter of the first two words, uppercase ("Alex Morgan" → "AM")."""
    return "".join(word[0] for word in name.split()[:2]).upper()


def avatar_color(user_id: int, is_current_user: bool) -> str:
    if is_current_user:
        return CURRENT_USER_AVATAR_COLOR
    return PWA_AVATAR_COLORS[user_id % len(PWA_AVATAR_COLORS)]


def format_meeting_time(start_time: datetime, timezone: str) -> str:
    """Invitation/detail "Time": ``MMM d, yyyy hh:mm A`` + time-zone label.

    The label has no ``(GMT…)`` prefix, e.g. ``Oct 8, 2026 11:00 AM India``.
    """
    local = start_time.astimezone(ZoneInfo(timezone))
    return f"{local:%b} {local.day}, {local.year} {local:%I:%M %p} {short_label(timezone)}"
