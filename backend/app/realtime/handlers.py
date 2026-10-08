"""Handlers for client messages: WebRTC signalling relay, media state, heartbeat, host commands."""

from typing import get_args

from sqlalchemy.orm import Session, sessionmaker

from app.core.clock import utcnow
from app.core.errors import AppError
from app.models import Participant
from app.realtime import protocol as p
from app.realtime.connection import Connection
from app.realtime.room_manager import RoomManager
from app.repositories import participants as participants_repo
from app.services import errors, participants, presenters

CLOSE_REMOVED = 4403
_WS_ERROR_CODES = set(get_args(p.ErrorCode))


def error_message(exc: AppError) -> p.ErrorOut:
    code = exc.code if exc.code in _WS_ERROR_CODES else "BAD_MESSAGE"
    return p.ErrorOut(code=code, message=exc.message)  # type: ignore[arg-type]  # narrowed above


class MessageHandlers:
    def __init__(self, rooms: RoomManager, session_factory: sessionmaker[Session]) -> None:
        self._rooms = rooms
        self._sessions = session_factory

    async def handle(self, connection: Connection, message: p.ClientMessage) -> None:
        try:
            await self._dispatch(connection, message)
        except AppError as exc:
            await connection.send(error_message(exc))

    async def _dispatch(self, connection: Connection, message: p.ClientMessage) -> None:
        match message:
            case p.PingIn():
                await connection.send(p.Pong())
            case p.OfferIn() | p.AnswerIn():
                relay = p.SdpRelay(
                    type=message.type,
                    from_=connection.participant_id,
                    to=message.to,
                    sdp=message.sdp,
                )
                await self._relay(connection, message.to, relay)
            case p.IceIn():
                relay_ice = p.IceRelay(
                    from_=connection.participant_id, to=message.to, candidate=message.candidate
                )
                await self._relay(connection, message.to, relay_ice)
            case p.MediaStateIn():
                await self._media_state(connection, message)
            case p.MuteAllCommand():
                await self._mute_all(connection, message.allow_unmute)
            case p.MuteCommand():
                await self._mute(connection, message.target)
            case p.RemoveCommand():
                await self._remove(connection, message.target)

    async def _relay(self, connection: Connection, to: int, message: p.ServerMessage) -> None:
        """Forward signalling to one peer of the same room (silently dropped if it just left)."""
        if to != connection.participant_id:
            await self._rooms.send_to(connection.instance_id, to, message)

    async def _media_state(self, connection: Connection, message: p.MediaStateIn) -> None:
        with self._sessions() as db:
            sender = self._sender(db, connection)
            allowed = participants.set_media_state(
                db, sender, message.audio_muted, message.video_on
            )
            updated = p.ParticipantUpdated(participant=presenters.participant(sender))
        await self._rooms.broadcast(connection.instance_id, updated)
        if not allowed:
            raise errors.unmute_not_allowed()

    async def _mute_all(self, connection: Connection, allow_unmute: bool) -> None:
        with self._sessions() as db:
            host = self._sender(db, connection)
            muted = participants.mute_all(db, host, allow_unmute)
            updates = [p.ParticipantUpdated(participant=presenters.participant(m)) for m in muted]
            settings = p.SettingsUpdated(allow_unmute=allow_unmute, mute_on_entry=True)
        for participant_update in updates:
            target = participant_update.participant.id
            await self._rooms.send_to(connection.instance_id, target, p.ForceMute(by=host.id))
            await self._rooms.broadcast(connection.instance_id, participant_update)
        await self._rooms.broadcast(connection.instance_id, settings)

    async def _mute(self, connection: Connection, target_id: int) -> None:
        with self._sessions() as db:
            host = self._sender(db, connection)
            target = participants.mute(db, host, target_id)
            updated = p.ParticipantUpdated(participant=presenters.participant(target))
        await self._rooms.send_to(connection.instance_id, target_id, p.ForceMute(by=host.id))
        await self._rooms.broadcast(connection.instance_id, updated)

    async def _remove(self, connection: Connection, target_id: int) -> None:
        with self._sessions() as db:
            host = self._sender(db, connection)
            participants.remove(db, host, target_id, utcnow())
        target_connection = self._rooms.get(connection.instance_id, target_id)
        if target_connection is not None and self._rooms.unregister(target_connection):
            await target_connection.send(p.Removed(by=host.id))
            await target_connection.close(CLOSE_REMOVED)
        left = p.ParticipantLeft(participant_id=target_id, reason="removed")
        await self._rooms.broadcast(connection.instance_id, left)

    @staticmethod
    def _sender(db: Session, connection: Connection) -> Participant:
        sender = participants_repo.get(db, connection.participant_id)
        if sender is None:
            raise errors.unauthorized()
        return sender
