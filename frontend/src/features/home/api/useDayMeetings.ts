"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { listDayMeetings, queryKeys } from "@/shared/lib/api";
import { getBrowserTimeZone, toDateKey } from "@/shared/lib/format";

/**
 * Calendar widget day (`GET /api/meetings?view=day&date=&tz=`, PRD §7.1.8). The previous day's
 * cards stay visible under the loading overlay while another day loads.
 */
export function useDayMeetings(day: Date | null) {
  const dateKey = day ? toDateKey(day) : "";
  const timeZone = getBrowserTimeZone();
  return useQuery({
    queryKey: queryKeys.meetings.day(dateKey, timeZone),
    queryFn: ({ signal }) => listDayMeetings(dateKey, timeZone, signal),
    enabled: day !== null,
    placeholderData: keepPreviousData,
  });
}
