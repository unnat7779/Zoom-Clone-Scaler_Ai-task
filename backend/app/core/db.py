"""Engine and session factory. Every SQLite connection runs with ``PRAGMA foreign_keys = ON``."""

from collections.abc import Iterator
from pathlib import Path
from typing import Annotated

from fastapi import Depends
from sqlalchemy import Engine, create_engine, event
from sqlalchemy.engine import make_url
from sqlalchemy.orm import Session, sessionmaker
from starlette.requests import HTTPConnection


def build_engine(database_url: str) -> Engine:
    url = make_url(database_url)
    if url.get_backend_name() == "sqlite" and url.database not in (None, "", ":memory:"):
        Path(url.database).parent.mkdir(parents=True, exist_ok=True)
    engine = create_engine(database_url, connect_args={"check_same_thread": False})

    @event.listens_for(engine, "connect")
    def _enable_foreign_keys(dbapi_connection, _record) -> None:
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys = ON")
        cursor.close()

    return engine


def build_session_factory(engine: Engine) -> sessionmaker[Session]:
    return sessionmaker(bind=engine, expire_on_commit=False)


def get_db(connection: HTTPConnection) -> Iterator[Session]:
    """FastAPI dependency: one session per request, factory stored on ``app.state``."""
    session_factory: sessionmaker[Session] = connection.app.state.session_factory
    with session_factory() as session:
        yield session


DbSession = Annotated[Session, Depends(get_db)]
