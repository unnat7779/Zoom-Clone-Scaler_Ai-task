/** Local UI state of the room: panels, menus, dialogs and the End/Leave bar. */

import type { ExtraItem } from "../utils/toolbarOverflow";

export type PanelId = "participants" | "chat" | "hostTools";

/** Toolbar / header popovers; only one is open at a time. */
export type MenuId =
  | "audio"
  | "video"
  | "participants"
  | "share"
  | "chat"
  | "react"
  | "more"
  | "view"
  | "info"
  | "encryption";

export type HostToolsPage = "root" | "participants" | "advanced" | "share";

/** Tabs of the static in-room Settings window (PRD §8.17). */
export type SettingsTab = "general" | "video" | "audio" | "background" | "statistics" | "about";

export type RoomDialog =
  | { type: "muteAll" }
  | { type: "remove"; participantId: number; name: string }
  /** More › Show Captions: the caption-language dialog (Static UI, PRD §8.12.5) */
  | { type: "captions" }
  | null;

export interface RoomUiState {
  /** open right panels, top to bottom (Participants above Chat when stacked) */
  panels: PanelId[];
  minimized: PanelId | null;
  hostToolsPage: HostToolsPage;
  menu: MenuId | null;
  leaveOpen: boolean;
  dialog: RoomDialog;
  inviteOpen: boolean;
  /** open tab of the in-room Settings window, null = closed */
  settingsTab: SettingsTab | null;
  /** More › Breakout Rooms: the static "Create Breakout Rooms" window (PRD §8.12.6) */
  breakoutOpen: boolean;
  /** the More item last picked, shown as a temporary toolbar button (spec 05 §5.3); Reset clears it */
  promoted: ExtraItem | null;
  /** Ctrl+\ "always show meeting controls" */
  alwaysShowBars: boolean;
  hideSelfView: boolean;
  permissionBarClosed: boolean;
}

export type RoomUiAction =
  | { type: "togglePanel"; panel: PanelId }
  | { type: "openHostTools"; page: HostToolsPage }
  | { type: "closePanel"; panel: PanelId }
  | { type: "toggleMinimized"; panel: PanelId }
  | { type: "setHostToolsPage"; page: HostToolsPage }
  | { type: "toggleMenu"; menu: MenuId }
  | { type: "closeMenu" }
  | { type: "setLeaveOpen"; open: boolean }
  | { type: "setDialog"; dialog: RoomDialog }
  | { type: "setInviteOpen"; open: boolean }
  | { type: "setSettingsTab"; tab: SettingsTab | null }
  | { type: "setBreakoutOpen"; open: boolean }
  | { type: "promote"; item: ExtraItem }
  | { type: "resetToolbar" }
  | { type: "toggleAlwaysShowBars" }
  | { type: "toggleHideSelfView" }
  | { type: "closePermissionBar" };

export const initialRoomUiState: RoomUiState = {
  panels: [],
  minimized: null,
  hostToolsPage: "root",
  menu: null,
  leaveOpen: false,
  dialog: null,
  inviteOpen: false,
  settingsTab: null,
  breakoutOpen: false,
  promoted: null,
  alwaysShowBars: false,
  hideSelfView: false,
  permissionBarClosed: false,
};

const STACK_ORDER: PanelId[] = ["participants", "chat"];

function openPanel(panels: PanelId[], panel: PanelId): PanelId[] {
  if (panel === "hostTools") return ["hostTools"];
  return STACK_ORDER.filter((id) => id === panel || panels.includes(id));
}

export function roomUiReducer(state: RoomUiState, action: RoomUiAction): RoomUiState {
  switch (action.type) {
    case "togglePanel": {
      const open = state.panels.includes(action.panel);
      const panels = open ? state.panels.filter((id) => id !== action.panel) : openPanel(state.panels, action.panel);
      return { ...state, panels, minimized: null, menu: null, hostToolsPage: "root" };
    }
    case "openHostTools":
      return { ...state, panels: ["hostTools"], minimized: null, menu: null, hostToolsPage: action.page };
    case "closePanel":
      return { ...state, panels: state.panels.filter((id) => id !== action.panel), minimized: null };
    case "toggleMinimized":
      return { ...state, minimized: state.minimized === action.panel ? null : action.panel };
    case "setHostToolsPage":
      return { ...state, hostToolsPage: action.page };
    case "toggleMenu":
      return { ...state, menu: state.menu === action.menu ? null : action.menu };
    case "closeMenu":
      return state.menu === null ? state : { ...state, menu: null };
    case "setLeaveOpen":
      return { ...state, leaveOpen: action.open, menu: null };
    case "setDialog":
      return { ...state, dialog: action.dialog, menu: null };
    case "setInviteOpen":
      return { ...state, inviteOpen: action.open, menu: null };
    case "setSettingsTab":
      return { ...state, settingsTab: action.tab, menu: null };
    case "setBreakoutOpen":
      return { ...state, breakoutOpen: action.open, menu: null };
    case "promote":
      return { ...state, promoted: action.item };
    case "resetToolbar":
      return { ...state, promoted: null };
    case "toggleAlwaysShowBars":
      return { ...state, alwaysShowBars: !state.alwaysShowBars };
    case "toggleHideSelfView":
      return { ...state, hideSelfView: !state.hideSelfView };
    case "closePermissionBar":
      return { ...state, permissionBarClosed: true };
  }
}
