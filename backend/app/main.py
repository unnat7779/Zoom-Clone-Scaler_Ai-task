"""FastAPI application factory: routers, CORS, error envelope, startup (tables + seed + janitor)."""

import asyncio
import contextlib
from collections.abc import AsyncIterator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.clock import utcnow
from app.core.config import Settings, get_settings
from app.core.db import build_engine, build_session_factory
from app.core.errors import install_error_handlers
from app.core.security import ParticipantTokens
from app.realtime.hub import MeetingHub
from app.realtime.janitor import run_janitor
from app.realtime.room_manager import RoomManager
from app.routers import entry, health, instances, meetings, users, ws
from app.seed import prepare_database
from app.services import instances as instance_service


def create_app(settings: Settings | None = None) -> FastAPI:
    settings = settings or get_settings()
    engine = build_engine(settings.database_url)
    session_factory = build_session_factory(engine)
    tokens = ParticipantTokens(settings.secret_key, settings.token_max_age_seconds)
    rooms = RoomManager()

    @contextlib.asynccontextmanager
    async def lifespan(_app: FastAPI) -> AsyncIterator[None]:
        prepare_database(engine, session_factory, settings, settings.seed_on_start)
        with session_factory() as db:
            instance_service.end_all_live(db, utcnow())
        janitor = None
        if settings.janitor_interval_seconds > 0:
            janitor = asyncio.create_task(run_janitor(session_factory, rooms, settings))
        yield
        if janitor is not None:
            janitor.cancel()
            with contextlib.suppress(asyncio.CancelledError):
                await janitor
        engine.dispose()

    app = FastAPI(
        title="Zoom Workplace Clone API",
        version="1.0.0",
        description="REST + WebSocket backend for the Zoom Workplace clone (see PRD §9–10).",
        lifespan=lifespan,
    )
    app.state.settings = settings
    app.state.session_factory = session_factory
    app.state.tokens = tokens
    app.state.hub = MeetingHub(rooms, session_factory, settings, tokens)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=list(settings.frontend_origins),
        allow_methods=["*"],
        allow_headers=["*"],
    )
    install_error_handlers(app)
    for module in (health, users, meetings, entry, instances, ws):
        app.include_router(module.router)
    return app


app = create_app()
