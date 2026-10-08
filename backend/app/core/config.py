"""Application settings, read once from environment variables (PRD §13)."""

import os
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path
from typing import Literal

BACKEND_DIR = Path(__file__).resolve().parents[2]
DEFAULT_DATABASE_URL = f"sqlite:///{BACKEND_DIR / 'data' / 'zoom.db'}"
DEFAULT_FRONTEND_ORIGINS = (
    "http://localhost:3000",
    "http://localhost:3100",
    "http://localhost:3101",
    "http://localhost:3102",
    "http://localhost:3103",
)

SeedMode = Literal["if-empty", "reset", "off"]


@dataclass(frozen=True)
class Settings:
    database_url: str = DEFAULT_DATABASE_URL
    frontend_origins: tuple[str, ...] = DEFAULT_FRONTEND_ORIGINS
    app_url: str = "http://localhost:3000"
    secret_key: str = "dev-only-secret-change-me"
    seed_on_start: SeedMode = "if-empty"
    seed_user_name: str = "Unnat Agrawal"
    seed_user_email: str = "agrawanunnat.ieee@gmail.com"
    default_user_id: int = 1
    max_participants: int = 8
    token_max_age_seconds: int = 12 * 60 * 60
    heartbeat_timeout_seconds: float = 45
    connect_grace_seconds: float = 60
    empty_room_grace_seconds: float = 30
    janitor_interval_seconds: float = 15
    ws_rate_per_second: float = 20
    ws_rate_burst: int = 100


def _origins(raw: str | None) -> tuple[str, ...]:
    if not raw:
        return DEFAULT_FRONTEND_ORIGINS
    return tuple(origin.strip().rstrip("/") for origin in raw.split(",") if origin.strip())


def _seed_mode(raw: str | None) -> SeedMode:
    mode = (raw or "if-empty").strip().lower()
    if mode not in ("if-empty", "reset", "off"):
        raise ValueError(f"SEED_ON_START must be if-empty, reset or off (got {raw!r})")
    return mode  # type: ignore[return-value]  # narrowed by the membership check above


def load_settings() -> Settings:
    env = os.environ
    defaults = Settings()
    return Settings(
        database_url=env.get("DATABASE_URL", defaults.database_url),
        frontend_origins=_origins(env.get("FRONTEND_ORIGIN")),
        app_url=env.get("APP_URL", defaults.app_url).rstrip("/"),
        secret_key=env.get("SECRET_KEY", defaults.secret_key),
        seed_on_start=_seed_mode(env.get("SEED_ON_START")),
        seed_user_name=env.get("SEED_USER_NAME", defaults.seed_user_name),
        seed_user_email=env.get("SEED_USER_EMAIL", defaults.seed_user_email),
    )


@lru_cache
def get_settings() -> Settings:
    return load_settings()
