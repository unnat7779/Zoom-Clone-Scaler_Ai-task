from typing import Annotated

from fastapi import APIRouter, Query, WebSocket

from app.routers.dependencies import Hub

router = APIRouter(tags=["realtime"])


@router.websocket("/ws/meetings/{number}")
async def meeting_socket(
    websocket: WebSocket, number: str, hub: Hub, token: Annotated[str, Query()] = ""
) -> None:
    """Signalling, roster and host commands for one live meeting (protocol: ``app.realtime``)."""
    await hub.serve(websocket, number, token)
