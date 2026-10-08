"use client";

import { InvalidMeetingPage, MeetingLoadState, useMeetingFromRoute } from "@/features/meetings";
import { useCurrentUser } from "@/shared/lib/api/useCurrentUser";
import { routes } from "@/shared/lib/routes";
import { PortalPageHead } from "@/shared/ui/PortalPageHead";
import { PmiEditForm } from "./form/PmiEditForm";
import { ScheduledEditForm } from "./form/ScheduledEditForm";

/** `/meeting/{number}/edit[?id=]` (PRD §7.7): the Schedule form prefilled, or the Personal Meeting Room form. */
export function EditMeetingPage({ number }: { number: string }) {
  const { meeting, notFound, failed, retry } = useMeetingFromRoute(number);
  const { user } = useCurrentUser();

  // instant meetings have nothing to edit (the API answers NOT_SCHEDULED)
  if (notFound || meeting?.type === "instant") return <InvalidMeetingPage />;
  if (!meeting) return <MeetingLoadState failed={failed} onRetry={retry} />;
  return (
    <>
      <PortalPageHead title={`Edit "${meeting.topic}"`} backHref={routes.meetings()} />
      {meeting.type === "pmi" ? <PmiEditForm meeting={meeting} /> : <ScheduledEditForm meeting={meeting} pmi={user?.pmi ?? null} />}
    </>
  );
}
