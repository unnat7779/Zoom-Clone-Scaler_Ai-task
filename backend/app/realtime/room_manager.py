"""In-process registry of open meeting sockets: ``instance_id → {participant_id: Connection}``.

Single backend instance only (documented limitation, PRD §4). All methods run on the event loop.
"""

from app.realtime.connection import Connection
from app.realtime.protocol import ServerMessage


class RoomManager:
    def __init__(self) -> None:
        self._rooms: dict[int, dict[int, Connection]] = {}

    def connected_ids(self, instance_id: int) -> set[int]:
        return set(self._rooms.get(instance_id, {}))

    def get(self, instance_id: int, participant_id: int) -> Connection | None:
        return self._rooms.get(instance_id, {}).get(participant_id)

    def register(self, connection: Connection) -> list[Connection]:
        """Add ``connection``; return (and unregister) the sockets it displaces.

        A socket is displaced when it belongs to the same participant (a reconnect) or to the
        same browser (``client_id``) under another participant row (a second tab).
        """
        room = self._rooms.setdefault(connection.instance_id, {})
        displaced = [
            existing
            for existing in room.values()
            if existing.participant_id == connection.participant_id
            or existing.client_id == connection.client_id
        ]
        for existing in displaced:
            del room[existing.participant_id]
        room[connection.participant_id] = connection
        return displaced

    def unregister(self, connection: Connection) -> bool:
        """Remove ``connection`` if it is still the registered socket of its participant."""
        room = self._rooms.get(connection.instance_id)
        if room is None or room.get(connection.participant_id) is not connection:
            return False
        del room[connection.participant_id]
        if not room:
            del self._rooms[connection.instance_id]
        return True

    async def send_to(self, instance_id: int, participant_id: int, message: ServerMessage) -> bool:
        connection = self.get(instance_id, participant_id)
        return connection is not None and await connection.send(message)

    async def broadcast(
        self, instance_id: int, message: ServerMessage, exclude: int | None = None
    ) -> None:
        for participant_id, connection in list(self._rooms.get(instance_id, {}).items()):
            if participant_id != exclude:
                await connection.send(message)

    async def close_room(self, instance_id: int, message: ServerMessage) -> None:
        """Send a final message to everyone in the room, then close and forget all its sockets."""
        connections = list(self._rooms.pop(instance_id, {}).values())
        for connection in connections:
            await connection.send(message)
            await connection.close()
