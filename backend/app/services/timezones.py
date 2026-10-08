"""Time-zone helpers built on ``zoneinfo`` and Zoom's option list."""

from datetime import date, datetime, time, timedelta
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

from app.services.timezone_data import TIMEZONES

_LABELS = dict(TIMEZONES)


def is_valid_timezone(name: str) -> bool:
    if not name:
        return False
    try:
        ZoneInfo(name)
    except (ZoneInfoNotFoundError, ValueError):
        return False
    return True


def short_label(name: str) -> str:
    """Zoom's label without the ``(GMT±H:MM)`` prefix; falls back to the IANA id."""
    return _LABELS.get(name, name)


def local_day_bounds(day: date, timezone: str) -> tuple[datetime, datetime]:
    """``[start, end)`` of a calendar day in ``timezone`` as aware datetimes (DST-safe)."""
    zone = ZoneInfo(timezone)
    start = datetime.combine(day, time.min, tzinfo=zone)
    end = datetime.combine(day + timedelta(days=1), time.min, tzinfo=zone)
    return start, end


def local_today(now: datetime, timezone: str) -> date:
    return now.astimezone(ZoneInfo(timezone)).date()
