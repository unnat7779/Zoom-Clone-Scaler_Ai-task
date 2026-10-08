"use client";

import { useCallback } from "react";
import { useRoomContext } from "./roomContext";
import { selectIsHost } from "./roomReducer";

/** Host commands (PRD §8.15); the server re-checks that the sender is the host. */
export function useHostControls() {
  const { connection, session } = useRoomContext();
  const { sendHostCommand } = connection;
  const isHost = selectIsHost(connection.state, session.participant.role);

  const muteAll = useCallback(
    (allowUnmute: boolean) => sendHostCommand({ command: "mute_all", allow_unmute: allowUnmute }),
    [sendHostCommand],
  );
  const mute = useCallback((target: number) => sendHostCommand({ command: "mute", target }), [sendHostCommand]);
  const remove = useCallback((target: number) => sendHostCommand({ command: "remove", target }), [sendHostCommand]);

  return { isHost, muteAll, mute, remove };
}
