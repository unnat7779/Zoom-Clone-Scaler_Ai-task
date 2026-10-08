import type { ComponentType } from "react";
import type { IconProps } from "@/shared/icons/types";
import { MtgChatIcon } from "@/shared/icons/generated/MtgChatIcon";
import { MtgMicOnIcon } from "@/shared/icons/generated/MtgMicOnIcon";
import { MtgParticipantsIcon } from "@/shared/icons/generated/MtgParticipantsIcon";
import { MtgReactIcon } from "@/shared/icons/generated/MtgReactIcon";
import { MtgShareIcon } from "@/shared/icons/generated/MtgShareIcon";
import { MtgVideoOnIcon } from "@/shared/icons/generated/MtgVideoOnIcon";
import { RoomHosttoolsIcon } from "@/shared/icons/generated/RoomHosttoolsIcon";
import { RoomMoreBreakoutRoomsIcon } from "@/shared/icons/generated/RoomMoreBreakoutRoomsIcon";
import { RoomMoreSettingsIcon } from "@/shared/icons/generated/RoomMoreSettingsIcon";
import { RoomMoreShowCaptionsIcon } from "@/shared/icons/generated/RoomMoreShowCaptionsIcon";
import { RoomMoreStopIncomingVideoIcon } from "@/shared/icons/generated/RoomMoreStopIncomingVideoIcon";
import { RoomMoreWhiteboardsIcon } from "@/shared/icons/generated/RoomMoreWhiteboardsIcon";
import type { PanelId, SettingsTab } from "../../state/roomUiReducer";
import type { ExtraItem, MidItem } from "../../utils/toolbarOverflow";

/**
 * What a More tile (or its promoted toolbar button) does: toggle a panel, open a device menu
 * (phones), the static Settings window, the static captions dialog or Breakout Rooms window,
 * or nothing (Static UI).
 */
export type MoreTileAction =
  | { type: "panel"; panel: PanelId }
  | { type: "menu"; menu: "audio" | "video" }
  | { type: "settings"; tab: SettingsTab }
  | { type: "captions" }
  | { type: "breakout" }
  | { type: "none" };

export interface MoreTile {
  key: string;
  label: string;
  Icon: ComponentType<IconProps>;
  action: MoreTileAction;
  hostOnly?: boolean;
}

const NONE: MoreTileAction = { type: "none" };

/** Toolbar buttons that overflow into More keep their label and behaviour (React and Share are static). */
export const OVERFLOW_TILES: Record<MidItem, MoreTile> = {
  participants: { key: "participants", label: "Participants", Icon: MtgParticipantsIcon, action: { type: "panel", panel: "participants" } },
  chat: { key: "chat", label: "Chat", Icon: MtgChatIcon, action: { type: "panel", panel: "chat" } },
  react: { key: "react", label: "React", Icon: MtgReactIcon, action: NONE },
  share: { key: "share", label: "Share", Icon: MtgShareIcon, action: NONE },
  hostTools: { key: "hostTools", label: "Host tools", Icon: RoomHosttoolsIcon, action: { type: "panel", panel: "hostTools" } },
};

/** The compact bar hides the Audio / Video carets (DV10): their device menus open from More [D] (sheets on phones). */
export const DEVICE_TILES: MoreTile[] = [
  { key: "audioSettings", label: "Audio Settings", Icon: MtgMicOnIcon, action: { type: "menu", menu: "audio" } },
  { key: "videoSettings", label: "Video Settings", Icon: MtgVideoOnIcon, action: { type: "menu", menu: "video" } },
];

/**
 * More extras (PRD §8.6.7), all Static UI: Settings opens the in-room Settings window (§8.17),
 * Show Captions / Breakout Rooms their static dialogs (§8.12.5–6). Picking one promotes it.
 */
export const EXTRA_TILES: Record<ExtraItem, MoreTile> = {
  captions: { key: "captions", label: "Show Captions", Icon: RoomMoreShowCaptionsIcon, action: { type: "captions" } },
  breakout: { key: "breakout", label: "Breakout Rooms", Icon: RoomMoreBreakoutRoomsIcon, action: { type: "breakout" }, hostOnly: true },
  whiteboards: { key: "whiteboards", label: "Whiteboards", Icon: RoomMoreWhiteboardsIcon, action: NONE },
  settings: { key: "settings", label: "Settings", Icon: RoomMoreSettingsIcon, action: { type: "settings", tab: "general" } },
  stopIncomingVideo: { key: "stopIncomingVideo", label: "Stop Incoming Video", Icon: RoomMoreStopIncomingVideoIcon, action: NONE },
};

/** Zoom's tile order (room-15). */
export const EXTRA_ORDER: ExtraItem[] = ["captions", "breakout", "whiteboards", "settings", "stopIncomingVideo"];

export const isExtraItem = (key: string): key is ExtraItem => key in EXTRA_TILES;
