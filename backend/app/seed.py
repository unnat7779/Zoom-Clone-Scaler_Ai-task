"""Idempotent demo seed (PRD §10.6).

python -m app.seed            # create tables, seed only if the database is empty
python -m app.seed --reset    # drop everything and seed again
"""

import argparse
from datetime import datetime, time, timedelta
from typing import Any
from zoneinfo import ZoneInfo

from sqlalchemy import Engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.clock import utcnow
from app.core.config import SeedMode, Settings, get_settings
from app.core.db import build_engine, build_session_factory
from app.models import (
    Base,
    Meeting,
    MeetingInstance,
    MeetingInvitee,
    MeetingType,
    Participant,
    ParticipantRole,
    ParticipantStatus,
    User,
)
from app.repositories import meetings as meetings_repo
from app.repositories import users as users_repo
from app.seed_data import CONTACTS, PREVIOUS, UPCOMING, USER_TIMEZONE, PastSeed, UpcomingSeed
from app.services import id_generator

ZONE = ZoneInfo(USER_TIMEZONE)


def prepare_database(
    engine: Engine, session_factory: sessionmaker[Session], settings: Settings, mode: SeedMode
) -> None:
    """Create tables and seed according to ``mode`` (``if-empty`` | ``reset`` | ``off``)."""
    if mode == "reset":
        Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)
    if mode == "off":
        return
    with session_factory() as db:
        if not users_repo.any_user(db):
            seed(db, settings, utcnow())


def seed(db: Session, settings: Settings, now: datetime) -> None:
    local_now = now.astimezone(ZONE)
    host = _user(db, settings.seed_user_name, settings.seed_user_email)
    for name, email in CONTACTS:
        _user(db, name, email)
    pmi = _meeting(
        db,
        host,
        type=MeetingType.PMI,
        meeting_number=host.pmi,
        topic=f"{host.display_name}'s Personal Meeting Room",
        waiting_room_enabled=True,
        join_before_host=True,
    )
    for upcoming in UPCOMING:
        _scheduled(db, host, upcoming, _upcoming_start(upcoming, local_now))
    for past in PREVIOUS:
        _past_meeting(db, host, pmi, past, local_now)
    db.commit()


def _user(db: Session, name: str, email: str) -> User:
    pmi = id_generator.unique(id_generator.pmi, lambda value: users_repo.pmi_taken(db, value))
    user = User(display_name=name, email=email, pmi=pmi, timezone=USER_TIMEZONE)
    db.add(user)
    db.flush()
    return user


def _meeting(db: Session, host: User, **fields: Any) -> Meeting:
    defaults: dict[str, Any] = {
        "meeting_number": id_generator.unique(
            id_generator.meeting_number, lambda value: meetings_repo.number_taken(db, value)
        ),
        "timezone": USER_TIMEZONE,
        "passcode": id_generator.passcode(),
        "invite_token": id_generator.invite_token(),
    }
    meeting = Meeting(host=host, **(defaults | fields))
    db.add(meeting)
    db.flush()
    return meeting


def _scheduled(db: Session, host: User, item: UpcomingSeed | PastSeed, start: datetime) -> Meeting:
    invitees = item.invitees if isinstance(item, UpcomingSeed) else ()
    description = item.description if isinstance(item, UpcomingSeed) else None
    join_before_host = item.join_before_host if isinstance(item, UpcomingSeed) else True
    return _meeting(
        db,
        host,
        type=MeetingType.SCHEDULED,
        topic=item.topic,
        description=description,
        start_time=start,
        duration_minutes=item.duration_minutes,
        join_before_host=join_before_host,
        invitees=[MeetingInvitee(email=email) for email in invitees],
    )


def _upcoming_start(item: UpcomingSeed, local_now: datetime) -> datetime:
    if item.at is not None:
        day = local_now.date() + timedelta(days=item.day_offset)
        return datetime.combine(day, item.at, tzinfo=ZONE)
    if item.next_full_hour:
        return local_now.replace(minute=0, second=0, microsecond=0) + timedelta(hours=1)
    quarter = local_now.replace(
        minute=local_now.minute - local_now.minute % 15, second=0, microsecond=0
    )
    midnight = datetime.combine(local_now.date(), time.min, tzinfo=ZONE)
    return max(quarter + timedelta(minutes=item.minutes_from_now), midnight)


def _past_meeting(
    db: Session, host: User, pmi: Meeting, item: PastSeed, local_now: datetime
) -> None:
    start = datetime.combine(
        local_now.date() + timedelta(days=item.day_offset), item.at, tzinfo=ZONE
    )
    if item.kind == MeetingType.PMI:
        meeting = pmi
    elif item.kind == MeetingType.INSTANT:
        meeting = _meeting(
            db, host, type=MeetingType.INSTANT, topic=f"{host.display_name}'s Zoom Meeting"
        )
    else:
        meeting = _scheduled(db, host, item, start)
    started = start + timedelta(minutes=1)
    ended = started + timedelta(minutes=item.duration_minutes)
    instance = MeetingInstance(
        meeting=meeting, uuid=id_generator.instance_uuid(), started_at=started, ended_at=ended
    )
    db.add(instance)
    _participant(instance, host.display_name, "seed-host", started, ended, host_id=host.id)
    for index, name in enumerate(item.attendees, start=1):
        joined = started + timedelta(minutes=index % 3)
        left = ended - timedelta(minutes=index % 2)
        _participant(instance, name, f"seed-{name.lower().replace(' ', '-')}", joined, left)


def _participant(
    instance: MeetingInstance,
    name: str,
    client_id: str,
    joined: datetime,
    left: datetime,
    host_id: int | None = None,
) -> None:
    instance.participants.append(
        Participant(
            user_id=host_id,
            client_id=client_id,
            display_name=name,
            role=ParticipantRole.HOST if host_id else ParticipantRole.ATTENDEE,
            status=ParticipantStatus.LEFT,
            joined_at=joined,
            left_at=left,
        )
    )


def main(argv: list[str] | None = None) -> None:
    parser = argparse.ArgumentParser(description="Seed the Zoom clone database.")
    parser.add_argument("--reset", action="store_true", help="drop all tables, then seed")
    args = parser.parse_args(argv)
    settings = get_settings()
    engine = build_engine(settings.database_url)
    mode: SeedMode = "reset" if args.reset else "if-empty"
    prepare_database(engine, build_session_factory(engine), settings, mode)
    print(f"Database ready ({mode}): {settings.database_url}")


if __name__ == "__main__":
    main()
