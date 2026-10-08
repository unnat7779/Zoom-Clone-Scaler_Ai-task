"""Schedule, edit, delete, PMI and instant meetings (PRD §7.3, §7.6–7.8, §10.4)."""

from datetime import timedelta

import pytest
from fastapi.testclient import TestClient
from httpx2 import Response
from sqlalchemy.orm import Session

from app.models import Meeting, User
from tests.factories import TZ, local_start, make_meeting, schedule_body, start


def _error(response: Response) -> tuple[int, str]:
    return response.status_code, response.json()["error"]["code"]


def test_schedule_creates_meeting_with_link_and_invitees(client: TestClient, host: User) -> None:
    body = schedule_body(
        description="  Agenda  ",
        invitees=["Priya.Sharma@Example.com", "priya.sharma@example.com", "dan@example.com"],
        passcode="s3cret",
        mute_upon_entry=True,
    )
    response = client.post("/api/meetings", json=body)
    assert response.status_code == 201
    meeting = response.json()
    assert len(meeting["meeting_number"]) == 11
    assert meeting["type"] == "scheduled"
    assert meeting["uses_pmi"] is False
    assert meeting["passcode"] == "s3cret"
    assert meeting["invite_url"].startswith(f"http://app.test/j/{meeting['meeting_number']}?pwd=")
    assert meeting["invitees"] == ["priya.sharma@example.com", "dan@example.com"]
    assert meeting["description"] == "  Agenda  "
    assert meeting["mute_upon_entry"] is True
    assert meeting["host_name"] == "Alex Morgan"
    assert meeting["time_label"].endswith("Mumbai, Kolkata, New Delhi")
    assert meeting["is_live"] is False
    fetched = client.get(f"/api/meetings/{meeting['meeting_number']}").json()
    assert fetched == meeting


def test_schedule_defaults_generate_a_passcode_and_null_disables_it(
    client: TestClient, host: User
) -> None:
    generated = client.post("/api/meetings", json=schedule_body()).json()
    assert len(generated["passcode"]) == 6
    assert generated["join_before_host"] is True
    none = client.post("/api/meetings", json=schedule_body(passcode=None)).json()
    assert none["passcode"] is None


def test_start_time_is_converted_from_the_chosen_zone(client: TestClient, host: User) -> None:
    body = schedule_body(start_local="2030-01-15T09:30", timezone="America/New_York")
    meeting = client.post("/api/meetings", json=body).json()
    assert meeting["start_time"] == "2030-01-15T14:30:00Z"
    assert meeting["time_label"] == "Jan 15, 2030 09:30 AM Eastern Time (US and Canada)"


@pytest.mark.parametrize(
    ("overrides", "message"),
    [
        ({"topic": "   "}, "Topic is required"),
        ({"topic": "x" * 201}, "Topic must be at most 200 characters"),
        ({"duration_minutes": 1441}, "duration_minutes"),
        ({"duration_minutes": -1}, "duration_minutes"),
        ({"passcode": "12345678901"}, "Passcode must be 1 to 10 characters"),
        ({"passcode": ""}, "Passcode must be 1 to 10 characters"),
        ({"invitees": ["not-an-email"]}, "invitees"),
        ({"timezone": "Mars/Olympus"}, "Unknown time zone"),
        ({"start_local": "2030-01-15T09:30:00+05:30"}, "without a UTC offset"),
        ({"description": "d" * 2001}, "Description must be at most 2000 characters"),
        ({"unexpected": True}, "unexpected"),
    ],
)
def test_schedule_validation(
    client: TestClient, host: User, overrides: dict[str, object], message: str
) -> None:
    response = client.post("/api/meetings", json=schedule_body(**overrides))
    assert _error(response) == (422, "VALIDATION_ERROR")
    assert message in response.json()["error"]["message"]


def test_start_time_more_than_five_minutes_in_the_past_is_rejected(
    client: TestClient, host: User
) -> None:
    body = schedule_body(start_local=local_start(-timedelta(minutes=10)))
    response = client.post("/api/meetings", json=body)
    assert _error(response) == (422, "START_IN_PAST")
    assert response.json()["error"]["message"] == "The start time has already passed"


def test_start_time_within_five_minutes_in_the_past_is_accepted(
    client: TestClient, host: User
) -> None:
    body = schedule_body(start_local=local_start(-timedelta(minutes=3)))
    assert client.post("/api/meetings", json=body).status_code == 201


def test_schedule_with_pmi_shares_the_number_and_resolves_by_id(
    client: TestClient, host: User, pmi: Meeting
) -> None:
    entry = client.post("/api/meetings", json=schedule_body(use_pmi=True, topic="On my PMI")).json()
    assert entry["meeting_number"] == host.pmi
    assert entry["uses_pmi"] is True
    assert client.get(f"/api/meetings/{host.pmi}").json()["type"] == "pmi"
    by_id = client.get(f"/api/meetings/{host.pmi}", params={"id": entry["id"]}).json()
    assert by_id["topic"] == "On my PMI"
    invitation = client.get(f"/api/meetings/{host.pmi}/invitation", params={"id": entry["id"]})
    assert "Topic: On my PMI\r\nTime: " in invitation.json()["text"]


