"""Invite links and Zoom's invitation text (PRD §10.3, §10.5)."""

from app.models import Meeting, MeetingType
from app.services.formatting import format_meeting_number, format_meeting_time

CRLF = "\r\n"


def invite_url(app_url: str, meeting: Meeting) -> str:
    return f"{app_url}/j/{meeting.meeting_number}?pwd={meeting.invite_token}"


def start_url(app_url: str, meeting: Meeting) -> str:
    return f"{app_url}/wc/{meeting.meeting_number}/start"


def invitation_topic(meeting: Meeting) -> str:
    if meeting.type == MeetingType.PMI:
        return f"{meeting.host.display_name}'s Personal Meeting Room"
    return meeting.topic


def invitation_text(app_url: str, meeting: Meeting) -> str:
    """Zoom's template with CRLF line endings; ends with the last line plus three CRLFs.

    PMI and instant meetings have no "Time:" line; without a passcode the "Passcode:" line is
    omitted.
    """
    lines = [
        f"{meeting.host.display_name} is inviting you to a scheduled Zoom meeting.",
        "",
        f"Topic: {invitation_topic(meeting)}",
    ]
    if meeting.type == MeetingType.SCHEDULED and meeting.start_time is not None:
        lines.append(f"Time: {format_meeting_time(meeting.start_time, meeting.timezone)}")
    lines += [
        "",
        "Join Zoom Meeting",
        invite_url(app_url, meeting),
        "",
        f"Meeting ID: {format_meeting_number(meeting.meeting_number)}",
    ]
    if meeting.passcode is not None:
        lines.append(f"Passcode: {meeting.passcode}")
    return CRLF.join(lines) + CRLF * 3
