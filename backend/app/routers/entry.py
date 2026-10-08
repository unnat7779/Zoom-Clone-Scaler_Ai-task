"""Validate / start / join / end a live meeting (PRD §7.10, §9.1, §10.4).

These handlers are ``async`` so they read the in-memory room registry on the event loop that
owns it (the database work is short, synchronous SQLite).
"""

from typing import Annotated

from fastapi import APIRouter, Query, Response, status

from app.core.clock import utcnow
from app.core.db import DbSession
from app.routers.dependencies import Entry, Hub, Tokens
from app.schemas.common import error_responses
from app.schemas.entry import EndRequest, EntryResponse, JoinRequest, StartRequest, ValidateResponse
from app.services import entry

router = APIRouter(prefix="/api/meetings/{number}", tags=["live meeting"])


@router.get("/validate", response_model=ValidateResponse, summary="Pre-join existence check")
async def validate(
    number: str, db: DbSession, pwd: Annotated[str | None, Query(max_length=64)] = None
) -> ValidateResponse:
    return entry.validate(db, number, pwd)


@router.post(
    "/start",
    response_model=EntryResponse,
    responses=error_responses(403, 404, 409, 422),
    summary="Host path: open an instance if needed and enter (host unless one is present)",
)
async def start(
    number: str,
    body: StartRequest,
    db: DbSession,
    ctx: Entry,
    meeting_id: Annotated[int | None, Query(alias="id")] = None,
) -> EntryResponse:
    return entry.start(db, number, meeting_id, body, ctx, utcnow())


@router.post(
    "/join",
    response_model=EntryResponse,
    responses=error_responses(403, 404, 409, 422),
    summary="Attendee path (invite link, Join modal, pre-join page)",
)
async def join(number: str, body: JoinRequest, db: DbSession, ctx: Entry) -> EntryResponse:
    return entry.join(db, number, body, ctx, utcnow())


@router.post(
    "/end",
    status_code=status.HTTP_204_NO_CONTENT,
    response_class=Response,
    responses=error_responses(401, 403),
    summary="End the meeting for everyone (host only)",
)
async def end(number: str, body: EndRequest, db: DbSession, tokens: Tokens, hub: Hub) -> None:
    instance_id, host_id = entry.end(db, number, body.token, tokens, utcnow())
    await hub.end_meeting(instance_id, ended_by=host_id)
