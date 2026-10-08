"""Identifier generation, number/time formatting and invitation text (PRD §10.2, §10.3, §10.5)."""

import re
from datetime import UTC, datetime

import pytest

from app.models import Meeting, MeetingType, User
from app.services import id_generator
from app.services.formatting import (
    avatar_color,
    format_meeting_number,
    format_meeting_time,
    initials,
)
from app.services.invitation import invitation_text, invite_url
from app.services.timezone_data import TIMEZONES
from app.services.timezones import is_valid_timezone, short_label


def test_meeting_number_is_11_digits_starting_with_8_or_9() -> None:
    numbers = {id_generator.meeting_number() for _ in range(200)}
    assert all(re.fullmatch(r"[89]\d{10}", number) for number in numbers)
    assert len(numbers) > 190


def test_pmi_is_10_digits_starting_with_2_to_9() -> None:
    assert all(re.fullmatch(r"[2-9]\d{9}", id_generator.pmi()) for _ in range(200))


def test_passcode_has_6_unambiguous_characters() -> None:
    for _ in range(200):
        passcode = id_generator.passcode()
        assert len(passcode) == 6
        assert not set(passcode) & set("0OoIl1")
        assert passcode.isalnum()


def test_invite_token_and_uuid_shapes() -> None:
    assert re.fullmatch(r"[A-Za-z0-9_-]{32}", id_generator.invite_token())
    assert re.fullmatch(r"[0-9a-f]{32}", id_generator.instance_uuid())


def test_numeric_passcode_is_stable_six_digits() -> None:
    value = id_generator.numeric_passcode("J2NVpB")
    assert re.fullmatch(r"\d{6}", value)
    assert value == id_generator.numeric_passcode("J2NVpB")


def test_unique_retries_on_collision_then_gives_up() -> None:
    values = iter(["taken", "taken", "free"])
    assert id_generator.unique(lambda: next(values), lambda v: v == "taken") == "free"
    with pytest.raises(RuntimeError):
        id_generator.unique(lambda: "taken", lambda _v: True)


@pytest.mark.parametrize(
    ("raw", "formatted"),
    [
        ("123456789", "123 456 789"),
        ("5123456789", "512 345 6789"),
        ("81234567890", "812 3456 7890"),
        ("1234", "1234"),
        ("abcdefghij", "abcdefghij"),
    ],
)
def test_format_meeting_number(raw: str, formatted: str) -> None:
    assert format_meeting_number(raw) == formatted


def test_initials_and_avatar_colors() -> None:
    assert initials("Alex Morgan") == "AM"
    assert initials("chrome guest user") == "CG"
    assert initials("Priya") == "P"
    assert avatar_color(7, is_current_user=True) == "#9053C2"
    assert avatar_color(8, is_current_user=False) == "#247F40"


def test_format_meeting_time_uses_zone_label_and_padded_hour() -> None:
    start = datetime(2026, 10, 8, 3, 30, tzinfo=UTC)  # 09:00 in India
    assert format_meeting_time(start, "Asia/Calcutta") == "Oct 8, 2026 09:00 AM India"
    assert format_meeting_time(start, "Europe/Kiev").startswith("Oct 8, 2026 06:30 AM Kyiv")


def test_timezone_list_has_zoom_149_valid_entries() -> None:
    assert len(TIMEZONES) == 149
    assert all(is_valid_timezone(zone) for zone, _ in TIMEZONES)
    assert short_label("Asia/Kolkata") == "Mumbai, Kolkata, New Delhi"
    assert short_label("Africa/Abidjan") == "Africa/Abidjan"
    assert not is_valid_timezone("Mars/Olympus")
    assert not is_valid_timezone("")


def _meeting(**fields: object) -> Meeting:
    host = User(display_name="Alex Morgan", email="a@example.com", pmi="5123456789")
    values: dict[str, object] = {
        "type": MeetingType.SCHEDULED,
        "meeting_number": "81234567890",
        "topic": "Weekly Team Sync",
        "start_time": datetime(2026, 10, 8, 5, 30, tzinfo=UTC),
        "timezone": "Asia/Calcutta",
        "passcode": "abc123",
        "invite_token": "tok",
    }
    return Meeting(host=host, **(values | fields))


def test_scheduled_invitation_text_is_exact_with_crlf() -> None:
    expected = (
        "Alex Morgan is inviting you to a scheduled Zoom meeting.\r\n"
        "\r\n"
        "Topic: Weekly Team Sync\r\n"
        "Time: Oct 8, 2026 11:00 AM India\r\n"
        "\r\n"
        "Join Zoom Meeting\r\n"
        "https://app.test/j/81234567890?pwd=tok\r\n"
        "\r\n"
        "Meeting ID: 812 3456 7890\r\n"
        "Passcode: abc123\r\n"
        "\r\n"
        "\r\n"
    )
    assert invitation_text("https://app.test", _meeting()) == expected


def test_pmi_invitation_has_no_time_line() -> None:
    meeting = _meeting(type=MeetingType.PMI, meeting_number="5123456789", start_time=None)
    text = invitation_text("https://app.test", meeting)
    assert "Topic: Alex Morgan's Personal Meeting Room\r\n\r\nJoin Zoom Meeting" in text
    assert "Time:" not in text
    assert "Meeting ID: 512 345 6789\r\n" in text


def test_invitation_without_passcode_omits_the_line() -> None:
    text = invitation_text("https://app.test", _meeting(passcode=None))
    assert "Passcode" not in text
    assert text.endswith("Meeting ID: 812 3456 7890\r\n\r\n\r\n")


def test_invite_url() -> None:
    assert invite_url("https://app.test", _meeting()) == "https://app.test/j/81234567890?pwd=tok"
