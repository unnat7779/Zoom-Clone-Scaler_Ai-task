"use client";

import { useCallback, useState } from "react";
import type { ScheduleFormValues, SetField } from "../types";

/** Field state of the Schedule / Edit form; `initial` is read once (mount the form after loading). */
export function useScheduleForm(initial: ScheduleFormValues) {
  const [values, setValues] = useState(initial);

  const set: SetField = useCallback((key, value) => setValues((previous) => ({ ...previous, [key]: value })), []);

  /** Start time from the select; accepted free times join the option list. */
  const setTime = useCallback((time: string, custom: boolean) => {
    setValues((previous) => ({
      ...previous,
      time,
      customTimes: custom && !previous.customTimes.includes(time) ? [...previous.customTimes, time] : previous.customTimes,
    }));
  }, []);

  const addInvitee = useCallback((email: string) => {
    setValues((previous) =>
      previous.invitees.includes(email) ? previous : { ...previous, invitees: [...previous.invitees, email] },
    );
  }, []);

  const removeInvitee = useCallback((email: string) => {
    setValues((previous) => ({ ...previous, invitees: previous.invitees.filter((item) => item !== email) }));
  }, []);

  return { values, set, setTime, addInvitee, removeInvitee };
}

/**
 * The form handle passed to rows. Row contract: a row that edits several fields takes `{ form }`;
 * a row bound to one value takes `value` + `onChange`; static rows take nothing.
 */
export type ScheduleFormApi = ReturnType<typeof useScheduleForm>;
