"""Test data builders and small API helpers."""

from datetime import datetime, timedelta
from itertools import count
from typing import Any
from zoneinfo import ZoneInfo

from fastapi.testclient import TestClient
from httpx2 import Response
from sqlalchemy.orm import Session

from app.core.clock import utcnow
from app.models import Meeting, MeetingInstance, MeetingType, Participant, User
from app.services import id_generator

TZ = "Asia/Kolkata"
_sequence = count(1)


def make_host(db: Session) -> User:
    user = User(
        display_name="Alex Morgan", email="alex.morgan@example.com", pmi="5123456789", timezone=TZ
    )
    pmi = Meeting(
        host=user,
        type=MeetingType.PMI,
        meeting_number=user.pmi,
        topic="Alex Morgan's Personal Meeting Room",
        timezone=TZ,
        passcode="pmi123",
        invite_token="pmi-invite-token",
        waiting_room_enabled=True,
    )
    db.add_all([user, pmi])
    db.commit()
    return user


def make_meeting(db: Session, host: User, **fields: Any) -> Meeting:
    values: dict[str, Any] = {
        "type": MeetingType.SCHEDULED,
        "meeting_number": f"8{next(_sequence):010d}",
        "topic": "Planning",
        "timezone": TZ,
        "start_time": utcnow() + timedelta(hours=2),
        "duration_minutes": 30,
        "passcode": "abc123",
        "invite_token": id_generator.invite_token(),
    }
    values |= fields
    if values["type"] != MeetingType.SCHEDULED and "start_time" not in fields:
        values["start_time"] = None
    meeting = Meeting(host=host, **values)
    db.add(meeting)
    db.commit()
    return meeting


def make_ended_instance(
    db: Session, meeting: Meeting, started_at: datetime, minutes: int, guests: list[str]
) -> MeetingInstance:
    ended_at = started_at + timedelta(minutes=minutes)
    instance = MeetingInstance(
        meeting=meeting,
        uuid=id_generator.instance_uuid(),
        started_at=started_at,
        ended_at=ended_at,
    )
    for name in ["Alex Morgan", *guests]:
        instance.participants.append(
            Participant(
                client_id=f"client-{name}",
                display_name=name,
                role="host" if name == "Alex Morgan" else "attendee",
                status="left",
                joined_at=started_at,
                left_at=ended_at,
            )
        )
    db.add(instance)
    db.commit()
    return instance


def local_start(delta: timedelta) -> str:
    """``start_local`` (wall clock in ``TZ``) for ``now + delta``."""
    return (utcnow() + delta).astimezone(ZoneInfo(TZ)).strftime("%Y-%m-%dT%H:%M")


def schedule_body(**overrides: Any) -> dict[str, Any]:
    body: dict[str, Any] = {
        "topic": "Weekly Team Sync",
        "start_local": local_start(timedelta(days=1)),
        "timezone": TZ,
        "duration_minutes": 30,
    }
    return body | overrides


def start(client: TestClient, number: str, client_id: str = "host-browser") -> Response:
    body = {"client_id": client_id, "display_name": "Alex Morgan"}
    return client.post(f"/api/meetings/{number}/start", json=body)


def join(client: TestClient, number: str, client_id: str, **extra: Any) -> Response:
    body = {"client_id": client_id, "display_name": f"Guest {client_id}"} | extra
    return client.post(f"/api/meetings/{number}/join", json=body)
