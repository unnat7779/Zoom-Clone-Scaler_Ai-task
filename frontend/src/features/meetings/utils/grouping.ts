import { format, isSameYear } from "date-fns";
import { type RelativeDay, parseApiDate, relativeDayName, toDateKey } from "@/shared/lib/format";
import type { InstanceListItem, MeetingListItem } from "@/shared/types/api";

export interface DayGroup<T> {
  /** `YYYY-MM-DD` of the local day */
  key: string;
  label: string;
  items: T[];
}

/** Splits already-sorted items into consecutive local-day groups. */
function groupByDay<T>(items: T[], dateOf: (item: T) => Date, labelOf: (day: Date) => string): DayGroup<T>[] {
  const groups: DayGroup<T>[] = [];
  for (const item of items) {
    const day = dateOf(item);
    const key = toDateKey(day);
    const last = groups.at(-1);
    if (last?.key === key) last.items.push(item);
    else groups.push({ key, label: labelOf(day), items: [item] });
  }
  return groups;
}

/** Group header: a relative name among `names`, else `Wed, Oct 14` (+ `, 2027` for another year). */
function groupLabel(day: Date, now: Date, names: readonly RelativeDay[]): string {
  return relativeDayName(day, now, names) ?? format(day, isSameYear(day, now) ? "EEE, MMM d" : "EEE, MMM d, yyyy");
}

/** Upcoming: `Today` / `Tomorrow` / `Wed, Oct 14` (+ year), oldest first (PRD §7.4.2). */
export function groupUpcoming(items: MeetingListItem[], now: Date): DayGroup<MeetingListItem>[] {
  const sorted = [...items].sort((a, b) => parseApiDate(a.start_time).getTime() - parseApiDate(b.start_time).getTime());
  return groupByDay(sorted, (item) => parseApiDate(item.start_time), (day) => groupLabel(day, now, ["Today", "Tomorrow"]));
}

/** Previous (DV3): `Today` / `Yesterday` / `Tue, Oct 6` (+ year), newest first [D]. */
export function groupPrevious(items: InstanceListItem[], now: Date): DayGroup<InstanceListItem>[] {
  const sorted = [...items].sort((a, b) => parseApiDate(b.started_at).getTime() - parseApiDate(a.started_at).getTime());
  return groupByDay(sorted, (item) => parseApiDate(item.started_at), (day) => groupLabel(day, now, ["Today", "Yesterday"]));
}

/** Selection key of an Upcoming row (`?select=`): the number, or `{number}-{id}` for calendar entries on the PMI. */
export const upcomingKey = (item: Pick<MeetingListItem, "id" | "meeting_number" | "uses_pmi">): string =>
  item.uses_pmi ? `${item.meeting_number}-${item.id}` : item.meeting_number;
