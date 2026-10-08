import type { ComponentType } from "react";
import type { IconProps } from "@/shared/icons/types";
import { DsPresenceAvailableIcon } from "@/shared/icons/generated/DsPresenceAvailableIcon";
import { DsPresenceAwayIcon } from "@/shared/icons/generated/DsPresenceAwayIcon";
import { DsPresenceBusyIcon } from "@/shared/icons/generated/DsPresenceBusyIcon";
import { DsPresenceCalendarIcon } from "@/shared/icons/generated/DsPresenceCalendarIcon";
import { DsPresenceDndIcon } from "@/shared/icons/generated/DsPresenceDndIcon";
import { DsPresenceMeetingIcon } from "@/shared/icons/generated/DsPresenceMeetingIcon";
import { DsPresenceMobileIcon } from "@/shared/icons/generated/DsPresenceMobileIcon";
import { DsPresenceOfflineIcon } from "@/shared/icons/generated/DsPresenceOfflineIcon";
import { DsPresenceOooIcon } from "@/shared/icons/generated/DsPresenceOooIcon";
import { DsPresencePbxIcon } from "@/shared/icons/generated/DsPresencePbxIcon";

export type PresenceStatus =
  | "available"
  | "busy"
  | "dnd"
  | "away"
  | "offline"
  | "ooo"
  | "meeting"
  | "calendar"
  | "mobile"
  | "pbx";

const GLYPHS: Record<PresenceStatus, ComponentType<IconProps>> = {
  available: DsPresenceAvailableIcon,
  busy: DsPresenceBusyIcon,
  dnd: DsPresenceDndIcon,
  away: DsPresenceAwayIcon,
  offline: DsPresenceOfflineIcon,
  ooo: DsPresenceOooIcon,
  meeting: DsPresenceMeetingIcon,
  calendar: DsPresenceCalendarIcon,
  mobile: DsPresenceMobileIcon,
  pbx: DsPresencePbxIcon,
};

/** Zoom's labels for the status rows (profile menu). */
export const PRESENCE_LABELS: Record<PresenceStatus, string> = {
  available: "Available",
  busy: "Busy",
  dnd: "Do Not Disturb",
  away: "Away",
  offline: "Offline",
  ooo: "Out of Office",
  meeting: "In a Zoom meeting",
  calendar: "In a calendar event",
  mobile: "Mobile",
  pbx: "On a call",
};

/** 10×10 fixed-colour presence glyph (meeting: 16×10 camera). PRD §5.8.15. */
export function PresenceGlyph({ status, className }: { status: PresenceStatus; className?: string }) {
  const Glyph = GLYPHS[status];
  return status === "meeting" ? (
    <Glyph width={16} height={10} className={className} />
  ) : (
    <Glyph width={10} height={10} className={className} />
  );
}
