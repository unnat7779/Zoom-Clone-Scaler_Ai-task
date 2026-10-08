/** Calendar event-card visual state (Zoom widget classes: default, `isComing`, `now`, `isPast`, `isPast.joined`). */
export type EventCardState = "upcoming" | "coming" | "now" | "past" | "pastJoined";

export interface EventCardStatus {
  state: EventCardState;
  /** "Starting soon" / "Now" on the right of the card */
  statusLabel: "Starting soon" | "Now" | null;
  /** Start / Join pill (isComing, now, or within 15 min after the start) */
  action: "Start" | "Join" | null;
}

export type { JoinHistoryEntry } from "@/shared/lib/joinHistory";
