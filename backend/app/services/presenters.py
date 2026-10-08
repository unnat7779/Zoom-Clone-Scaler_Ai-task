"""ORM → response-schema conversion. The only place that knows both shapes."""

import math
from datetime import datetime

from app import models
from app.schemas import instance as instance_schemas
from app.schemas import meeting as meeting_schemas
from app.schemas import participant as participant_schemas
from app.schemas import user as user_schemas
from app.services.formatting import (
    avatar_color,
    format_meeting_number,
    format_meeting_time,
    initials,
)
from app.services.invitation import invite_url


def user(entity: models.User, current_user_id: int) -> user_schemas.User:
    return user_schemas.User(
        id=entity.id,
        display_name=entity.display_name,
        email=entity.email,
        pmi=entity.pmi,
        pmi_formatted=format_meeting_number(entity.pmi),
        timezone=entity.timezone,
        avatar_color=avatar_color(entity.id, entity.id == current_user_id),
        initials=initials(entity.display_name),
    )


def meeting(entity: models.Meeting, app_url: str, is_live: bool) -> meeting_schemas.Meeting:
    time_label = None
    if entity.type == models.MeetingType.SCHEDULED and entity.start_time is not None:
        time_label = format_meeting_time(entity.start_time, entity.timezone)
    return meeting_schemas.Meeting(
        id=entity.id,
        meeting_number=entity.meeting_number,
        type=models.MeetingType(entity.type),
        uses_pmi=entity.uses_pmi,
        topic=entity.topic,
        description=entity.description,
        start_time=entity.start_time,
        duration_minutes=entity.duration_minutes,
        timezone=entity.timezone,
        time_label=time_label,
        passcode=entity.passcode,
        invite_url=invite_url(app_url, entity),
        waiting_room=entity.waiting_room_enabled,
        join_before_host=entity.join_before_host,
        mute_upon_entry=entity.mute_upon_entry,
        host_video_on=entity.host_video_on,
        participant_video_on=entity.participant_video_on,
        is_recurring=entity.is_recurring,
        host_id=entity.host_id,
        host_name=entity.host.display_name,
        is_live=is_live,
        invitees=[invitee.email for invitee in entity.invitees],
        created_at=entity.created_at,
        updated_at=entity.updated_at,
    )


def meeting_list_item(
    entity: models.Meeting,
    start_time: datetime,
    *,
    is_live: bool,
    has_instance: bool,
    has_host: bool,
) -> meeting_schemas.MeetingListItem:
    return meeting_schemas.MeetingListItem(
        id=entity.id,
        meeting_number=entity.meeting_number,
        type=models.MeetingType(entity.type),
        uses_pmi=entity.uses_pmi,
        topic=entity.topic,
        start_time=start_time,
        duration_minutes=entity.duration_minutes,
        timezone=entity.timezone,
        host_name=entity.host.display_name,
        is_live=is_live,
        has_instance=has_instance,
        has_host=has_host,
    )


def elapsed_minutes(started_at: datetime, ended_at: datetime) -> int:
    return max(1, math.ceil((ended_at - started_at).total_seconds() / 60))


def instance_item(
    entity: models.MeetingInstance, participant_count: int
) -> instance_schemas.InstanceListItem:
    definition = entity.meeting
    if entity.ended_at is None:
        raise ValueError("Only ended instances can be listed")
    return instance_schemas.InstanceListItem(
        uuid=entity.uuid,
        meeting_id=definition.id,
        meeting_number=definition.meeting_number,
        type=models.MeetingType(definition.type),
        uses_pmi=definition.uses_pmi,
        topic=definition.topic,
        host_name=definition.host.display_name,
        started_at=entity.started_at,
        ended_at=entity.ended_at,
        duration_minutes=elapsed_minutes(entity.started_at, entity.ended_at),
        participant_count=participant_count,
        meeting_exists=definition.deleted_at is None,
    )


def participant(entity: models.Participant) -> participant_schemas.Participant:
    return participant_schemas.Participant(
        id=entity.id,
        display_name=entity.display_name,
        role=models.ParticipantRole(entity.role),
        is_guest=entity.is_guest,
        audio_muted=entity.audio_muted,
        video_on=entity.video_on,
        joined_at=entity.joined_at,
    )


def participant_record(entity: models.Participant) -> participant_schemas.ParticipantRecord:
    return participant_schemas.ParticipantRecord(
        id=entity.id,
        display_name=entity.display_name,
        role=models.ParticipantRole(entity.role),
        is_guest=entity.is_guest,
        status=models.ParticipantStatus(entity.status),
        joined_at=entity.joined_at,
        left_at=entity.left_at,
    )
