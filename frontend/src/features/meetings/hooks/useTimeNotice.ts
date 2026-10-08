"use client";

import { useClock } from "@/shared/hooks/useClock";
import { parseApiDate } from "@/shared/lib/format";
import { type TimeNotice, getTimeNotice } from "../utils/notice";

/** "In Progress" / "Starts in N minutes" / "NOW", recomputed every second (PRD §7.4.4). */
export function useTimeNotice(startIso: string, durationMinutes: number, isLive: boolean): TimeNotice | null {
  const now = useClock("second");
  if (!now) return null;
  return getTimeNotice(parseApiDate(startIso), durationMinutes, isLive, now);
}
