"""WebSocket flows (PRD §9): welcome, roster, signalling relay, media state, host controls, end."""

from collections.abc import Iterator
from contextlib import contextmanager

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from starlette.testclient import WebSocketTestSession
from starlette.websockets import WebSocketDisconnect

from app.models import Meeting, Participant, User
from tests.factories import join, make_meeting, start


@pytest.fixture
def meeting(db: Session, host: User) -> Meeting:
    return make_meeting(db, host, passcode=None)


@contextmanager
def connect(client: TestClient, number: str, token: str) -> Iterator[WebSocketTestSession]:
    with client.websocket_connect(f"/ws/meetings/{number}?token={token}") as socket:
        yield socket


def expect(socket: WebSocketTestSession, message_type: str) -> dict:
    message = socket.receive_json()
    assert message["type"] == message_type, message
    return message


def test_host_and_attendee_full_flow(client: TestClient, db: Session, meeting: Meeting) -> None:
    number = meeting.meeting_number
    host_entry = start(client, number).json()
    with connect(client, number, host_entry["token"]) as host_ws:
        welcome = expect(host_ws, "welcome")
        assert welcome["self"]["role"] == "host"
        assert welcome["participants"] == []
        assert welcome["meeting"]["number"] == number
        assert welcome["meeting"]["invite_url"].startswith(f"http://app.test/j/{number}?pwd=")
        assert welcome["settings"] == {"allow_unmute": True, "mute_on_entry": False}

        guest_entry = join(client, number, "guest", audio_muted=False).json()
        guest_id = guest_entry["participant"]["id"]
        with connect(client, number, guest_entry["token"]) as guest_ws:
            guest_welcome = expect(guest_ws, "welcome")
            assert [p["id"] for p in guest_welcome["participants"]] == [
                host_entry["participant"]["id"]
            ]
            joined = expect(host_ws, "participant_joined")
            assert joined["participant"]["id"] == guest_id
            assert joined["participant"]["is_guest"] is True

            # Newcomer-initiated signalling is relayed with "from".
            guest_ws.send_json(
                {"type": "offer", "to": host_entry["participant"]["id"], "sdp": "v=0"}
            )
            offer = expect(host_ws, "offer")
            assert (offer["from"], offer["sdp"]) == (guest_id, "v=0")
            host_ws.send_json({"type": "ice", "to": guest_id, "candidate": {"candidate": "c"}})
            assert expect(guest_ws, "ice")["candidate"] == {"candidate": "c"}

            # Host mutes everyone and forbids self-unmute.
            host_ws.send_json(
                {"type": "host_command", "command": "mute_all", "allow_unmute": False}
            )
            assert expect(guest_ws, "force_mute")["by"] == host_entry["participant"]["id"]
            assert expect(guest_ws, "participant_updated")["participant"]["audio_muted"] is True
            settings = expect(guest_ws, "settings_updated")
            assert settings == {
                "type": "settings_updated",
                "allow_unmute": False,
                "mute_on_entry": True,
            }
            expect(host_ws, "participant_updated")
            expect(host_ws, "settings_updated")

            # The attendee cannot unmute; video still toggles.
            guest_ws.send_json({"type": "media_state", "audio_muted": False, "video_on": True})
            update = expect(guest_ws, "participant_updated")["participant"]
            assert (update["audio_muted"], update["video_on"]) == (True, True)
            assert expect(guest_ws, "error")["code"] == "NOT_HOST"
            expect(host_ws, "participant_updated")

            # Attendees cannot run host commands.
            guest_ws.send_json({"type": "host_command", "command": "remove", "target": 1})
            assert expect(guest_ws, "error")["code"] == "NOT_HOST"

            # Host removes the attendee.
            host_ws.send_json({"type": "host_command", "command": "remove", "target": guest_id})
            assert expect(guest_ws, "removed")["by"] == host_entry["participant"]["id"]
            with pytest.raises(WebSocketDisconnect):
                guest_ws.receive_json()
            left = expect(host_ws, "participant_left")
            assert (left["participant_id"], left["reason"]) == (guest_id, "removed")

        rejoin = join(client, number, "guest")
        assert rejoin.json()["error"]["code"] == "REMOVED"
        with connect(client, number, guest_entry["token"]) as removed_ws:
            assert expect(removed_ws, "error")["code"] == "REMOVED"

        # End for everyone.
        end = client.post(f"/api/meetings/{number}/end", json={"token": host_entry["token"]})
        assert end.status_code == 204
        assert expect(host_ws, "meeting_ended")["by"] == host_entry["participant"]["id"]
    assert client.get(f"/api/meetings/{number}").json()["is_live"] is False


def test_media_state_is_persisted_and_sent_to_late_joiners(
    client: TestClient, meeting: Meeting
) -> None:
    number = meeting.meeting_number
    host_entry = start(client, number).json()
    with connect(client, number, host_entry["token"]) as host_ws:
        expect(host_ws, "welcome")
        host_ws.send_json({"type": "media_state", "audio_muted": False, "video_on": True})
        expect(host_ws, "participant_updated")
        guest = join(client, number, "guest").json()
        with connect(client, number, guest["token"]) as guest_ws:
            host_view = expect(guest_ws, "welcome")["participants"][0]
            assert (host_view["audio_muted"], host_view["video_on"]) == (False, True)


