from typing import Annotated

from fastapi import APIRouter, Query

from app.core.db import DbSession
from app.routers.dependencies import AppSettings, CurrentUser
from app.schemas.user import User
from app.services import presenters, users

router = APIRouter(prefix="/api", tags=["users"])


@router.get("/me", response_model=User, summary="The default (logged-in) user")
def me(user: CurrentUser) -> User:
    return presenters.user(user, current_user_id=user.id)


@router.get(
    "/users", response_model=list[User], summary="Other users (invite contacts, invitee search)"
)
def list_users(
    db: DbSession,
    settings: AppSettings,
    q: Annotated[str, Query(max_length=100)] = "",
    limit: Annotated[int, Query(ge=1, le=50)] = 8,
) -> list[User]:
    found = users.contacts(db, settings.default_user_id, q, limit)
    return [presenters.user(user, current_user_id=settings.default_user_id) for user in found]
