"""Read models for Home and the Meetings tab (PRD §10.1 "Derived", §7.1.8, §7.4.2)."""

from datetime import date, datetime

from sqlalchemy.orm import Session

from app.models import Meeting, MeetingInstance, MeetingType, User
from app.repositories import instances as instances_repo
from app.repositories import meetings as meetings_repo
from app.repositories import participants as participants_repo
from app.schemas.instance import InstanceDetail, InstanceListItem
from app.schemas.meeting import MeetingListItem
from app.services import errors, presenters
from app.services.timezones import local_day_bounds, local_today

_LiveRow = tuple[Meeting, MeetingInstance]


def upcoming(db: Session, host: User, start_from: datetime) -> list[MeetingListItem]:
    """Scheduled meetings starting at/after ``start_from`` (or live) + live instant meetings."""
    scheduled = meetings_repo.list_scheduled(db, host.id, start_from)
    live_scheduled = meetings_repo.list_live(db, host.id, (MeetingType.SCHEDULED,))
    live_instant = meetings_repo.list_live(db, host.id, (MeetingType.INSTANT,))
    known = {meeting.id for meeting in scheduled}
    scheduled += [meeting for meeting, _ in live_scheduled if meeting.id not in known]
    return _list_items(db, scheduled, live_instant)


def day(
    db: Session, host: User, day_value: date, timezone: str, now: datetime
) -> list[MeetingListItem]:
    """Scheduled meetings starting on ``day_value`` in ``timezone`` (+ live instant/PMI today)."""
    start, end = local_day_bounds(day_value, timezone)
    scheduled = meetings_repo.list_scheduled(db, host.id, start, end)
    live: list[_LiveRow] = []
    if day_value == local_today(now, timezone):
        live = meetings_repo.list_live(db, host.id, (MeetingType.INSTANT, MeetingType.PMI))
    return _list_items(db, scheduled, live)


def previous(db: Session, host: User, limit: int) -> list[InstanceListItem]:
    rows = instances_repo.list_ended(db, host.id, limit)
    return [presenters.instance_item(instance, count) for instance, count in rows]


def instance_detail(db: Session, uuid: str, app_url: str) -> InstanceDetail:
    instance = instances_repo.get_by_uuid(db, uuid)
    if instance is None or instance.ended_at is None:
        raise errors.instance_not_found()
    definition = instance.meeting
    meeting = None
    if definition.deleted_at is None:
        is_live = definition.id in instances_repo.live_by_meeting(db, [definition.id])
        meeting = presenters.meeting(definition, app_url, is_live)
    count = instances_repo.distinct_participant_count(db, instance.id)
    participants = participants_repo.list_for_instance(db, instance.id)
    return InstanceDetail(
        instance=presenters.instance_item(instance, count),
        meeting=meeting,
        participants=[presenters.participant_record(p) for p in participants],
    )


def _list_items(
    db: Session, scheduled: list[Meeting], live_unscheduled: list[_LiveRow]
) -> list[MeetingListItem]:
    meeting_ids = [m.id for m in scheduled] + [m.id for m, _ in live_unscheduled]
    live = instances_repo.live_by_meeting(db, meeting_ids)
    ever_started = instances_repo.meeting_ids_with_instances(db, meeting_ids)
    hosted = participants_repo.instance_ids_with_host(db, [i.id for i in live.values()])

    def item(meeting: Meeting, start_time: datetime) -> MeetingListItem:
        instance = live.get(meeting.id)
        return presenters.meeting_list_item(
            meeting,
            start_time,
            is_live=instance is not None,
            has_instance=meeting.id in ever_started,
            has_host=instance is not None and instance.id in hosted,
        )

    items = [item(m, m.start_time) for m in scheduled if m.start_time is not None]
    items += [item(m, instance.started_at) for m, instance in live_unscheduled]
    return sorted(items, key=lambda entry: (entry.start_time, entry.id))
