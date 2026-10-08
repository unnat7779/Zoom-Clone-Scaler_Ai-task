"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMeetingInvitation } from "@/shared/lib/api/invitation";
import { routes } from "@/shared/lib/routes";
import type { Meeting } from "@/shared/types/api";
import { meetingRefOf, startHref } from "../utils/meetingRef";
import { useDeleteMeetingFlow } from "./useDeleteMeetingFlow";
import { useEndMeeting } from "./useEndMeeting";

/**
 * Portal detail actions (PRD §7.8.3–7.8.5): Start / Join (host path), End (live PMI), the Copy
 * Invitation dialog (text fetched on first open), Edit, and Delete (soft delete → Meetings).
 */
export function useDetailActions(meeting: Meeting) {
  const router = useRouter();
  const meetingRef = meetingRefOf(meeting);
  const [copyOpen, setCopyOpen] = useState(false);
  const invitation = useMeetingInvitation(meetingRef, { enabled: copyOpen });
  const remove = useDeleteMeetingFlow(meetingRef, { onDeleted: () => router.push(routes.meetings()), surface: "portal" });

  return {
    start: () => router.push(startHref(meetingRef)),
    end: useEndMeeting(meeting.meeting_number),
    edit: () => router.push(routes.meetingEdit(meetingRef.number, { id: meetingRef.id })),
    copy: { open: copyOpen, text: invitation.data?.text, show: () => setCopyOpen(true), close: () => setCopyOpen(false) },
    remove,
  };
}
