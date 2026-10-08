"""Meeting definitions and list views (PRD §10.4). Handlers stay thin: services do the work."""

from datetime import date, datetime
from typing import Annotated, Literal

from fastapi import APIRouter, Query, Response, status

from app.core.clock import utcnow
from app.core.db import DbSession
from app.models import Meeting as MeetingEntity
from app.routers.dependencies import AppSettings, CurrentUser
from app.schemas.common import error_responses
from app.schemas.instance import InstanceListItem
from app.schemas.meeting import InstantMeetingResponse, Invitation, Meeting, MeetingListItem
from app.schemas.schedule import (
    InstantMeetingRequest,
    MeetingUpdateRequest,
    PmiUpdateRequest,
    ScheduleRequest,
)
from app.services import errors, meeting_queries, meetings, presenters
from app.services.invitation import invitation_text, invite_url, start_url
from app.services.timezones import is_valid_timezone, local_day_bounds, local_today

router = APIRouter(prefix="/api/meetings", tags=["meetings"])
MeetingId = Annotated[int | None, Query(alias="id", description="Disambiguates uses_pmi entries")]


def _present(db: DbSession, settings: AppSettings, meeting: MeetingEntity) -> Meeting:
    return presenters.meeting(meeting, settings.app_url, meetings.is_live(db, meeting))


@router.get(
    "",
    response_model=list[MeetingListItem] | list[InstanceListItem],
    responses=error_responses(422),
    summary="Upcoming list, one day (Home widget) or previous instances",
)
def list_meetings(
    db: DbSession,
    user: CurrentUser,
    view: Literal["upcoming", "day", "previous"],
    start_from: Annotated[datetime | None, Query(alias="from")] = None,
    day: Annotated[date | None, Query(alias="date")] = None,
    tz: Annotated[str | None, Query(description="IANA zone; default: the user's")] = None,
    limit: Annotated[int, Query(ge=1, le=200)] = 50,
) -> list[MeetingListItem] | list[InstanceListItem]:
    if view == "previous":
        return meeting_queries.previous(db, user, limit)
    timezone = tz or user.timezone
    if not is_valid_timezone(timezone):
        raise errors.validation(f"Unknown time zone: {timezone}")
    now = utcnow()
    if view == "day":
        if day is None:
            raise errors.validation("date is required when view=day")
        return meeting_queries.day(db, user, day, timezone, now)
    if start_from is None:
        start_from, _ = local_day_bounds(local_today(now, timezone), timezone)
    return meeting_queries.upcoming(db, user, start_from)


@router.get("/pmi", response_model=Meeting, responses=error_responses(404))
def get_pmi(db: DbSession, settings: AppSettings, user: CurrentUser) -> Meeting:
    return _present(db, settings, meetings.get_pmi(db, user))


@router.patch("/pmi", response_model=Meeting, responses=error_responses(404, 409, 422))
def update_pmi(
    body: PmiUpdateRequest, db: DbSession, settings: AppSettings, user: CurrentUser
) -> Meeting:
    return _present(db, settings, meetings.update_pmi(db, user, body))


@router.post(
    "/instant",
    status_code=status.HTTP_201_CREATED,
    response_model=InstantMeetingResponse,
    summary="Create an instant meeting (or use the PMI) with a live instance",
)
def create_instant(
    db: DbSession,
    settings: AppSettings,
    user: CurrentUser,
    body: InstantMeetingRequest | None = None,
) -> InstantMeetingResponse:
    use_pmi = body.use_pmi if body else False
    meeting, _ = meetings.create_instant(db, user, use_pmi, utcnow())
    return InstantMeetingResponse(
        meeting=presenters.meeting(meeting, settings.app_url, is_live=True),
        invite_url=invite_url(settings.app_url, meeting),
        start_url=start_url(settings.app_url, meeting),
    )


@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
    response_model=Meeting,
    responses=error_responses(422),
)
def schedule_meeting(
    body: ScheduleRequest, db: DbSession, settings: AppSettings, user: CurrentUser
) -> Meeting:
    return presenters.meeting(meetings.schedule(db, user, body, utcnow()), settings.app_url, False)


@router.get("/{number}", response_model=Meeting, responses=error_responses(404))
def get_meeting(
    number: str, db: DbSession, settings: AppSettings, meeting_id: MeetingId = None
) -> Meeting:
    return _present(db, settings, meetings.resolve(db, number, meeting_id))


@router.patch("/{number}", response_model=Meeting, responses=error_responses(400, 404, 409, 422))
def update_meeting(
    number: str,
    body: MeetingUpdateRequest,
    db: DbSession,
    settings: AppSettings,
    meeting_id: MeetingId = None,
) -> Meeting:
    meeting = meetings.resolve(db, number, meeting_id)
    return _present(db, settings, meetings.update(db, meeting, body, utcnow()))


@router.delete(
    "/{number}",
    status_code=status.HTTP_204_NO_CONTENT,
    response_class=Response,
    responses=error_responses(400, 404, 409),
    summary="Soft delete (recoverable for 7 days)",
)
def delete_meeting(number: str, db: DbSession, meeting_id: MeetingId = None) -> None:
    meetings.delete(db, meetings.resolve(db, number, meeting_id), utcnow())


@router.get("/{number}/invitation", response_model=Invitation, responses=error_responses(404))
def get_invitation(
    number: str, db: DbSession, settings: AppSettings, meeting_id: MeetingId = None
) -> Invitation:
    meeting = meetings.resolve(db, number, meeting_id)
    return Invitation(text=invitation_text(settings.app_url, meeting))
