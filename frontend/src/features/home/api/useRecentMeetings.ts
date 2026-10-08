"use client";

import { useQuery } from "@tanstack/react-query";
import { listPreviousMeetings, queryKeys } from "@/shared/lib/api";
import { RECENT_MEETINGS_LIMIT } from "../constants";

/** Recent meetings card (DV1): the newest ended instances, newest first (PRD §7.1.9). */
export function useRecentMeetings() {
  return useQuery({
    queryKey: queryKeys.meetings.previous(RECENT_MEETINGS_LIMIT),
    queryFn: ({ signal }) => listPreviousMeetings(RECENT_MEETINGS_LIMIT, signal),
  });
}
