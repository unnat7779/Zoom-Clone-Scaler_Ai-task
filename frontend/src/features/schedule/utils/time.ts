/** Start-time helpers for the Schedule "When" row (PRD §7.6.4, 03-schedule.md §6.4). */

export type Meridiem = "AM" | "PM";

/** 48 options `12:00, 12:15 … 11:45` (no leading zero). */
export const STANDARD_TIMES: readonly string[] = Array.from({ length: 48 }, (_, index) => {
  const hour = Math.floor(index / 4) || 12;
  return `${hour}:${String((index % 4) * 15).padStart(2, "0")}`;
});

const TIME_PATTERN = /^(\d{1,2}):(\d{2})$/;

/** Minutes after 12:00 of a 12-hour label (`12:15` → 15, `1:00` → 60). */
export function minutesOfLabel(label: string): number {
  const match = TIME_PATTERN.exec(label);
  if (!match) return 0;
  return (Number(match[1]) % 12) * 60 + Number(match[2]);
}

/**
 * A typed free time (`9:10` → `09:10`); a value equal to a standard option returns
 * that option (`9:15` → `9:15`); anything else (`abc`, `13:00`, `9:75`) is rejected.
 */
export function parseTypedTime(text: string): string | null {
  const match = TIME_PATTERN.exec(text.trim());
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour < 1 || hour > 12 || minute > 59) return null;
  const standard = `${hour}:${match[2]}`;
  if (STANDARD_TIMES.includes(standard)) return standard;
  return `${String(hour).padStart(2, "0")}:${match[2]}`;
}

/** Prefix filter: `3` → 3:00…3:45, `3:3` → 3:30; `13` (no prefix match) → the 1:xx hour. */
export function filterTimes(options: readonly string[], text: string): string[] {
  const query = text.trim();
  if (!query) return [...options];
  const matches = options.filter((label) => label.startsWith(query));
  if (matches.length > 0 || !/^\d{2}$/.test(query)) return matches;
  return options.filter((label) => label.startsWith(`${query[0]}:`));
}

/** Standard options + accepted free times, in clock order. */
export const withCustomTimes = (custom: readonly string[]): string[] =>
  [...STANDARD_TIMES, ...custom.filter((time) => !STANDARD_TIMES.includes(time))].sort(
    (a, b) => minutesOfLabel(a) - minutesOfLabel(b),
  );

/** `9:10` + PM → `21:10`. */
export function to24Hour(label: string, meridiem: Meridiem): string {
  const minutes = minutesOfLabel(label) + (meridiem === "PM" ? 12 * 60 : 0);
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}

/** Wall-clock hour/minute → the field values (`21:10` → `09:10` PM; `09:30` → `9:30` AM). */
export function from24Hour(hours: number, minutes: number): { time: string; meridiem: Meridiem } {
  const meridiem: Meridiem = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;
  const time = parseTypedTime(`${hour12}:${String(minutes).padStart(2, "0")}`) ?? "12:00";
  return { time, meridiem };
}

/** Default start [D, U11]: the next half-hour after `now`. */
export function nextHalfHour(now: Date): Date {
  const next = new Date(now);
  next.setSeconds(0, 0);
  next.setMinutes(now.getMinutes() < 30 ? 30 : 60);
  return next;
}
