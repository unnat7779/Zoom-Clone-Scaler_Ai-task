"""validate / start / join / end: error codes and role-by-entry-path rules (PRD §3, §10.4)."""

from datetime import timedelta

from fastapi.testclient import TestClient
from httpx2 import Response
from sqlalchemy.orm import Session

from app.core.clock import utcnow
from app.models import Meeting, Participant, User
from tests.factories import join, make_meeting, start


def _code(response: Response) -> str:
    return response.json()["error"]["code"]


def test_validate_unknown_meeting(client: TestClient, host: User) -> None:
    body = client.get("/api/meetings/80000000000/validate").json()
    assert body["exists"] is False
    assert client.get("/api/meetings/not-a-number/validate").json()["exists"] is False


def test_validate_known_meeting_never_leaks_the_passcode(
    client: TestClient, db: Session, host: User
) -> None:
    meeting = make_meeting(db, host, join_before_host=False, participant_video_on=False)
    url = f"/api/meetings/{meeting.meeting_number}/validate"
    body = client.get(url).json()
    assert body["exists"] is True
    assert body["topic"] == "Planning"
    assert (body["is_live"], body["has_host"], body["join_before_host"]) == (False, False, False)
    assert (body["requires_passcode"], body["passcode_ok"]) == (True, False)
    assert body["participant_video_on"] is False
    assert "abc123" not in str(body)
    with_token = client.get(url, params={"pwd": meeting.invite_token}).json()
    assert with_token["passcode_ok"] is True
    assert client.get(url, params={"pwd": "wrong"}).json()["passcode_ok"] is False


def test_validate_reports_recurring_meetings(client: TestClient, db: Session, host: User) -> None:
    def recurring(number: str) -> bool:
        return client.get(f"/api/meetings/{number}/validate").json()["is_recurring"]

    assert recurring(make_meeting(db, host).meeting_number) is False
    assert recurring(make_meeting(db, host, is_recurring=True).meeting_number) is True


def test_validate_reports_live_host(client: TestClient, db: Session, host: User) -> None:
    meeting = make_meeting(db, host)
    start(client, meeting.meeting_number)
    body = client.get(f"/api/meetings/{meeting.meeting_number}/validate").json()
    assert (body["is_live"], body["has_host"]) == (True, True)


def test_join_not_found(client: TestClient, host: User) -> None:
    response = join(client, "80000000000", "guest")
    assert (response.status_code, _code(response)) == (404, "MEETING_NOT_FOUND")


def test_join_requires_invite_token_or_passcode(
    client: TestClient, db: Session, host: User
) -> None:
    meeting = make_meeting(db, host)
    number = meeting.meeting_number
    response = join(client, number, "guest")
    assert (response.status_code, _code(response)) == (403, "WRONG_PASSCODE")
    assert _code(join(client, number, "guest", passcode="nope")) == "WRONG_PASSCODE"
    assert join(client, number, "guest", passcode="abc123").status_code == 200
    assert join(client, number, "guest-2", pwd=meeting.invite_token).status_code == 200


def test_join_meeting_without_passcode(client: TestClient, db: Session, host: User) -> None:
    meeting = make_meeting(db, host, passcode=None)
    assert join(client, meeting.meeting_number, "guest").status_code == 200


def test_join_not_started_without_join_before_host(
    client: TestClient, db: Session, host: User
) -> None:
    meeting = make_meeting(db, host, join_before_host=False)
    response = join(client, meeting.meeting_number, "guest", passcode="abc123")
    assert (response.status_code, _code(response)) == (409, "MEETING_NOT_STARTED")
    start(client, meeting.meeting_number)
    assert join(client, meeting.meeting_number, "guest", passcode="abc123").status_code == 200


def test_join_before_host_opens_a_hostless_instance_then_start_makes_host(
    client: TestClient, db: Session, host: User
) -> None:
    meeting = make_meeting(db, host)
    attendee = join(client, meeting.meeting_number, "guest", passcode="abc123").json()
    participant = attendee["participant"]
    assert participant["role"] == "attendee"
    assert participant["is_guest"] is True
    assert client.get(f"/api/meetings/{meeting.meeting_number}").json()["is_live"] is True
    hosted = start(client, meeting.meeting_number).json()
    assert hosted["participant"]["role"] == "host"
    assert hosted["participant"]["is_guest"] is False
    assert hosted["instance_id"] == attendee["instance_id"]


