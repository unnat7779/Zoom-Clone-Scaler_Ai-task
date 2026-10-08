"use client";

import { useState } from "react";
import { useRoomUi } from "../state/useRoomUi";
import { usePanelLayout } from "./usePanelLayout";
import { useRoomBars } from "./useRoomBars";

/**
 * Header/toolbar visibility for the stage: auto-hide, pinned while a menu, the leave bar, a dialog
 * or a room window (Invite, Settings, Breakout Rooms — the bars stay up in room-16 / room-20) is open.
 * `panelOpen`: a side-column panel narrows the stage (a pop-out window or a phone sheet does not).
 */
export function useStageChrome() {
  const { menu, leaveOpen, dialog, inviteOpen, settingsTab, breakoutOpen, alwaysShowBars, toggleAlwaysShowBars, panels } = useRoomUi();
  const [toolbarHovered, setToolbarHovered] = useState(false);
  const sidePanel = usePanelLayout() === "side" && panels.length > 0;
  const windowOpen = inviteOpen || settingsTab !== null || breakoutOpen;
  const pinned = menu !== null || leaveOpen || dialog !== null || windowOpen || toolbarHovered || alwaysShowBars;
  const { visible, onPointerMove, onPointerUp } = useRoomBars({ pinned, onToggleAlwaysShow: toggleAlwaysShowBars });
  return { barsVisible: visible, onPointerMove, onPointerUp, setToolbarHovered, leaveOpen, panelOpen: sidePanel };
}
