"""The no-auth identity model: the seeded default user is always "logged in" (PRD §3)."""

from sqlalchemy.orm import Session

from app.models import User
from app.repositories import users as users_repo
from app.services import errors


def current_user(db: Session, default_user_id: int) -> User:
    user = users_repo.get(db, default_user_id)
    if user is None:
        raise errors.user_not_found()
    return user


def contacts(db: Session, default_user_id: int, query: str, limit: int) -> list[User]:
    return users_repo.list_contacts(db, default_user_id, query.strip(), limit)
