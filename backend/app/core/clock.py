"""Single source of "now" so every timestamp is timezone-aware UTC."""

from datetime import UTC, datetime


def utcnow() -> datetime:
    """Now in UTC, truncated to milliseconds (the precision timestamps are stored with)."""
    now = datetime.now(UTC)
    return now.replace(microsecond=now.microsecond // 1000 * 1000)
