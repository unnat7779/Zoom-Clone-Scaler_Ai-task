import { meetingWindow } from "@/shared/lib/format";
import type { MeetingListItem } from "@/shared/types/api";
import { SOON_WINDOW_MS } from "../constants";
import type { EventCardState, EventCardStatus } from "../types";

function resolveState(item: MeetingListItem, now: number, start: number, end: number): EventCardState {
  if (item.is_live || (now >= start && now <= end)) return "now";
  if (now >= start - SOON_WINDOW_MS && now < start) return "coming";
  if (now > end) return item.has_instance ? "pastJoined" : "past";
  return "upcoming";
}

/**
 * Card state of a calendar event (PRD §7.1.8): upcoming → Starting soon (15 min before) → Now
 * (between start and end, or while an instance is live) → past (joined when an instance ran).
 * The Start/Join pill shows while it is starting soon, live, or within 15 min after the start.
 */
export function getEventCardStatus(item: MeetingListItem, now: Date): EventCardStatus {
  const { start, end } = meetingWindow(item.start_time, item.duration_minutes);
  const time = now.getTime();
  const state = resolveState(item, time, start.getTime(), end.getTime());
  const inPastFifteen = time >= start.getTime() && time - start.getTime() <= SOON_WINDOW_MS;
  const hasAction = state === "now" || state === "coming" || inPastFifteen;
  return {
    state,
    statusLabel: state === "now" ? "Now" : state === "coming" ? "Starting soon" : null,
    action: hasAction ? (item.is_live && item.has_host ? "Join" : "Start") : null,
  };
}

/** Zoom adds `margin-top:24px` to the first card that follows a past, never-joined card. */
export const isSeparatedFromPast = (previous: EventCardState | undefined, current: EventCardState): boolean =>
  previous === "past" && current !== "past";
