import { addDays, startOfDay } from "date-fns";

/** UTC ISO instant of the local midnight that starts the day after `day` (upcoming `from`). */
export const nextDayStartIso = (day: Date): string => startOfDay(addDays(day, 1)).toISOString();
