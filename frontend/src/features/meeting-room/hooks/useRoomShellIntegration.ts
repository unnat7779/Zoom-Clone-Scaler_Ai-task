"use client";

import { useCallback } from "react";
import { useRailNavigationGuard, useShellMeetingPresence } from "@/features/shell";
import { isTerminalPhase } from "../realtime/roomReducer";
import { useMeetingRoom } from "../realtime/useMeetingRoom";
import { useRoomUi } from "../state/useRoomUi";

/**
 * In-shell room (no-op full viewport): the avatar shows "In a meeting", no rail tab is
 * selected, and a rail click first opens the End/Leave options (PRD §6.7, U15 [D]).
 */
export function useRoomShellIntegration(): void {
  const { phase } = useMeetingRoom();
  const { setLeaveOpen } = useRoomUi();
  const inMeeting = !isTerminalPhase(phase);
  useShellMeetingPresence(inMeeting);
  const guard = useCallback(() => {
    setLeaveOpen(true);
    return false;
  }, [setLeaveOpen]);
  useRailNavigationGuard(inMeeting ? guard : null);
}