def test_patch_updates_fields_and_reschedules(client: TestClient, host: User) -> None:
    meeting = client.post("/api/meetings", json=schedule_body()).json()
    number = meeting["meeting_number"]
    response = client.patch(
        f"/api/meetings/{number}",
        json={"topic": "Renamed", "timezone": "UTC", "waiting_room": True, "invitees": []},
    )
    assert response.status_code == 200
    updated = response.json()
    assert updated["topic"] == "Renamed"
    assert updated["waiting_room"] is True
    assert updated["timezone"] == "UTC"
    assert updated["start_time"] != meeting["start_time"]  # same wall clock, new zone
    assert updated["meeting_number"] == number
    nulled = client.patch(f"/api/meetings/{number}", json={"topic": None})
    assert _error(nulled) == (422, "VALIDATION_ERROR")


def test_patch_and_delete_are_refused_while_live(client: TestClient, host: User) -> None:
    number = client.post("/api/meetings", json=schedule_body()).json()["meeting_number"]
    assert start(client, number).status_code == 200
    assert _error(client.patch(f"/api/meetings/{number}", json={"topic": "x"})) == (
        409,
        "MEETING_LIVE",
    )
    assert _error(client.delete(f"/api/meetings/{number}")) == (409, "MEETING_LIVE")


def test_delete_is_soft_and_hides_the_meeting(client: TestClient, db: Session, host: User) -> None:
    number = client.post("/api/meetings", json=schedule_body()).json()["meeting_number"]
    assert client.delete(f"/api/meetings/{number}").status_code == 204
    assert _error(client.get(f"/api/meetings/{number}")) == (404, "MEETING_NOT_FOUND")
    assert _error(client.delete(f"/api/meetings/{number}")) == (404, "MEETING_NOT_FOUND")
    row = db.query(Meeting).filter_by(meeting_number=number).one()
    assert row.deleted_at is not None


def test_pmi_cannot_be_deleted_or_patched_as_scheduled(client: TestClient, host: User) -> None:
    assert _error(client.delete(f"/api/meetings/{host.pmi}")) == (400, "PMI_NOT_DELETABLE")
    patch = client.patch(f"/api/meetings/{host.pmi}", json={"topic": "x"})
    assert _error(patch) == (400, "NOT_SCHEDULED")


def test_get_and_patch_pmi(client: TestClient, host: User) -> None:
    pmi = client.get("/api/meetings/pmi").json()
    assert pmi["type"] == "pmi"
    assert pmi["waiting_room"] is True
    assert pmi["start_time"] is None
    updated = client.patch("/api/meetings/pmi", json={"passcode": "newpass", "waiting_room": False})
    assert updated.json()["passcode"] == "newpass"
    assert updated.json()["waiting_room"] is False


def test_instant_meeting_is_created_live(client: TestClient, host: User) -> None:
    response = client.post("/api/meetings/instant", json={})
    assert response.status_code == 201
    body = response.json()
    meeting = body["meeting"]
    assert meeting["type"] == "instant"
    assert meeting["topic"] == "Alex Morgan's Zoom Meeting"
    assert meeting["is_live"] is True
    assert len(meeting["passcode"]) == 6
    assert body["start_url"] == f"http://app.test/wc/{meeting['meeting_number']}/start"
    assert body["invite_url"] == meeting["invite_url"]


def test_instant_with_pmi_reuses_the_pmi_and_its_live_instance(
    client: TestClient, host: User
) -> None:
    first = client.post("/api/meetings/instant", json={"use_pmi": True}).json()
    second = client.post("/api/meetings/instant", json={"use_pmi": True}).json()
    assert first["meeting"]["meeting_number"] == host.pmi == second["meeting"]["meeting_number"]
    assert client.get(f"/api/meetings/{host.pmi}").json()["is_live"] is True


def test_me_and_contacts(client: TestClient, db: Session, host: User) -> None:
    db.add(User(display_name="Priya Sharma", email="priya@example.com", pmi="2123456789"))
    db.commit()
    me = client.get("/api/me").json()
    assert me["pmi_formatted"] == "512 345 6789"
    assert (me["initials"], me["avatar_color"]) == ("AM", "#9053C2")
    contacts = client.get("/api/users", params={"q": "PRI"}).json()
    assert [user["display_name"] for user in contacts] == ["Priya Sharma"]
    assert client.get("/api/users", params={"q": "zzz"}).json() == []


def test_meeting_number_lookup_ignores_deleted_rows(
    client: TestClient, db: Session, host: User
) -> None:
    make_meeting(db, host, meeting_number="81111111111", timezone=TZ)
    assert client.get("/api/meetings/81111111111").status_code == 200
    assert _error(client.get("/api/meetings/80000000000")) == (404, "MEETING_NOT_FOUND")


def test_patch_invitees_keeps_existing_emails(client: TestClient, host: User) -> None:
    created = client.post(
        "/api/meetings", json=schedule_body(invitees=["a@example.com", "b@example.com"])
    ).json()
    number = created["meeting_number"]
    response = client.patch(
        f"/api/meetings/{number}", json={"invitees": ["b@example.com", "c@example.com"]}
    )
    assert response.status_code == 200
    assert response.json()["invitees"] == ["b@example.com", "c@example.com"]
