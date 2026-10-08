"""Lifecycle of a meeting WebSocket: admit → welcome → receive loop → departure (PRD §9.1)."""

import asyncio
import json

from sqlalchemy.orm import Session, sessionmaker
from starlette.websockets import WebSocket, WebSocketDisconnect

from app.core.clock import utcnow
from app.core.config import Settings
from app.core.errors import AppError
from app.core.security import ParticipantTokens
from app.models import Participant
from app.realtime import protocol as p
from app.realtime.connection import Connection, TokenBucket
from app.realtime.handlers import MessageHandlers, error_message
from app.realtime.room_manager import RoomManager
from app.realtime.welcome import build_welcome
from app.services import participants
from app.services.participants import HostChange

CLOSE_REPLACED = 4000
CLOSE_UNAUTHORIZED = 4401
CLOSE_REMOVED = 4403
CLOSE_HEARTBEAT_TIMEOUT = 4408
CLOSE_DUPLICATE_SESSION = 4409
DUPLICATE_SESSION_TEXT = "You have joined this meeting on another platform."


class MeetingHub:
    def __init__(
        self,
        rooms: RoomManager,
        session_factory: sessionmaker[Session],
        settings: Settings,
        tokens: ParticipantTokens,
    ) -> None:
        self.rooms = rooms
        self._sessions = session_factory
        self._settings = settings
        self._tokens = tokens
        self._handlers = MessageHandlers(rooms, session_factory)

    async def serve(self, websocket: WebSocket, number: str, token: str) -> None:
        await websocket.accept()
        connection = await self._admit(websocket, number, token)
        if connection is None:
            return
        reason: p.LeaveReason = "disconnected"
        try:
            reason = await self._receive_loop(connection)
        finally:
            # Finish the departure (DB + broadcasts) even if this handler task gets cancelled.
            await asyncio.shield(self.depart(connection, reason))

    async def depart(self, connection: Connection, reason: p.LeaveReason) -> None:
        """Forget a socket and tell the room; no-op if it was already displaced or ended."""
        if not self.rooms.unregister(connection):
            return
        with self._sessions() as db:
            change = self._record_departure(db, connection)
        await self._announce_departure(connection, reason, change)

    async def end_meeting(self, instance_id: int, ended_by: int | None) -> None:
        await self.rooms.close_room(instance_id, p.MeetingEnded(by=ended_by))

    async def _admit(self, websocket: WebSocket, number: str, token: str) -> Connection | None:
        """Authenticate, displace older sockets of the same browser, then send ``welcome``.

        Everything between registering the socket and building ``welcome`` is synchronous, so the
        newcomer always receives ``welcome`` first.
        """
        with self._sessions() as db:
            try:
                participant = participants.authenticate(db, number, self._tokens.verify(token))
            except AppError as exc:
                await self._reject(websocket, exc)
                return None
            if not participant.instance.is_live:
                await websocket.send_json(p.dump(p.MeetingEnded(by=None)))
                await websocket.close()
                return None
            connection = self._connection(websocket, participant)
            displaced = self.rooms.register(connection)
            reconnects = [old for old in displaced if old.participant_id == participant.id]
            duplicates = [
                (old, self._record_departure(db, old))
                for old in displaced
                if old.participant_id != participant.id
            ]
            participants.mark_connected(db, participant)
            welcome = build_welcome(db, participant, self.rooms, self._settings.app_url)
        await connection.send(welcome)
        for old in reconnects:
            await old.close(CLOSE_REPLACED)
        for old, change in duplicates:
            await old.send(p.ErrorOut(code="DUPLICATE_SESSION", message=DUPLICATE_SESSION_TEXT))
            await old.close(CLOSE_DUPLICATE_SESSION)
            await self._announce_departure(old, "left", change)
        joined = p.ParticipantJoined(participant=welcome.self_)
        await self.rooms.broadcast(connection.instance_id, joined, exclude=participant.id)
        return connection

    def _connection(self, websocket: WebSocket, participant: Participant) -> Connection:
        return Connection(
            websocket=websocket,
            instance_id=participant.instance_id,
            participant_id=participant.id,
            client_id=participant.client_id,
            budget=TokenBucket(self._settings.ws_rate_per_second, self._settings.ws_rate_burst),
        )

    async def _reject(self, websocket: WebSocket, exc: AppError) -> None:
        await websocket.send_json(p.dump(error_message(exc)))
        await websocket.close(CLOSE_REMOVED if exc.code == "REMOVED" else CLOSE_UNAUTHORIZED)

    async def _receive_loop(self, connection: Connection) -> p.LeaveReason:
        """Handle messages until the socket closes, the client leaves or the heartbeat lapses."""
        while True:
            try:
                frame = await asyncio.wait_for(
                    connection.websocket.receive(), self._settings.heartbeat_timeout_seconds
                )
            except TimeoutError:
                await connection.close(CLOSE_HEARTBEAT_TIMEOUT)
                return "disconnected"
            except (RuntimeError, WebSocketDisconnect):
                return "disconnected"
            if frame["type"] == "websocket.disconnect":
                return "disconnected"
            message = await self._parse(connection, frame.get("text"))
            if isinstance(message, p.LeaveIn):
                await connection.close()
                return "left"
            if message is not None:
                await self._handlers.handle(connection, message)

    async def _parse(self, connection: Connection, text: str | None) -> p.ClientMessage | None:
        if not connection.budget.allow():
            await connection.send(p.ErrorOut(code="BAD_MESSAGE", message="Too many messages"))
            return None
        try:
            return p.client_message_adapter.validate_python(json.loads(text or ""))
        except ValueError:  # bad JSON or a pydantic ValidationError (a ValueError subclass)
            await connection.send(p.ErrorOut(code="BAD_MESSAGE", message="Malformed message"))
            return None

    def _record_departure(self, db: Session, connection: Connection) -> HostChange | None:
        connected = self.rooms.connected_ids(connection.instance_id)
        return participants.depart(db, connection.participant_id, connected, utcnow())

    async def _announce_departure(
        self, connection: Connection, reason: p.LeaveReason, change: HostChange | None
    ) -> None:
        left = p.ParticipantLeft(participant_id=connection.participant_id, reason=reason)
        await self.rooms.broadcast(connection.instance_id, left)
        if change is not None:
            changed = p.HostChanged(
                host_id=change.host_id, previous_host_id=change.previous_host_id
            )
            await self.rooms.broadcast(connection.instance_id, changed)
