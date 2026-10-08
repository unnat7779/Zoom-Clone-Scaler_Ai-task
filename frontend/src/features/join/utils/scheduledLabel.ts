import { parseApiDate } from "@/shared/lib/format";

/** Zoom's `apac.recurring_meeting` (main-client `i1e`, critic C11). */
export const RECURRING_MEETING_LABEL = "This is a recurring meeting";

/**
 * Zoom's on-hold `.wr-schedule-date`: "This is a recurring meeting" for a recurring meeting, else
 * "Scheduled: Oct 9, 2026, 10:00 AM" (only the time when the meeting is today); empty for
 * meetings without a start time (instant / PMI).
 */
export function formatScheduledLabel(startTime: string | null | undefined, now = new Date(), recurring = false): string {
  if (recurring) return RECURRING_MEETING_LABEL;
  if (!startTime) return "";
  const start = parseApiDate(startTime);
  const today = start.toDateString() === now.toDateString();
  const when = new Intl.DateTimeFormat("en-US", {
    dateStyle: today ? undefined : "medium",
    timeStyle: "short",
    hour12: true,
  }).format(start);
  return `Scheduled: ${when}`;
}
