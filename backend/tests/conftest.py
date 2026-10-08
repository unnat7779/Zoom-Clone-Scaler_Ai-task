from collections.abc import Iterator
from dataclasses import replace
from pathlib import Path

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.core.config import Settings
from app.main import create_app
from app.models import Meeting, User
from tests.factories import make_host


@pytest.fixture
def settings(tmp_path: Path) -> Settings:
    return replace(
        Settings(),
        database_url=f"sqlite:///{tmp_path / 'test.db'}",
        app_url="http://app.test",
        seed_on_start="off",
        janitor_interval_seconds=0,
        heartbeat_timeout_seconds=5,
    )


@pytest.fixture
def app(settings: Settings) -> FastAPI:
    return create_app(settings)


@pytest.fixture
def client(app: FastAPI) -> Iterator[TestClient]:
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture
def db(app: FastAPI, client: TestClient) -> Iterator[Session]:
    """A session on the test database (tables exist once ``client`` has started the app)."""
    with app.state.session_factory() as session:
        yield session


@pytest.fixture
def host(db: Session) -> User:
    """The default user (id 1) with a PMI meeting."""
    return make_host(db)


@pytest.fixture
def pmi(db: Session, host: User) -> Meeting:
    return host.meetings[0]
