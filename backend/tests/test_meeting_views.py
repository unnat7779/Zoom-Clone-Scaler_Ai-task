"""Upcoming / day / previous queries, instance detail and schema constraints (PRD §10.1)."""

from datetime import date, datetime, timedelta
from zoneinfo import ZoneInfo

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.clock import utcnow
from app.models import MeetingInstance, MeetingType, Participant, User
from tests.factories import TZ, make_ended_instance, make_meeting, start

ZONE = ZoneInfo(TZ)


def _at(day: date, hour: int, minute: int = 0) -> datetime:
    return datetime(day.year, day.month, day.day, hour, minute, tzinfo=ZONE)


def _topics(items: list[dict]) -> list[str]:
    return [item["topic"] for item in items]


def test_upcoming_lists_scheduled_from_today_and_live_instant(
    client: TestClient, db: Session, host: User
) -> None:
    today = utcnow().astimezone(ZONE).date()
    make_meeting(db, host, topic="Yesterday", start_time=_at(today - timedelta(days=1), 10))
    make_meeting(db, host, topic="Next week", start_time=_at(today + timedelta(days=7), 9))
    make_meeting(db, host, topic="Today early", start_time=_at(today, 0, 0))
    make_meeting(db, host, topic="Deleted", start_time=_at(today, 12), deleted_at=utcnow())
    instant = client.post("/api/meetings/instant", json={}).json()["meeting"]

    items = client.get("/api/meetings", params={"view": "upcoming"}).json()
    assert _topics(items) == ["Today early", "Alex Morgan's Zoom Meeting", "Next week"]
    live = next(item for item in items if item["meeting_number"] == instant["meeting_number"])
    assert live["is_live"] is True
    assert live["has_host"] is False
    assert "passcode" not in live


def test_upcoming_honours_from_parameter(client: TestClient, db: Session, host: User) -> None:
    soon = utcnow() + timedelta(hours=1)
    make_meeting(db, host, topic="Soon", start_time=soon)
    make_meeting(db, host, topic="Later", start_time=soon + timedelta(days=2))
    start_from = (soon + timedelta(days=1)).isoformat()
    items = client.get("/api/meetings", params={"view": "upcoming", "from": start_from}).json()
    assert _topics(items) == ["Later"]


def test_day_view_uses_local_day_bounds_and_flags(
    client: TestClient, db: Session, host: User
) -> None:
    day = date(2031, 3, 10)
    make_meeting(db, host, topic="Before midnight", start_time=_at(day, 23, 45))
    make_meeting(db, host, topic="Morning", start_time=_at(day, 9))
    make_meeting(db, host, topic="Next day", start_time=_at(day + timedelta(days=1), 0, 0))
    started = make_meeting(db, host, topic="Had instance", start_time=_at(day, 12))
    make_ended_instance(db, started, _at(day, 12, 1), 20, ["Priya"])

    params = {"view": "day", "date": day.isoformat(), "tz": TZ}
    items = client.get("/api/meetings", params=params).json()
    assert _topics(items) == ["Morning", "Had instance", "Before midnight"]
    assert [item["has_instance"] for item in items] == [False, True, False]
    utc_items = client.get("/api/meetings", params={**params, "tz": "UTC"}).json()
    assert "Next day" in _topics(utc_items)  # 00:00 IST is 18:30 UTC the previous day


def test_day_view_today_includes_live_instant_and_pmi(
    client: TestClient, db: Session, host: User
) -> None:
    client.post("/api/meetings/instant", json={"use_pmi": True})
    today = utcnow().astimezone(ZONE).date()
    params = {"view": "day", "date": today.isoformat(), "tz": TZ}
    items = client.get("/api/meetings", params=params).json()
    assert [(item["type"], item["is_live"]) for item in items] == [("pmi", True)]
    tomorrow = {**params, "date": (today + timedelta(days=1)).isoformat()}
    assert client.get("/api/meetings", params=tomorrow).json() == []


