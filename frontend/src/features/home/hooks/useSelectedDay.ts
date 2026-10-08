"use client";

import { useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { isSameDay, startOfDay } from "date-fns";
import { parseDateKeyOrNull } from "@/shared/lib/calendar";
import { toDateKey } from "@/shared/lib/format";
import { DAY_PARAM } from "../constants";

/**
 * The calendar widget's selected day. It lives in the URL (`/wc/home?day=2026-10-08`) so a refresh
 * keeps it [D]; without the param it is today (and follows the clock past midnight).
 * Updates use `history.replaceState` (shallow: no navigation, no extra history entries).
 */
export function useSelectedDay(today: Date | null) {
  const searchParams = useSearchParams();
  const fromUrl = parseDateKeyOrNull(searchParams.get(DAY_PARAM));
  const day = fromUrl ?? (today ? startOfDay(today) : null);

  const setDay = useCallback((next: Date) => {
    const url = new URL(window.location.href);
    if (isSameDay(next, new Date())) url.searchParams.delete(DAY_PARAM);
    else url.searchParams.set(DAY_PARAM, toDateKey(next));
    window.history.replaceState(null, "", `${url.pathname}${url.search}`);
  }, []);

  return { day, setDay };
}
