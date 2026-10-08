"""Shared FastAPI dependencies. Long-lived objects live on ``app.state`` (built in ``main``)."""

from typing import Annotated

from fastapi import Depends
from starlette.requests import HTTPConnection

from app.core.config import Settings
from app.core.db import DbSession
from app.core.security import ParticipantTokens
from app.models import User
from app.realtime.hub import MeetingHub
from app.services import users
from app.services.entry import EntryContext


def _settings(connection: HTTPConnection) -> Settings:
    return connection.app.state.settings


def _hub(connection: HTTPConnection) -> MeetingHub:
    return connection.app.state.hub


def _tokens(connection: HTTPConnection) -> ParticipantTokens:
    return connection.app.state.tokens


AppSettings = Annotated[Settings, Depends(_settings)]
Hub = Annotated[MeetingHub, Depends(_hub)]
Tokens = Annotated[ParticipantTokens, Depends(_tokens)]


def _current_user(db: DbSession, settings: AppSettings) -> User:
    return users.current_user(db, settings.default_user_id)


def _entry_context(settings: AppSettings, hub: Hub, tokens: Tokens) -> EntryContext:
    return EntryContext(settings=settings, tokens=tokens, connected_ids=hub.rooms.connected_ids)


CurrentUser = Annotated[User, Depends(_current_user)]
Entry = Annotated[EntryContext, Depends(_entry_context)]
