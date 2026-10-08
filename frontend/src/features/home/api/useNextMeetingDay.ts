"use client";

import { useQuery } from "@tanstack/react-query";
import { startOfDay } from "date-fns";
import { listUpcomingMeetings, queryKeys } from "@/shared/lib/api";
import { parseApiDate } from "@/shared/lib/format";
import { nextDayStartIso } from "../utils/nextDayStart";

/**
 * DV2: the first later day that has a scheduled meeting, used by the empty day's
 * "Next: Thu, Oct 8" button. Only queried while the selected day is empty.
 */
export function useNextMeetingDay(day: Date | null, enabled: boolean): Date | null {
  const from = day ? nextDayStartIso(day) : "";
  const { data } = useQuery({
    queryKey: queryKeys.meetings.upcoming(from),
    queryFn: ({ signal }) => listUpcomingMeetings(from, signal),
    enabled: enabled && day !== null,
  });
  const fromTime = Date.parse(from);
  const next = data?.map((item) => parseApiDate(item.start_time)).find((start) => start.getTime() >= fromTime);
  return next ? startOfDay(next) : null;
}
