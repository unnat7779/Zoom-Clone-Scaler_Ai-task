"use client";

import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import { routes } from "@/shared/lib/routes";
import { PortalPageHead } from "@/shared/ui/PortalPageHead";
import { useMeetingFromRoute } from "../hooks/useMeetingFromRoute";
import { InvalidMeetingPage } from "./detail/InvalidMeetingPage";
import { MeetingDetailView } from "./detail/MeetingDetailView";
import { MeetingLoadState } from "./detail/MeetingLoadState";
import { PersonalRoomHead } from "./personal-room/PersonalRoomHead";

/**
 * Portal meeting detail `/meeting/{number}[?id=]` (PRD §7.8): opened after Save and from Edit → Cancel.
 * The PMI renders like Zoom's Personal Room tab ("My Meetings - Zoom"); other meetings keep the
 * Schedule page head (back link + topic).
 */
export function MeetingDetailPage({ number }: { number: string }) {
  const { meeting, notFound, failed, retry } = useMeetingFromRoute(number);
  const personalRoom = meeting?.type === "pmi";
  useDocumentTitle(personalRoom ? "My Meetings - Zoom" : null);

  if (notFound) return <InvalidMeetingPage />;
  if (!meeting) return <MeetingLoadState failed={failed} onRetry={retry} />;
  return (
    <>
      {personalRoom ? <PersonalRoomHead /> : <PortalPageHead title={meeting.topic} backHref={routes.meetings()} />}
      <MeetingDetailView meeting={meeting} inset={personalRoom} />
    </>
  );
}
