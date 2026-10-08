"use client";

import { useState } from "react";
import type { MeetingRef } from "@/shared/lib/api";
import { useToast } from "@/shared/ui/Toast";
import { useDeleteMeeting } from "../api/useDeleteMeeting";

export interface DeleteMeetingFlowOptions {
  /** runs after a successful soft delete (select the next row, leave the detail page…) */
  onDeleted?: () => void;
  /** where the failure toast appears: the Workplace light toast or the zoom.us message */
  surface?: "workplace" | "portal";
}

/**
 * The one "Delete Meeting" flow (PRD §7.4.8, §7.8.5) behind `DeleteMeetingModal` on the Meetings tab,
 * the Home calendar card and the portal detail page: confirm state + soft delete (lists refresh
 * themselves); a failure closes the dialog with the toast "Delete meeting failed".
 */
export function useDeleteMeetingFlow(meetingRef: MeetingRef, { onDeleted, surface = "workplace" }: DeleteMeetingFlowOptions = {}) {
  const [open, setOpen] = useState(false);
  const mutation = useDeleteMeeting();
  const toast = useToast();

  const confirm = () =>
    mutation.mutate(meetingRef, {
      onSuccess: () => {
        setOpen(false);
        onDeleted?.();
      },
      onError: () => {
        setOpen(false);
        toast.show({ message: "Delete meeting failed", kind: "error", surface });
      },
    });

  return {
    open,
    pending: mutation.isPending,
    openModal: () => setOpen(true),
    close: () => setOpen(false),
    confirm,
  };
}
