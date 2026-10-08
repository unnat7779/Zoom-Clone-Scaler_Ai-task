"use client";

import { useCallback } from "react";
import type { MoreTileAction } from "../components/toolbar/moreMenuItems";
import { useRoomUi } from "../state/useRoomUi";

/** Runs what a More tile or a promoted toolbar button does. */
export function useMoreAction() {
  const { togglePanel, toggleMenu, openSettings, openDialog, setBreakoutOpen } = useRoomUi();
  return useCallback(
    (action: MoreTileAction) => {
      if (action.type === "panel") togglePanel(action.panel);
      else if (action.type === "menu") toggleMenu(action.menu);
      else if (action.type === "settings") openSettings(action.tab);
      else if (action.type === "captions") openDialog({ type: "captions" });
      else if (action.type === "breakout") setBreakoutOpen(true);
    },
    [togglePanel, toggleMenu, openSettings, openDialog, setBreakoutOpen],
  );
}
