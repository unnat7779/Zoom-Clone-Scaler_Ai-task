"use client";

import { useRouter } from "next/navigation";
import { meetingRefOf, startHref } from "@/features/meetings";
import { useInvitationActions } from "@/shared/lib/api/invitation";
import { routes } from "@/shared/lib/routes";
import type { MeetingListItem } from "@/shared/types/api";
import { useToast } from "@/shared/ui";

/** Event-card "…" menu actions (PRD §7.1.8 [D]): Start · Copy Invitation · Edit. */
export function useEventCardActions(item: MeetingListItem) {
  const router = useRouter();
  const toast = useToast();
  const invitation = useInvitationActions();
  const ref = meetingRefOf(item);

  return {
    prefetchInvitation: () => invitation.prefetch(ref),
    start: () => router.push(startHref(ref)),
    edit: () => router.push(routes.meetingEdit(ref.number, { id: ref.id })),
    copyInvitation: async () => {
      const copied = await invitation.copy(ref);
      toast.show(copied ? { message: "Copied to clipboard", kind: "success" } : { message: "Copy failed", kind: "error" });
    },
  };
}