def test_host_mutes_one_participant(client: TestClient, meeting: Meeting) -> None:
    number = meeting.meeting_number
    host_entry = start(client, number).json()
    guest = join(client, number, "guest", audio_muted=False).json()
    with (
        connect(client, number, host_entry["token"]) as host_ws,
        connect(client, number, guest["token"]) as guest_ws,
    ):
        expect(host_ws, "welcome")
        expect(guest_ws, "welcome")
        expect(host_ws, "participant_joined")
        host_ws.send_json(
            {"type": "host_command", "command": "mute", "target": guest["participant"]["id"]}
        )
        expect(guest_ws, "force_mute")
        assert expect(host_ws, "participant_updated")["participant"]["audio_muted"] is True


def test_host_leaving_transfers_host_to_earliest_attendee(
    client: TestClient, meeting: Meeting
) -> None:
    number = meeting.meeting_number
    host_entry = start(client, number).json()
    first = join(client, number, "guest-1").json()
    second = join(client, number, "guest-2").json()
    with (
        connect(client, number, first["token"]) as first_ws,
        connect(client, number, second["token"]) as second_ws,
    ):
        expect(first_ws, "welcome")
        expect(second_ws, "welcome")
        expect(first_ws, "participant_joined")
        with connect(client, number, host_entry["token"]) as host_ws:
            expect(host_ws, "welcome")
            expect(first_ws, "participant_joined")
            expect(second_ws, "participant_joined")
            host_ws.send_json({"type": "leave"})
        for socket in (first_ws, second_ws):
            left = expect(socket, "participant_left")
            assert (left["participant_id"], left["reason"]) == (
                host_entry["participant"]["id"],
                "left",
            )
            changed = expect(socket, "host_changed")
            assert changed["host_id"] == first["participant"]["id"]
            assert changed["previous_host_id"] == host_entry["participant"]["id"]


def test_duplicate_session_displaces_the_older_tab(
    client: TestClient, db: Session, meeting: Meeting
) -> None:
    number = meeting.meeting_number
    old = join(client, number, "same-browser").json()
    new = join(client, number, "same-browser").json()
    with connect(client, number, old["token"]) as old_ws:
        expect(old_ws, "welcome")
        with connect(client, number, new["token"]) as new_ws:
            assert expect(new_ws, "welcome")["participants"] == []
            assert expect(old_ws, "error")["code"] == "DUPLICATE_SESSION"
            with pytest.raises(WebSocketDisconnect):
                old_ws.receive_json()
    assert db.get(Participant, old["participant"]["id"]).status == "left"


def test_rejects_bad_tokens_and_bad_messages(client: TestClient, meeting: Meeting) -> None:
    number = meeting.meeting_number
    with connect(client, number, "garbage") as socket:
        assert expect(socket, "error")["code"] == "UNAUTHORIZED"
    entry = start(client, number).json()
    with connect(client, "80000000000", entry["token"]) as socket:
        assert expect(socket, "error")["code"] == "UNAUTHORIZED"
    with connect(client, number, entry["token"]) as socket:
        expect(socket, "welcome")
        socket.send_text("not json")
        assert expect(socket, "error")["code"] == "BAD_MESSAGE"
        socket.send_json({"type": "host_command", "command": "lock"})
        assert expect(socket, "error")["code"] == "BAD_MESSAGE"
        socket.send_json({"type": "ping"})
        expect(socket, "pong")


def test_ended_meeting_token_gets_meeting_ended(client: TestClient, meeting: Meeting) -> None:
    number = meeting.meeting_number
    entry = start(client, number).json()
    client.post(f"/api/meetings/{number}/end", json={"token": entry["token"]})
    with connect(client, number, entry["token"]) as socket:
        assert expect(socket, "meeting_ended")["by"] is None


def test_reconnect_with_same_token_restores_the_participant(
    client: TestClient, db: Session, meeting: Meeting
) -> None:
    number = meeting.meeting_number
    host_entry = start(client, number).json()
    guest = join(client, number, "guest").json()
    guest_id = guest["participant"]["id"]
    with connect(client, number, host_entry["token"]) as host_ws:
        expect(host_ws, "welcome")
        with connect(client, number, guest["token"]) as guest_ws:
            expect(guest_ws, "welcome")
            expect(host_ws, "participant_joined")
        left = expect(host_ws, "participant_left")
        assert (left["participant_id"], left["reason"]) == (guest_id, "disconnected")
        assert db.get(Participant, guest_id).status == "left"
        with connect(client, number, guest["token"]) as guest_ws:
            assert expect(guest_ws, "welcome")["self"]["id"] == guest_id
            assert expect(host_ws, "participant_joined")["participant"]["id"] == guest_id
            db.expire_all()
            assert db.get(Participant, guest_id).status == "in_meeting"
