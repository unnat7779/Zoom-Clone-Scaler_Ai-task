"""One open meeting WebSocket and its per-socket message budget."""

import asyncio
import time
from dataclasses import dataclass, field

from starlette.websockets import WebSocket, WebSocketDisconnect, WebSocketState

from app.realtime.protocol import ServerMessage, dump


class TokenBucket:
    """Allows ``rate`` messages per second on average with bursts of up to ``burst``."""

    def __init__(self, rate: float, burst: int) -> None:
        self._rate = rate
        self._capacity = float(burst)
        self._tokens = float(burst)
        self._updated = time.monotonic()

    def allow(self) -> bool:
        now = time.monotonic()
        self._tokens = min(self._capacity, self._tokens + (now - self._updated) * self._rate)
        self._updated = now
        if self._tokens < 1:
            return False
        self._tokens -= 1
        return True


@dataclass(eq=False)
class Connection:
    websocket: WebSocket
    instance_id: int
    participant_id: int
    client_id: str
    budget: TokenBucket
    _send_lock: asyncio.Lock = field(default_factory=asyncio.Lock)

    async def send(self, message: ServerMessage) -> bool:
        """Send without raising; returns ``False`` if the socket is already gone."""
        if self.websocket.application_state != WebSocketState.CONNECTED:
            return False
        try:
            async with self._send_lock:
                await self.websocket.send_json(dump(message))
        except (RuntimeError, OSError, WebSocketDisconnect):
            return False
        return True

    async def close(self, code: int = 1000) -> None:
        if self.websocket.application_state == WebSocketState.CONNECTED:
            try:
                await self.websocket.close(code)
            except (RuntimeError, OSError, WebSocketDisconnect):
                return
