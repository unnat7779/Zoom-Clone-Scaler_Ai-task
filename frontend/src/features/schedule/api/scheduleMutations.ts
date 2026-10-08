"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type MeetingRef, queryKeys, scheduleMeeting, updateMeeting, updatePmiMeeting } from "@/shared/lib/api";
import type { ScheduleRequest, UpdateMeetingRequest, UpdatePmiRequest } from "@/shared/types/api";

/** Every Home / Meetings / detail list and the edited meeting refresh after a save. */
function useInvalidateMeetings() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.meetings.all });
}

/** `POST /api/meetings` (Schedule → Save). */
export function useScheduleMeeting() {
  const invalidate = useInvalidateMeetings();
  return useMutation({ mutationFn: (body: ScheduleRequest) => scheduleMeeting(body), onSuccess: invalidate });
}

/** `PATCH /api/meetings/{n}[?id=]` (Edit → Save); the meeting travels with each call. */
export function useUpdateMeeting() {
  const invalidate = useInvalidateMeetings();
  return useMutation({
    mutationFn: ({ ref, body }: { ref: MeetingRef; body: UpdateMeetingRequest }) => updateMeeting(ref, body),
    onSuccess: invalidate,
  });
}

/** `PATCH /api/meetings/pmi` (Edit PMI → Save). */
export function useUpdatePmi() {
  const invalidate = useInvalidateMeetings();
  return useMutation({ mutationFn: (body: UpdatePmiRequest) => updatePmiMeeting(body), onSuccess: invalidate });
}
