"use client";

import { type KeyboardEvent, type RefObject, useEffect, useRef, useState } from "react";
import { addDays, addMonths, endOfWeek, isSameDay, startOfDay, startOfMonth, startOfWeek } from "date-fns";
import { parseDateKeyOrNull } from "@/shared/lib/calendar";
import { toDateKey } from "@/shared/lib/format";

const DAY_STEPS: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };

function targetDay(key: string, day: Date, crossMonths: boolean): Date | null {
  const step = DAY_STEPS[key];
  if (step !== undefined) return addDays(day, step);
  if (key === "Home") return startOfWeek(day);
  if (key === "End") return startOfDay(endOfWeek(day));
  if (crossMonths && key === "PageUp") return addMonths(day, -1);
  if (crossMonths && key === "PageDown") return addMonths(day, 1);
  return null;
}

interface DayFocusOptions {
  gridRef: RefObject<HTMLElement | null>;
  /** the 42 days on screen */
  days: Date[];
  selected: Date;
  /** set: keys may leave the grid (the view follows) and Page Up / Down move by a month */
  onMonthChange?: (month: Date) => void;
}

/**
 * Roving focus over the day buttons (`[data-day]`): one Tab stop (initially the selected day);
 * arrows move by a day / week, Home / End to the week's ends. Without `onMonthChange` the focus
 * stops at the grid's edges.
 */
export function useDayFocus({ gridRef, days, selected, onMonthChange }: DayFocusOptions) {
  const [focused, setFocused] = useState(selected);
  const movedByKey = useRef(false);

  useEffect(() => {
    if (!movedByKey.current) return;
    movedByKey.current = false;
    gridRef.current?.querySelector<HTMLElement>(`[data-day="${toDateKey(focused)}"]`)?.focus();
  }, [focused, gridRef]);

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    // the key goes to the day that has focus (the month's first day after « ‹ › » moved the view)
    const current = parseDateKeyOrNull((event.target as HTMLElement).dataset.day);
    const next = current && targetDay(event.key, current, onMonthChange !== undefined);
    if (!next) return;
    const onScreen = days.some((day) => isSameDay(day, next));
    if (!onScreen && !onMonthChange) return;
    event.preventDefault();
    movedByKey.current = true;
    setFocused(next);
    if (!onScreen) onMonthChange?.(startOfMonth(next));
  };

  return { focused, onKeyDown };
}
