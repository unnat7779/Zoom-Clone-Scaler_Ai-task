"""Periodic cleanup of live instances whose browsers are gone (PRD §9.1 step 6).

* An ``in_meeting`` participant without a socket for longer than the connect grace (it never
  connected, or the process lost track of it) is marked ``left``.
* A live instance nobody is connected to is ended once the empty-room grace has passed.
"""

import asyncio
import logging
from datetime import timedelta

from sqlalchemy.orm import Session, sessionmaker

from app.core.clock import utcnow
from app.core.config import Settings
from app.realtime.room_manager import RoomManager
from app.repositories import instances as instances_repo
from app.services import instances

logger = logging.getLogger(__name__)


def sweep(db: Session, rooms: RoomManager, settings: Settings) -> int:
    """Run one cleanup pass; returns the number of instances that were ended."""
    now = utcnow()
    connect_grace = timedelta(seconds=settings.connect_grace_seconds)
    empty_grace = timedelta(seconds=settings.empty_room_grace_seconds)
    ended = 0
    for instance in instances_repo.list_live(db):
        connected = rooms.connected_ids(instance.id)
        instances.reap_stale_participants(db, instance, connected, now, connect_grace)
        ended += instances.close_if_abandoned(db, instance, connected, now, empty_grace)
    db.commit()
    return ended


async def run_janitor(
    session_factory: sessionmaker[Session], rooms: RoomManager, settings: Settings
) -> None:
    while True:
        await asyncio.sleep(settings.janitor_interval_seconds)
        try:
            with session_factory() as db:
                sweep(db, rooms, settings)
        except Exception:
            logger.exception("Janitor pass failed")
