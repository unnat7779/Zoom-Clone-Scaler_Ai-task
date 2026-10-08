import type { InstanceListItem, Meeting, MeetingListItem } from "@/shared/types/api";

/** Meetings-tab header segment (DV3: Zoom shows only "Upcoming"). */
export type MeetingsTab = "upcoming" | "previous";

/** What the Upcoming detail pane shows. */
export type UpcomingSelection =
  | { kind: "pmi"; key: string; meeting: Meeting }
  | { kind: "meeting"; key: string; meeting: MeetingListItem };

export interface PreviousSelection {
  key: string;
  instance: InstanceListItem;
}
