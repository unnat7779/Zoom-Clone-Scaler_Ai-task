import type { MeetingSettings } from "@/shared/types/realtime";
import type { HostToolsPage } from "../../../state/roomUiReducer";

/**
 * Host tools content (PRD §8.9, spec 05 §7) — Static UI only: switches toggle visually.
 * A switch with `setting` starts from the live meeting setting (Mute All's "allow unmute").
 */
export type HostToolsItem =
  | { kind: "switch"; label: string; on: boolean; setting?: keyof MeetingSettings }
  | { kind: "link"; label: string; page?: HostToolsPage }
  | { kind: "danger"; label: string }
  | { kind: "section"; label: string }
  | { kind: "select"; label: string; value: string; disabled?: boolean }
  | { kind: "divider" };

const DIVIDER: HostToolsItem = { kind: "divider" };

export const HOST_TOOLS_PAGES: Record<HostToolsPage, { title: string; items: HostToolsItem[] }> = {
  root: {
    title: "Host tools",
    items: [
      { kind: "switch", label: "Enable waiting room", on: false },
      { kind: "switch", label: "Lock Meeting", on: false },
      { kind: "switch", label: "Hide profile pictures", on: false },
      DIVIDER,
      { kind: "link", label: "Participants", page: "participants" },
      { kind: "link", label: "Advanced", page: "advanced" },
    ],
  },
  participants: {
    title: "Participants",
    items: [
      { kind: "danger", label: "Suspend Participant Activities" },
      DIVIDER,
      { kind: "section", label: "Allow participants to:" },
      { kind: "switch", label: "Chat", on: true },
      { kind: "switch", label: "Rename Themselves", on: true },
      { kind: "switch", label: "Unmute Themselves", on: true, setting: "allow_unmute" },
      { kind: "switch", label: "Start Video", on: true },
      DIVIDER,
    ],
  },
  advanced: {
    title: "Advanced",
    items: [
      { kind: "link", label: "AI" },
      { kind: "link", label: "My Notes" },
      { kind: "link", label: "Share", page: "share" },
      { kind: "link", label: "Captions" },
      { kind: "link", label: "Whiteboards" },
    ],
  },
  share: {
    title: "Share",
    items: [
      { kind: "select", label: "How many participants can share at the same time?", value: "Multiple participants can share simultaneously" },
      { kind: "select", label: "Who can share?", value: "All Participants", disabled: true },
      { kind: "select", label: "Who can start sharing when someone else is sharing?", value: "All Participants", disabled: true },
    ],
  },
};

/** Back goes one level up. */
export const PARENT_PAGE: Record<HostToolsPage, HostToolsPage | null> = {
  root: null,
  participants: "root",
  advanced: "root",
  share: "advanced",
};
