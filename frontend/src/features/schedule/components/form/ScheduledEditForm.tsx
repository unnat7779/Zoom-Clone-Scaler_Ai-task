"use client";

import { useState } from "react";
import { meetingRefOf } from "@/features/meetings";
import type { Meeting } from "@/shared/types/api";
import { editFormValues } from "../../utils/formValues";
import { ScheduleForm } from "./ScheduleForm";

/** Edit a scheduled meeting: the Schedule form prefilled from the meeting, saved with PATCH (PRD §7.7). */
export function ScheduledEditForm({ meeting, pmi }: { meeting: Meeting; pmi: string | null }) {
  const [initial] = useState(() => editFormValues(meeting));
  return <ScheduleForm initial={initial} editing={meetingRefOf(meeting)} pmi={pmi} />;
}
