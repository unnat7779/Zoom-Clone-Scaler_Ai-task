from collections.abc import Iterable

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Participant, ParticipantRole, ParticipantStatus


def get(db: Session, participant_id: int) -> Participant | None:
    return db.get(Participant, participant_id)


def list_for_instance(db: Session, instance_id: int) -> list[Participant]:
    statement = select(Participant).where(Participant.instance_id == instance_id)
    return list(db.scalars(statement.order_by(Participant.joined_at, Participant.id)))


def list_in_meeting(db: Session, instance_id: int) -> list[Participant]:
    statement = select(Participant).where(
        Participant.instance_id == instance_id,
        Participant.status == ParticipantStatus.IN_MEETING,
    )
    return list(db.scalars(statement.order_by(Participant.joined_at, Participant.id)))


def list_for_client(db: Session, instance_id: int, client_id: str) -> list[Participant]:
    statement = select(Participant).where(
        Participant.instance_id == instance_id, Participant.client_id == client_id
    )
    return list(db.scalars(statement))


def instance_ids_with_host(db: Session, instance_ids: Iterable[int]) -> set[int]:
    statement = select(Participant.instance_id).where(
        Participant.instance_id.in_(list(instance_ids)),
        Participant.role == ParticipantRole.HOST,
        Participant.status == ParticipantStatus.IN_MEETING,
    )
    return set(db.scalars(statement.distinct()))
