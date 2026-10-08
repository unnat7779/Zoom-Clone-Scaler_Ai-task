/**
 * Display formatters (PRD §10.3). Dates are rendered in the browser's time
 * zone; pass `Date` objects (use `parseApiDate` for API strings).
 */
import { addDays, addMinutes, format, isSameDay, parseISO } from "date-fns";

/** Parses a UTC ISO-8601 string from the API. */
export const parseApiDate = (iso: string): Date => parseISO(iso);

/** 9 digits → `3 3 3`, 10 → `3 3 4`, 11 → `3 4 4`; anything else is returned as digits. */
export function formatMeetingNumber(value: string | number): string {
  const digits = String(value).replace(/\D/g, "");
  const groups: Record<number, [number, number, number]> = { 9: [3, 3, 3], 10: [3, 3, 4], 11: [3, 4, 4] };
  const sizes = groups[digits.length];
  if (!sizes) return digits;
  const [a, b] = sizes;
  return `${digits.slice(0, a)} ${digits.slice(a, a + b)} ${digits.slice(a + b)}`;
}

/** `11:06 PM` (clock, card times). */
export const formatClockTime = (date: Date): string => format(date, "h:mm a");

/** `Wednesday, October 7` (Home date under the clock). */
export const formatLongDate = (date: Date): string => format(date, "EEEE, MMMM d");

/** `10:00 AM - 10:40 AM`. */
export const formatTimeRange = (start: Date, end: Date): string =>
  `${formatClockTime(start)} - ${formatClockTime(end)}`;

/** Scheduled window of a meeting: API `start_time` → start, `+ duration_minutes` → end. */
export function meetingWindow(startIso: string, durationMinutes: number): { start: Date; end: Date } {
  const start = parseApiDate(startIso);
  return { start, end: addMinutes(start, durationMinutes) };
}

export type RelativeDay = "Today" | "Tomorrow" | "Yesterday";

const DAY_OFFSETS: Record<RelativeDay, number> = { Today: 0, Tomorrow: 1, Yesterday: -1 };

/** The calendar day of `date` relative to `now`, among `names` (all three by default), else null. */
export function relativeDayName(
  date: Date,
  now: Date,
  names: readonly RelativeDay[] = ["Today", "Tomorrow", "Yesterday"],
): RelativeDay | null {
  return names.find((name) => isSameDay(date, addDays(now, DAY_OFFSETS[name]))) ?? null;
}

/** Home calendar day label: `Today, Oct 7` / `Tomorrow, Oct 8` / `Yesterday, Oct 6` / `Fri, Oct 9`. */
export function formatRelativeDayLabel(date: Date, now: Date = new Date()): string {
  const name = relativeDayName(date, now);
  return name ? `${name}, ${format(date, "MMM d")}` : format(date, "EEE, MMM d");
}

/** `YYYY-MM-DD` of the local calendar day (for `?view=day&date=`). */
export const toDateKey = (date: Date): string => format(date, "yyyy-MM-dd");

/** IANA zone of the browser, e.g. `Asia/Kolkata`. */
export const getBrowserTimeZone = (): string => Intl.DateTimeFormat().resolvedOptions().timeZone;
