"use client";

import { RoomHosttoolsIcon } from "@/shared/icons/generated/RoomHosttoolsIcon";
import { useRoomUi } from "../../state/useRoomUi";
import { ToolbarButton } from "./ToolbarButton";

/** Host only: toggles the (static) Host tools panel (PRD §8.9). */
export function HostToolsButton() {
  const { togglePanel } = useRoomUi();
  return <ToolbarButton label="Host tools" ariaLabel="Host tools" icon={<RoomHosttoolsIcon size={24} />} onClick={() => togglePanel("hostTools")} />;
}
