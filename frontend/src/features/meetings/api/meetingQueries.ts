"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { startOfDay } from "date-fns";
import {
  type MeetingRef,
  getInstance,
  getMeeting,
  getPmiMeeting,
  listPreviousMeetings,
  listUpcomingMeetings,
  queryKeys,
} from "@/shared/lib/api";

/** Meetings → Upcoming: scheduled meetings from the start of local today + live instant meetings. */
export function useUpcomingMeetings() {
  const [from] = useState(() => startOfDay(new Date()).toISOString());
  return useQuery({
    queryKey: queryKeys.meetings.upcoming(from),
    queryFn: ({ signal }) => listUpcomingMeetings(from, signal),
  });
}

/** `GET /api/meetings?view=previous&limit=` (PRD §10.4 default 50). */
const PREVIOUS_LIMIT = 50;

/** Meetings → Previous (DV3): ended instances, newest first. */
export function usePreviousMeetings() {
  return useQuery({
    queryKey: queryKeys.meetings.previous(),
    queryFn: ({ signal }) => listPreviousMeetings(PREVIOUS_LIMIT, signal),
  });
}

/** The default user's Personal Meeting Room. */
export function usePmiMeeting() {
  return useQuery({ queryKey: queryKeys.meetings.pmi, queryFn: ({ signal }) => getPmiMeeting(signal) });
}

/** Full meeting definition (portal detail page, edit form). */
export function useMeetingDetail(ref: MeetingRef) {
  return useQuery({
    queryKey: queryKeys.meetings.detail(ref.number, ref.id),
    queryFn: ({ signal }) => getMeeting(ref, signal),
  });
}

/** Ended instance + its participants (Previous detail). */
export function useInstanceDetail(uuid: string | null) {
  return useQuery({
    queryKey: queryKeys.instance(uuid ?? ""),
    queryFn: ({ signal }) => getInstance(uuid ?? "", signal),
    enabled: uuid !== null,
  });
}
