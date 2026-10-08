"use client";

import { useIsClient } from "@/shared/hooks/useIsClient";
import { routes } from "@/shared/lib/routes";
import { PortalPageHead } from "@/shared/ui/PortalPageHead";
import { NewMeetingForm } from "./NewMeetingForm";

/** `/meeting/schedule` (PRD §7.6, DV4: same tab, portal look). */
export function SchedulePage() {
  // defaults depend on the browser clock and zone: build the form after hydration
  const isClient = useIsClient();
  return (
    <>
      <PortalPageHead title="Schedule Meeting" backHref={routes.meetings()} />
      {isClient ? <NewMeetingForm /> : null}
    </>
  );
}

