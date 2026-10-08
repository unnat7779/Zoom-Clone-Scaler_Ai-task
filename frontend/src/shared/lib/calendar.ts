import { addDays, isValid, parse, startOfMonth, startOfWeek } from "date-fns";

/**
 * zoom-ui date-table helpers shared by the Home day picker and the Schedule date picker
 * (PRD §7.1.7, §7.6.6). Day keys use `toDateKey` from `./format`.
 */

/** `YYYY-MM-DD` → local midnight of that day (Invalid Date when malformed). */
export const parseDateKey = (key: string): Date => parse(key, "yyyy-MM-dd", new Date());

const DATE_KEY = /^\d{4}-\d{2}-\d{2}$/;

/** Strict `YYYY-MM-DD` (a URL param, a `data-day` attribute) → local midnight, or null when missing or malformed. */
export function parseDateKeyOrNull(key: string | null | undefined): Date | null {
  if (!key || !DATE_KEY.test(key)) return null;
  const date = parseDateKey(key);
  return isValid(date) ? date : null;
}

/** Sunday-first weekday header: initial + full name (dark tooltip). */
export const WEEKDAYS = [
  { short: "S", name: "Sunday" },
  { short: "M", name: "Monday" },
  { short: "T", name: "Tuesday" },
  { short: "W", name: "Wednesday" },
  { short: "T", name: "Thursday" },
  { short: "F", name: "Friday" },
  { short: "S", name: "Saturday" },
] as const;

export const DAYS_PER_WEEK = 7;
const WEEKS = 6;

/** Always 6 weeks × 7 days, starting on the Sunday on or before the 1st of `month`. */
export function monthGrid(month: Date): Date[] {
  const first = startOfWeek(startOfMonth(month));
  return Array.from({ length: WEEKS * DAYS_PER_WEEK }, (_, index) => addDays(first, index));
}
