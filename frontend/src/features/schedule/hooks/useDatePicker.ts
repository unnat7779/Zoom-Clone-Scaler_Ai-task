"use client";

import { useState } from "react";
import { setMonth, setYear } from "date-fns";
import { useVisibleMonth } from "@/shared/ui/DayGrid";

export type DatePickerView = "day" | "month" | "year";

/**
 * Date-picker panel state (PRD §7.6.6): the visible month, day / month / year views
 * and their navigation. The panel unmounts on close, so reopening starts in the day view.
 */
export function useDatePicker(selected: Date) {
  const [view, setView] = useState<DatePickerView>("day");
  const { month, showMonth, shiftMonths, shiftYears } = useVisibleMonth(selected);

  const pickMonth = (monthIndex: number) => {
    showMonth(setMonth(month, monthIndex));
    setView("day");
  };
  const pickYear = (year: number) => {
    showMonth(setYear(month, year));
    setView("month");
  };

  return { view, setView, month, shiftMonths, shiftYears, pickMonth, pickYear };
}
