"use client";

import { useRouter } from "next/navigation";
import { meetingRefOf } from "@/features/meetings";
import { type MeetingRef, isApiError } from "@/shared/lib/api";
import { routes } from "@/shared/lib/routes";
import type { Meeting } from "@/shared/types/api";
import { useScheduleMeeting, useUpdateMeeting } from "../api/scheduleMutations";
import type { ScheduleFormValues } from "../types";
import { toScheduleRequest, toUpdateRequest } from "../utils/formValues";
import { useSaveErrorToast } from "./useSaveErrorToast";
import type { ScheduleValidation } from "./useScheduleValidation";
import { useSubmitLock } from "./useSubmitLock";

interface UseScheduleSubmitArgs {
  /** null → create (`POST`), else edit (`PATCH`) */
  editing: MeetingRef | null;
  values: ScheduleFormValues;
  validation: ScheduleValidation;
}

/**
 * Save (PRD §7.6.7): validate, POST / PATCH, then open the meeting detail page. A ref lock ignores
 * repeat clicks until the request fails. `START_IN_PAST` shows under "When"; other API errors
 * (the rest is validated before sending) show the error message bar.
 */
export function useScheduleSubmit({ editing, values, validation }: UseScheduleSubmitArgs) {
  const router = useRouter();
  const create = useScheduleMeeting();
  const update = useUpdateMeeting();
  const lock = useSubmitLock();
  const showError = useSaveErrorToast();

  const openDetail = (meeting: Meeting) => {
    const ref = meetingRefOf(meeting);
    router.push(routes.meetingDetail(ref.number, { id: ref.id }));
  };

  const onError = (error: Error) => {
    lock.release();
    if (isApiError(error, "START_IN_PAST")) validation.flagStartPassed();
    else showError(error);
  };

  const save = () => {
    if (!lock.acquire()) return;
    if (!validation.validateAll(new Date())) return lock.release();
    if (editing) update.mutate({ ref: editing, body: toUpdateRequest(values) }, { onSuccess: openDetail, onError });
    else create.mutate(toScheduleRequest(values), { onSuccess: openDetail, onError });
  };

  const cancel = () => router.push(editing ? routes.meetingDetail(editing.number, { id: editing.id }) : routes.meetings());

  return { save, cancel, pending: create.isPending || update.isPending };
}