def test_start_twice_from_other_browser_joins_as_attendee(
    client: TestClient, db: Session, host: User
) -> None:
    meeting = make_meeting(db, host)
    first = start(client, meeting.meeting_number, client_id="browser-a").json()
    second = start(client, meeting.meeting_number, client_id="browser-b").json()
    same_browser = start(client, meeting.meeting_number, client_id="browser-a").json()
    assert first["participant"]["role"] == "host"
    assert second["participant"]["role"] == "attendee"
    assert same_browser["participant"]["role"] == "host"  # a refresh keeps the host role
    assert first["instance_id"] == second["instance_id"] == same_browser["instance_id"]
    assert first["token"] != second["token"]


def test_start_uses_pmi_calendar_entry_row_by_id(
    client: TestClient, db: Session, host: User, pmi: Meeting
) -> None:
    entry = make_meeting(db, host, meeting_number=host.pmi, uses_pmi=True, topic="On PMI")
    started = client.post(
        f"/api/meetings/{host.pmi}/start",
        params={"id": entry.id},
        json={"client_id": "host-browser", "display_name": "Alex Morgan"},
    )
    assert started.status_code == 200
    validate = client.get(f"/api/meetings/{host.pmi}/validate").json()
    assert validate["topic"] == "On PMI"  # join-by-number follows the live row
    other = start(client, host.pmi, client_id="other-browser").json()
    assert other["instance_id"] == started.json()["instance_id"]  # no second live instance
    attendee = join(client, host.pmi, "guest", pwd=entry.invite_token)
    assert attendee.status_code == 200


def test_mute_on_entry_forces_joiners_muted(client: TestClient, db: Session, host: User) -> None:
    meeting = make_meeting(db, host, mute_upon_entry=True, passcode=None)
    joined = join(client, meeting.meeting_number, "guest", audio_muted=False, video_on=True).json()
    assert joined["participant"]["audio_muted"] is True
    assert joined["participant"]["video_on"] is True


def test_join_full_meeting(client: TestClient, db: Session, host: User) -> None:
    meeting = make_meeting(db, host, passcode=None)
    for index in range(8):
        assert join(client, meeting.meeting_number, f"guest-{index}").status_code == 200
    response = join(client, meeting.meeting_number, "guest-9")
    assert (response.status_code, _code(response)) == (409, "MEETING_FULL")
    assert join(client, meeting.meeting_number, "guest-0").status_code == 200  # same browser
    assert _code(start(client, meeting.meeting_number)) == "MEETING_FULL"


def test_stale_never_connected_participants_free_their_seat(
    client: TestClient, db: Session, host: User
) -> None:
    meeting = make_meeting(db, host, passcode=None)
    for index in range(8):
        join(client, meeting.meeting_number, f"guest-{index}")
    for participant in db.query(Participant):
        participant.joined_at = utcnow() - timedelta(minutes=5)
    db.commit()
    assert join(client, meeting.meeting_number, "late-guest").status_code == 200


def test_removed_browser_cannot_rejoin(client: TestClient, db: Session, host: User) -> None:
    meeting = make_meeting(db, host, passcode=None)
    joined = join(client, meeting.meeting_number, "guest").json()
    db.get(Participant, joined["participant"]["id"]).status = "removed"
    db.commit()
    response = join(client, meeting.meeting_number, "guest")
    assert (response.status_code, _code(response)) == (403, "REMOVED")
    assert _code(start(client, meeting.meeting_number, client_id="guest")) == "REMOVED"
    assert join(client, meeting.meeting_number, "another-guest").status_code == 200


def test_end_is_host_only(client: TestClient, db: Session, host: User) -> None:
    meeting = make_meeting(db, host, passcode=None)
    number = meeting.meeting_number
    host_token = start(client, number).json()["token"]
    guest_token = join(client, number, "guest").json()["token"]
    url = f"/api/meetings/{number}/end"
    forbidden = client.post(url, json={"token": guest_token})
    assert (forbidden.status_code, _code(forbidden)) == (403, "NOT_HOST")
    bad = client.post(url, json={"token": "garbage"})
    assert (bad.status_code, _code(bad)) == (401, "UNAUTHORIZED")
    wrong_number = client.post("/api/meetings/80000000000/end", json={"token": host_token})
    assert _code(wrong_number) == "UNAUTHORIZED"
    assert client.post(url, json={"token": host_token}).status_code == 204
    assert client.get(f"/api/meetings/{number}").json()["is_live"] is False
    assert all(p.status == "left" for p in db.query(Participant))


def test_entry_body_validation(client: TestClient, db: Session, host: User) -> None:
    meeting = make_meeting(db, host, passcode=None)
    response = client.post(
        f"/api/meetings/{meeting.meeting_number}/join",
        json={"client_id": "guest", "display_name": "   "},
    )
    assert (response.status_code, _code(response)) == (422, "VALIDATION_ERROR")
