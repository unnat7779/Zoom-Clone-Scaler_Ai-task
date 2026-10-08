"use client";

import { useRoomContext } from "./roomContext";
import { selectIsHost } from "./roomReducer";

/** Meeting-level state: phase, meeting info, self/host, leave & end. */
export function useMeetingRoom() {
  const { number, inShell, session, connection } = useRoomContext();
  const { state } = connection;
  const { phase, meeting, settings, participants, selfId } = state;
  const self = participants.find((participant) => participant.id === selfId) ?? null;
  const host = participants.find((participant) => participant.role === "host") ?? null;
  return {
    number,
    inShell,
    phase,
    meeting,
    settings,
    self,
    host,
    isHost: selectIsHost(state, session.participant.role),
    participantCount: participants.length,
    leave: connection.leave,
    endForAll: connection.endForAll,
  };
}
