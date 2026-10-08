"""Seed, startup recovery, janitor, heartbeat and CORS."""

import time
from dataclasses import replace
from datetime import timedelta

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import func, select
from sqlalchemy.orm import Session
from starlette.websockets import WebSocketDisconnect

from app.core.clock import utcnow
from app.core.config import Settings
from app.core.db import build_engine, build_session_factory
from app.main import create_app
from app.models import Meeting, MeetingInstance, Participant, User
from app.realtime.janitor import sweep
from app.realtime.room_manager import RoomManager
from app.seed import prepare_database
from tests.factories import join, make_meeting, start


def _counts(db: Session) -> tuple[int, ...]:
    return tuple(
        db.scalar(select(func.count()).select_from(model))
        for model in (User, Meeting, MeetingInstance, Participant)
    )


def test_seed_is_idempotent_and_reset_reseeds(settings: Settings) -> None:
    engine = build_engine(settings.database_url)
    sessions = build_session_factory(engine)
    prepare_database(engine, sessions, settings, "if-empty")
    with sessions() as db:
        first = _counts(db)
        pmi = db.get(User, 1).pmi
    prepare_database(engine, sessions, settings, "if-empty")
    with sessions() as db:
        assert _counts(db) == first == (6, 13, 6, 23)
    prepare_database(engine, sessions, settings, "reset")
    with sessions() as db:
        assert _counts(db) == first
        assert db.get(User, 1).pmi != pmi
    engine.dispose()


def test_seeded_data_through_the_api(settings: Settings) -> None:
    with TestClient(create_app(replace(settings, seed_on_start="reset"))) as client:
        me = client.get("/api/me").json()
        assert me["display_name"] == "Alex Morgan"
        assert len(client.get("/api/users").json()) == 5
        previous = client.get("/api/meetings", params={"view": "previous"}).json()
        assert [item["duration_minutes"] for item in previous] == [15, 40, 18, 34, 38, 40]
        assert [item["participant_count"] for item in previous] == [4, 6, 2, 3, 3, 5]
        upcoming = client.get("/api/meetings", params={"view": "upcoming"}).json()
        assert len(upcoming) == 7
        demo = next(item for item in upcoming if item["topic"] == "Client Demo – Acme Corp")
        assert len(client.get(f"/api/meetings/{demo['meeting_number']}").json()["invitees"]) == 3


def test_startup_ends_instances_left_live_by_a_previous_process(
    settings: Settings, client: TestClient, host: User
) -> None:
    number = client.post("/api/meetings/instant", json={}).json()["meeting"]["meeting_number"]
    start(client, number)
    with TestClient(create_app(settings)) as restarted:
        assert restarted.get(f"/api/meetings/{number}").json()["is_live"] is False


def test_janitor_reaps_stale_participants_and_ends_abandoned_instances(
    db: Session, settings: Settings, host: User, client: TestClient
) -> None:
    meeting = make_meeting(db, host, passcode=None)
    join(client, meeting.meeting_number, "guest")
    rooms = RoomManager()
    assert sweep(db, rooms, settings) == 0  # within the connect grace
    long_ago = utcnow() - timedelta(minutes=5)
    instance = db.scalars(select(MeetingInstance)).one()
    instance.started_at = long_ago
    for participant in instance.participants:
        participant.joined_at = long_ago
    db.commit()
    assert sweep(db, rooms, settings) == 0  # participant reaped, the room's last activity is now
    assert instance.participants[0].status == "left"
    instance.participants[0].left_at = long_ago
    db.commit()
    assert sweep(db, rooms, settings) == 1
    assert instance.ended_at == long_ago  # the last leave, not the sweep time


def test_silent_socket_is_dropped_after_the_heartbeat_timeout(
    settings: Settings, db: Session, host: User, client: TestClient
) -> None:
    meeting = make_meeting(db, host, passcode=None)
    quick = replace(settings, heartbeat_timeout_seconds=0.2)
    with TestClient(create_app(quick)) as fast_client:
        entry = join(fast_client, meeting.meeting_number, "guest").json()
        url = f"/ws/meetings/{meeting.meeting_number}?token={entry['token']}"
        with fast_client.websocket_connect(url) as socket:
            assert socket.receive_json()["type"] == "welcome"
            with pytest.raises(WebSocketDisconnect) as closed:
                socket.receive_json()
            assert closed.value.code == 4408
    deadline = time.monotonic() + 2
    while time.monotonic() < deadline:
        db.expire_all()
        if db.get(Participant, entry["participant"]["id"]).status == "left":
            break
        time.sleep(0.02)
    assert db.get(Participant, entry["participant"]["id"]).status == "left"


def test_cors_allows_configured_frontend_origins(client: TestClient) -> None:
    headers = {"Origin": "http://localhost:3100", "Access-Control-Request-Method": "POST"}
    response = client.options("/api/meetings", headers=headers)
    assert response.headers["access-control-allow-origin"] == "http://localhost:3100"
    blocked = client.options("/api/meetings", headers={**headers, "Origin": "http://evil.test"})
    assert "access-control-allow-origin" not in blocked.headers


def test_health_and_unknown_route_use_the_error_envelope(client: TestClient) -> None:
    assert client.get("/api/health").json() == {"ok": True}
    response = client.get("/api/nope")
    assert response.status_code == 404
    assert response.json() == {"error": {"code": "NOT_FOUND", "message": "Not Found"}}
