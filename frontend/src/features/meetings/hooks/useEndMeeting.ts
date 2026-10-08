"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { endMeeting, queryKeys } from "@/shared/lib/api";
import { clearMeetingSession, loadMeetingSession } from "@/shared/lib/meetingSession";
import { useToast } from "@/shared/ui/Toast";

/**
 * Portal "End" for a live Personal Meeting Room (02-meetings.md §C.4). Only the host's participant
 * token can end a meeting (`POST /end`, PRD §10.4): it is used when this tab hosts the meeting;
 * any other browser gets the demo's "not available" toast.
 */
export function useEndMeeting(number: string) {
  const queryClient = useQueryClient();
  const toast = useToast();
  const mutation = useMutation({
    mutationFn: (token: string) => endMeeting(number, { token }),
    onSuccess: () => {
      clearMeetingSession(number);
      void queryClient.invalidateQueries({ queryKey: queryKeys.meetings.all });
    },
    onError: () => toast.show({ message: "Something went wrong. Please try again.", kind: "error", surface: "portal" }),
  });

  return () => {
    const session = loadMeetingSession(number);
    if (session?.participant.role === "host") mutation.mutate(session.token);
    else toast.notAvailable();
  };
}
