import { format } from "date-fns";
import { formatTimeRange, parseApiDate } from "@/shared/lib/format";
import type { InstanceListItem } from "@/shared/types/api";

/** `Tue, Oct 6 · 3:00 PM - 3:32 PM` (PRD §7.1.9). */
export function formatRecentWhen(item: InstanceListItem): string {
  const start = parseApiDate(item.started_at);
  return `${format(start, "EEE, MMM d")} · ${formatTimeRange(start, parseApiDate(item.ended_at))}`;
}

/** `32 min · 4 participants`. */
export function formatRecentStats(item: InstanceListItem): string {
  const people = item.participant_count === 1 ? "participant" : "participants";
  return `${item.duration_minutes} min · ${item.participant_count} ${people}`;
}
