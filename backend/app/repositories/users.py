from sqlalchemy import exists, func, or_, select
from sqlalchemy.orm import Session

from app.models import User


def get(db: Session, user_id: int) -> User | None:
    return db.get(User, user_id)


def list_contacts(db: Session, exclude_id: int, query: str, limit: int) -> list[User]:
    """Users other than ``exclude_id`` whose name or email contains ``query`` (case-insensitive)."""
    statement = select(User).where(User.id != exclude_id)
    if query:
        pattern = f"%{query.lower()}%"
        statement = statement.where(
            or_(func.lower(User.display_name).like(pattern), func.lower(User.email).like(pattern))
        )
    return list(db.scalars(statement.order_by(User.display_name).limit(limit)))


def pmi_taken(db: Session, pmi: str) -> bool:
    return bool(db.scalar(select(exists().where(User.pmi == pmi))))


def any_user(db: Session) -> bool:
    return bool(db.scalar(select(exists().where(User.id.is_not(None)))))
