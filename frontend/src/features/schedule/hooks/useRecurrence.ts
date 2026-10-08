"use client";

import { useCallback, useMemo, useState } from "react";
import { DEFAULT_OCCURRENCES, type RecurrenceRule, endDateOf, recurrenceSummary } from "../utils/recurrence";

/** Zoom's defaults for a start day: Daily, every 1, ends "By" the 7th occurrence (03-schedule.md §8.1). */
const initialRule = (start: Date): RecurrenceRule => ({
  type: "daily",
  interval: 1,
  weekdays: [start.getDay()],
  monthlyMode: "day",
  monthDay: start.getDate(),
  weekOfMonth: 1,
  weekday: 0,
  end: "by",
  endDate: null,
  count: DEFAULT_OCCURRENCES,
});

/**
 * State of the Recurring sub-form (static UI: the API stores `is_recurring` only). Changing the
 * recurrence or its interval re-derives the "By" date; other edits keep the date already shown.
 */
export function useRecurrence(start: Date) {
  const [rule, setRule] = useState(() => initialRule(start));

  const update = useCallback(
    (patch: Partial<RecurrenceRule>) =>
      setRule((current) => {
        const resetsEnd = "type" in patch || "interval" in patch;
        return { ...current, ...patch, endDate: patch.endDate ?? (resetsEnd ? null : endDateOf(current, start)) };
      }),
    [start],
  );

  const summary = useMemo(() => recurrenceSummary(rule, start), [rule, start]);
  const endDate = useMemo(() => endDateOf(rule, start), [rule, start]);
  return { rule, update, summary, endDate };
}

export type Recurrence = ReturnType<typeof useRecurrence>;
