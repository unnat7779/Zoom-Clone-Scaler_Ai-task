"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys, validateMeeting } from "@/shared/lib/api";
import type { MeetingValidation } from "@/shared/types/api";
import { isWaitingForHost } from "../utils/preJoinStage";

/** PRD §7.10.1: poll every 5 s while the meeting waits for its host. */
const WAITING_POLL_MS = 5000;

/** `GET /api/meetings/{n}/validate?pwd=` — drives the invalid / waiting / form states. */
export function useMeetingValidation(number: string, pwd: string | null) {
  return useQuery<MeetingValidation>({
    queryKey: queryKeys.meetings.validation(number, pwd),
    queryFn: ({ signal }) => validateMeeting(number, pwd, signal),
    refetchInterval: (query) => (query.state.data && isWaitingForHost(query.state.data) ? WAITING_POLL_MS : false),
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
  });
}
