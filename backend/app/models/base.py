"""Declarative base and the two column types that keep the SQLite schema exactly as PRD §10.1.

* Timestamps are ``TEXT`` holding UTC ISO-8601 with millisecond precision and a ``Z`` suffix
  (the same shape as ``strftime('%Y-%m-%dT%H:%M:%fZ','now')``), so they sort lexicographically.
* Booleans are ``INTEGER`` 0/1.
"""

from datetime import UTC, datetime

from sqlalchemy import Integer, Text, text
from sqlalchemy.engine import Dialect
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.types import TypeDecorator

UTC_NOW_SQL = text("(strftime('%Y-%m-%dT%H:%M:%fZ','now'))")
FALSE_SQL = text("0")
TRUE_SQL = text("1")


class Base(DeclarativeBase):
    pass


def to_utc_text(value: datetime) -> str:
    aware = value if value.tzinfo else value.replace(tzinfo=UTC)
    utc = aware.astimezone(UTC)
    return f"{utc:%Y-%m-%dT%H:%M:%S}.{utc.microsecond // 1000:03d}Z"


class UtcDateTime(TypeDecorator[datetime]):
    impl = Text
    cache_ok = True

    def process_bind_param(self, value: datetime | None, dialect: Dialect) -> str | None:
        return None if value is None else to_utc_text(value)

    def process_result_value(self, value: str | None, dialect: Dialect) -> datetime | None:
        return None if value is None else datetime.fromisoformat(value).astimezone(UTC)


class IntBool(TypeDecorator[bool]):
    impl = Integer
    cache_ok = True

    def process_bind_param(self, value: bool | None, dialect: Dialect) -> int | None:
        return None if value is None else int(bool(value))

    def process_result_value(self, value: int | None, dialect: Dialect) -> bool | None:
        return None if value is None else bool(value)
