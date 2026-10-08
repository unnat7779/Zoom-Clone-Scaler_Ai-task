"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createInstantMeeting, queryKeys } from "@/shared/lib/api";
import { routes } from "@/shared/lib/routes";
import { useToast } from "@/shared/ui";

/**
 * New meeting (PRD §7.3): `POST /api/meetings/instant {use_pmi}` then the host start route
 * inside the shell (`/wc/{number}/start?fromPWA=1`). Repeated clicks while pending are ignored.
 */
export function useStartInstantMeeting() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const toast = useToast();
  const mutation = useMutation({
    mutationFn: (usePmi: boolean) => createInstantMeeting({ use_pmi: usePmi }),
    onSuccess: ({ meeting }) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.meetings.all });
      router.push(routes.start(meeting.meeting_number, { fromPWA: true }));
    },
    onError: () => toast.show({ message: "Unable to start the meeting. Please try again.", kind: "error" }),
  });

  return {
    start: (usePmi: boolean) => {
      if (!mutation.isPending) mutation.mutate(usePmi);
    },
  };
}
