import { format } from "date-fns";

/**
 * Schedule date field and the month / year views of its picker (PRD §7.6.6). Day keys and the day
 * grid are shared: `@/shared/lib/calendar`, `toDateKey` in `@/shared/lib/format`, `@/shared/ui/DayGrid`.
 */

/** Date field label: `10/07/2026`. */
export const formatScheduleDate = (date: Date): string => format(date, "MM/dd/yyyy");

export const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;

/** Decade of the year view: `2020 - 2029`, cells 2019…2030. */
export const decadeStart = (year: number): number => Math.floor(year / 10) * 10;
