import { addDays, addMonths, addWeeks, format, isAfter, startOfDay, startOfWeek } from "date-fns";

/** Recurrence sub-form of the Schedule page (03-schedule.md §7, §8.1). Static UI: only `is_recurring` is stored. */
export type RecurrenceType = "daily" | "weekly" | "monthly" | "none";
export type MonthlyMode = "day" | "weekday";
export type RecurrenceEnd = "never" | "by" | "after";

export interface RecurrenceRule {
  type: RecurrenceType;
  /** "Repeat every" N day(s) / week(s) / month(s) */
  interval: number;
  /** weekly: 0 (Sun) … 6 (Sat) */
  weekdays: number[];
  monthlyMode: MonthlyMode;
  /** monthly "Day [n] of the month" */
  monthDay: number;
  /** monthly "[First…Fourth, Last] [weekday]": 1–4, 5 = Last */
  weekOfMonth: number;
  weekday: number;
  end: RecurrenceEnd;
  /** "By" date; null = the 7th occurrence (Zoom's default) */
  endDate: Date | null;
  /** "After [n] occurrences" (1–60) */
  count: number;
}

export const MAX_OCCURRENCES = 60;
export const DEFAULT_OCCURRENCES = 7;
export const WEEK_ORDINALS = ["First", "Second", "Third", "Fourth", "Last"] as const;
export const WEEKDAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;

/** n-th (1–4) or last (5) `weekday` of the month that contains `month`. */
function nthWeekday(month: Date, weekOfMonth: number, weekday: number): Date {
  if (weekOfMonth === 5) {
    const last = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    return addDays(last, -((last.getDay() - weekday + 7) % 7));
  }
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  return addDays(first, ((weekday - first.getDay() + 7) % 7) + (weekOfMonth - 1) * 7);
}

/** Candidate dates of period `index` (one day, one week's chosen days, or one month's day). */
function periodDates(rule: RecurrenceRule, start: Date, index: number): Date[] {
  const step = index * rule.interval;
  if (rule.type === "daily") return [addDays(start, step)];
  if (rule.type === "weekly") {
    const week = addWeeks(startOfWeek(start), step);
    return [...rule.weekdays].sort((a, b) => a - b).map((day) => addDays(week, day));
  }
  const month = addMonths(new Date(start.getFullYear(), start.getMonth(), 1), step);
  if (rule.monthlyMode === "weekday") return [nthWeekday(month, rule.weekOfMonth, rule.weekday)];
  const date = new Date(month.getFullYear(), month.getMonth(), rule.monthDay);
  return date.getMonth() === month.getMonth() ? [date] : [];
}

/** The first `limit` occurrences on or after `start` (at most 60, Zoom's cap). */
export function occurrences(rule: RecurrenceRule, start: Date, limit = MAX_OCCURRENCES): Date[] {
  const from = startOfDay(start);
  const found: Date[] = [];
  for (let index = 0; found.length < limit && index < MAX_OCCURRENCES * 31; index += 1) {
    for (const date of periodDates(rule, from, index)) if (date >= from && found.length < limit) found.push(date);
  }
  return found;
}

/** "By" default: the 7th occurrence (start + 6 intervals for a single day per period). */
export const defaultEndDate = (rule: RecurrenceRule, start: Date): Date =>
  occurrences(rule, start, DEFAULT_OCCURRENCES).at(-1) ?? start;

export const endDateOf = (rule: RecurrenceRule, start: Date): Date => rule.endDate ?? defaultEndDate(rule, start);

const every = (interval: number, unit: string) => (interval === 1 ? `Every ${unit}` : `Every ${interval} ${unit}s`);

function cadence(rule: RecurrenceRule): string {
  if (rule.type === "daily") return every(rule.interval, "day");
  if (rule.type === "weekly") {
    const days = [...rule.weekdays].sort((a, b) => a - b).map((day) => WEEKDAY_NAMES[day]?.slice(0, 3));
    return `${every(rule.interval, "week")} on ${days.join(", ")}`;
  }
  const on =
    rule.monthlyMode === "day"
      ? `the ${rule.monthDay} of the month`
      : `the ${WEEK_ORDINALS[rule.weekOfMonth - 1]} ${WEEKDAY_NAMES[rule.weekday]?.slice(0, 3)}`;
  return `${every(rule.interval, "month")} on ${on}`;
}

/** Bold summary next to the checkbox: "Every day, until Oct 13, 2026, 7 occurrence(s)" / "Meet anytime". */
export function recurrenceSummary(rule: RecurrenceRule, start: Date): string {
  if (rule.type === "none") return "Meet anytime";
  if (rule.end === "never") return cadence(rule);
  if (rule.end === "after") return `${cadence(rule)}, ${rule.count} occurrence(s)`;
  const until = endDateOf(rule, start);
  const count = occurrences(rule, start).filter((date) => !isAfter(date, until)).length;
  return `${cadence(rule)}, until ${format(until, "MMM d, yyyy")}, ${count} occurrence(s)`;
}
