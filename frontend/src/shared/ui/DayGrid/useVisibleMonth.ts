"use client";

import { useState } from "react";
import { addMonths, addYears, startOfMonth } from "date-fns";

/** The month a date picker shows (« ‹ › » navigation), starting with the month of `initial`. */
export function useVisibleMonth(initial: Date) {
  const [month, setMonth] = useState(() => startOfMonth(initial));
  return {
    month,
    /** shows the month that contains `day` */
    showMonth: (day: Date) => setMonth(startOfMonth(day)),
    shiftMonths: (amount: number) => setMonth((current) => addMonths(current, amount)),
    shiftYears: (amount: number) => setMonth((current) => addYears(current, amount)),
  };
}
