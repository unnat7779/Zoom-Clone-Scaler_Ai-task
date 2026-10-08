"""Builds the ``welcome`` message a newly connected participant receives first."""

from sqlalchemy.orm import Session

from app.models import Participant
from app.realtime import protocol as p
from app.realtime.room_manager import RoomManager
from app.repositories import participants as participants_repo
from app.services import presenters
from app.services.id_generator import numeric_passcode
from app.services.invitation import invite_url


def build_welcome(
    db: Session, participant: Participant, rooms: RoomManager, app_url: str
) -> p.Welcome:
    instance = participant.instance
    meeting = instance.meeting
    connected = rooms.connected_ids(instance.id)
    others = [
        presenters.participant(row)
        for row in participants_repo.list_in_meeting(db, instance.id)
        if row.id in connected and row.id != participant.id
    ]
    return p.Welcome(
        self_=presenters.participant(participant),
        participants=others,
        meeting=p.WelcomeMeeting(
            number=meeting.meeting_number,
            topic=meeting.topic,
            host_name=meeting.host.display_name,
            invite_url=invite_url(app_url, meeting),
            passcode=meeting.passcode,
            numeric_passcode=numeric_passcode(meeting.passcode) if meeting.passcode else None,
            start_time=meeting.start_time,
            duration_minutes=meeting.duration_minutes,
        ),
        settings=p.MeetingSettings(
            allow_unmute=instance.allow_unmute, mute_on_entry=instance.mute_on_entry
        ),
    )
