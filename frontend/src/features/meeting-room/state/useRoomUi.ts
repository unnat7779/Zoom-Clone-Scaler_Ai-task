"use client";

import { useMemo } from "react";
import type { ExtraItem } from "../utils/toolbarOverflow";
import type { HostToolsPage, MenuId, PanelId, RoomDialog, SettingsTab } from "./roomUiReducer";
import { useRoomUiContext } from "./RoomUiProvider";

/** Room UI state plus stable action helpers. */
export function useRoomUi() {
  const { ui, dispatch, view, setView, roomRef } = useRoomUiContext();
  const actions = useMemo(
    () => ({
      togglePanel: (panel: PanelId) => dispatch({ type: "togglePanel", panel }),
      openHostTools: (page: HostToolsPage = "root") => dispatch({ type: "openHostTools", page }),
      closePanel: (panel: PanelId) => dispatch({ type: "closePanel", panel }),
      toggleMinimized: (panel: PanelId) => dispatch({ type: "toggleMinimized", panel }),
      setHostToolsPage: (page: HostToolsPage) => dispatch({ type: "setHostToolsPage", page }),
      toggleMenu: (menu: MenuId) => dispatch({ type: "toggleMenu", menu }),
      closeMenu: () => dispatch({ type: "closeMenu" }),
      setLeaveOpen: (open: boolean) => dispatch({ type: "setLeaveOpen", open }),
      openDialog: (dialog: RoomDialog) => dispatch({ type: "setDialog", dialog }),
      closeDialog: () => dispatch({ type: "setDialog", dialog: null }),
      setInviteOpen: (open: boolean) => dispatch({ type: "setInviteOpen", open }),
      /** opens the static Settings window on a tab (and closes any open menu) */
      openSettings: (tab: SettingsTab = "general") => dispatch({ type: "setSettingsTab", tab }),
      closeSettings: () => dispatch({ type: "setSettingsTab", tab: null }),
      setBreakoutOpen: (open: boolean) => dispatch({ type: "setBreakoutOpen", open }),
      /** shows a More item as a temporary toolbar button (latest wins) */
      promote: (item: ExtraItem) => dispatch({ type: "promote", item }),
      /** More › Reset: back to the default toolbar */
      resetToolbar: () => dispatch({ type: "resetToolbar" }),
      toggleAlwaysShowBars: () => dispatch({ type: "toggleAlwaysShowBars" }),
      toggleHideSelfView: () => dispatch({ type: "toggleHideSelfView" }),
      closePermissionBar: () => dispatch({ type: "closePermissionBar" }),
    }),
    [dispatch],
  );
  return { ...ui, ...actions, view, setView, roomRef };
}
