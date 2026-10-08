"use client";

import { useRouter } from "next/navigation";
import { routes } from "@/shared/lib/routes";
import { useUpdatePmi } from "../api/scheduleMutations";
import type { ScheduleFormValues } from "../types";
import { toPmiRequest } from "../utils/formValues";
import { isPasscodeInvalid } from "../utils/passcode";
import { useSaveErrorToast } from "./useSaveErrorToast";
import { useSubmitLock } from "./useSubmitLock";

/** Edit PMI (PRD §7.7): `PATCH /api/meetings/pmi`, then back to `/meeting/{pmi}`; Cancel goes there too. */
export function usePmiSubmit(pmi: string, values: ScheduleFormValues) {
  const router = useRouter();
  const update = useUpdatePmi();
  const lock = useSubmitLock();
  const showError = useSaveErrorToast();
  const passcodeInvalid = isPasscodeInvalid(values);
  const openDetail = () => router.push(routes.meetingDetail(pmi));

  const save = () => {
    if (passcodeInvalid || !lock.acquire()) return;
    update.mutate(toPmiRequest(values), {
      onSuccess: openDetail,
      onError: (error) => {
        lock.release();
        showError(error);
      },
    });
  };

  return { save, cancel: openDetail, pending: update.isPending, passcodeInvalid };
}
