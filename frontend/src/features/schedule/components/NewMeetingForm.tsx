"use client";

import { useState } from "react";
import { useCurrentUser } from "@/shared/lib/api/useCurrentUser";
import { getBrowserTimeZone } from "@/shared/lib/format";
import { createFormValues } from "../utils/formValues";
import { defaultTimeZone } from "../utils/timeZones";
import { ScheduleForm } from "./form/ScheduleForm";

/** Schedule form with Zoom's defaults: today at the next half-hour in the browser's zone. */
export function NewMeetingForm() {
  const { user } = useCurrentUser();
  const [initial] = useState(() => {
    const now = new Date();
    return createFormValues(now, defaultTimeZone(getBrowserTimeZone(), user?.timezone ?? "UTC", now));
  });
  return <ScheduleForm initial={initial} editing={null} pmi={user?.pmi ?? null} />;
}
