"use client";

import { MtgEndIcon } from "@/shared/icons/generated/MtgEndIcon";
import { MtgLeaveIcon } from "@/shared/icons/generated/MtgLeaveIcon";
import { useMeetingRoom } from "../../realtime/useMeetingRoom";
import { useRoomUi } from "../../state/useRoomUi";
import { ToolbarButton } from "./ToolbarButton";

/** Host: End (red hexagon). Attendee: Leave (red door) (PRD §8.5.3–8.5.4). Opens the End/Leave flow. */
export function EndButton() {
  const { isHost } = useMeetingRoom();
  const { setLeaveOpen } = useRoomUi();
  return isHost ? (
    <ToolbarButton label="End" ariaLabel="End" icon={<MtgEndIcon />} onClick={() => setLeaveOpen(true)} />
  ) : (
    <ToolbarButton label="Leave" ariaLabel="Leave" icon={<MtgLeaveIcon />} onClick={() => setLeaveOpen(true)} />
  );
}
