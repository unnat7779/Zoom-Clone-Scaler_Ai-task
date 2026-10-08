"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type MeetingRef, deleteMeeting, queryKeys } from "@/shared/lib/api";

/**
 * Soft delete (`DELETE /api/meetings/{n}`). Drops the deleted meeting's own cache
 * (so an open detail page is not refetched into a 404 before it navigates away)
 * and refreshes every meeting list (Home day view, Meetings, Recent).
 */
export function useDeleteMeeting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ref: MeetingRef) => deleteMeeting(ref),
    onSuccess: (_data, ref) => {
      queryClient.removeQueries({ queryKey: queryKeys.meetings.detail(ref.number, ref.id) });
      queryClient.removeQueries({ queryKey: queryKeys.meetings.invitation(ref.number, ref.id) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.meetings.all });
    },
  });
}