@pytest.mark.parametrize(
    "params",
    [{"view": "day"}, {"view": "day", "date": "2031-01-01", "tz": "Nope/Zone"}, {"view": "all"}],
)
def test_list_view_validation(client: TestClient, host: User, params: dict[str, str]) -> None:
    response = client.get("/api/meetings", params=params)
    assert response.status_code == 422
    assert response.json()["error"]["code"] == "VALIDATION_ERROR"


def test_previous_lists_ended_instances_newest_first(
    client: TestClient, db: Session, host: User, pmi
) -> None:
    now = utcnow()
    old = make_meeting(db, host, topic="Retro", start_time=now - timedelta(days=8))
    recent = make_meeting(db, host, topic="Standup", start_time=now - timedelta(days=1))
    make_ended_instance(db, old, now - timedelta(days=8), 40, ["Priya", "Rahul"])
    make_ended_instance(db, recent, now - timedelta(days=1), 15, ["Priya"])
    make_ended_instance(db, pmi, now - timedelta(days=4), 34, ["Sara", "Emily", "Dan"])
    recent.deleted_at = now
    db.commit()

    items = client.get("/api/meetings", params={"view": "previous", "limit": 2}).json()
    assert _topics(items) == ["Standup", "Alex Morgan's Personal Meeting Room"]
    assert [item["duration_minutes"] for item in items] == [15, 34]
    assert [item["participant_count"] for item in items] == [2, 4]
    assert [item["meeting_exists"] for item in items] == [False, True]


def test_participant_count_is_distinct_browsers(
    client: TestClient, db: Session, host: User
) -> None:
    meeting = make_meeting(db, host, start_time=utcnow() - timedelta(hours=1))
    instance = make_ended_instance(db, meeting, utcnow() - timedelta(hours=1), 10, ["Priya"])
    rejoin = Participant(
        instance_id=instance.id,
        client_id="client-Priya",
        display_name="Priya",
        role="attendee",
        status="left",
        joined_at=instance.started_at,
        left_at=instance.ended_at,
    )
    db.add(rejoin)
    db.commit()
    detail = client.get(f"/api/instances/{instance.uuid}").json()
    assert detail["instance"]["participant_count"] == 2
    assert len(detail["participants"]) == 3
    assert detail["meeting"]["topic"] == "Planning"
    assert detail["participants"][0]["role"] == "host"


def test_instance_detail_of_unknown_or_live_instance_is_404(
    client: TestClient, db: Session, host: User
) -> None:
    client.post("/api/meetings/instant", json={})
    live = db.query(MeetingInstance).one()
    for uuid in ("nope", live.uuid):
        response = client.get(f"/api/instances/{uuid}")
        assert response.status_code == 404
        assert response.json()["error"]["code"] == "INSTANCE_NOT_FOUND"


def test_ended_meeting_appears_in_previous(client: TestClient, host: User) -> None:
    number = client.post("/api/meetings/instant", json={}).json()["meeting"]["meeting_number"]
    token = start(client, number).json()["token"]
    assert client.post(f"/api/meetings/{number}/end", json={"token": token}).status_code == 204
    items = client.get("/api/meetings", params={"view": "previous"}).json()
    assert items[0]["meeting_number"] == number
    assert items[0]["participant_count"] == 1
    assert items[0]["duration_minutes"] == 1


def test_one_live_instance_per_meeting_is_enforced(db: Session, host: User, pmi) -> None:
    for _ in range(2):
        db.add(MeetingInstance(meeting=pmi, uuid=f"live-{_}", started_at=utcnow()))
    with pytest.raises(IntegrityError):
        db.commit()


def test_foreign_keys_and_checks_are_enforced(db: Session, host: User) -> None:
    db.add(
        Participant(
            instance_id=999,
            client_id="x",
            display_name="X",
            role="attendee",
            status="in_meeting",
            joined_at=utcnow(),
        )
    )
    with pytest.raises(IntegrityError):
        db.commit()
    db.rollback()
    with pytest.raises(IntegrityError):
        make_meeting(db, host, type=MeetingType.SCHEDULED, start_time=None)
