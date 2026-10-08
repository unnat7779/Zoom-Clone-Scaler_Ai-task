import type { ReactNode } from "react";
import { MtgVideoOnIcon } from "@/shared/icons/generated/MtgVideoOnIcon";
import { RoomInfoIcon } from "@/shared/icons/generated/RoomInfoIcon";
import { RoomMoreSettingsIcon } from "@/shared/icons/generated/RoomMoreSettingsIcon";
import type { SettingsTab } from "../../state/roomUiReducer";
import { SettingsGlyph } from "./SettingsGlyph";

export interface SettingsTabInfo {
  id: SettingsTab;
  label: string;
  /** 16px white glyph on the coloured 24×24 chip */
  icon: ReactNode;
}

/** Left tab rail of the Settings window, top to bottom (spec 05 §12 [M]). */
export const SETTINGS_TABS: SettingsTabInfo[] = [
  { id: "general", label: "General", icon: <RoomMoreSettingsIcon /> },
  { id: "video", label: "Video", icon: <MtgVideoOnIcon /> },
  { id: "audio", label: "Audio", icon: <SettingsGlyph name="audio" /> },
  { id: "background", label: "Background", icon: <SettingsGlyph name="background" /> },
  { id: "statistics", label: "Statistics", icon: <SettingsGlyph name="statistics" /> },
  { id: "about", label: "About", icon: <RoomInfoIcon /> },
];
