"use client";

import { useEffect, useEffectEvent, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { joinMeeting, queryKeys } from "@/shared/lib/api";
import { useCurrentUser } from "@/shared/lib/api/useCurrentUser";
import { getClientId } from "@/shared/lib/identity";
import { addJoinHistoryEntry } from "@/shared/lib/joinHistory";
import { type MeetingEntryPreferences, saveMeetingSession } from "@/shared/lib/meetingSession";
import { routes } from "@/shared/lib/routes";
import type { JoinMeetingRequest, MeetingValidation } from "@/shared/types/api";
import { toJoinFailure } from "../utils/joinErrors";
import { isWaitingForHost, needsPasscode } from "../utils/preJoinStage";
import { setRememberedName } from "../utils/rememberedName";
import { type PreJoinForm, usePreJoinForm } from "./usePreJoinForm";
import { usePreJoinParams } from "./usePreJoinParams";

interface PreJoinEntryOptions {
  number: string;
  validation: MeetingValidation;
  /** re-run validate (polls every 5 s while the meeting waits for its host) */
  revalidate: () => void;
  /** mic/camera state and devices handed to the room (PRD §7.10.1 step 3) */
  entryPreferences: () => MeetingEntryPreferences;
}

export interface PreJoinEntry {
  form: PreJoinForm;
  submit: () => void;
  /** `POST /join` in flight (or done, while the room route loads) */
  joining: boolean;
  /** Join answered MEETING_NOT_STARTED: the guest waits and is let in once the host starts */
  onHold: boolean;
  /** "Exit" while on hold */
  leave: () => void;
}

/**
 * Join (PRD §7.10.1 steps 3–4): `POST /join` → remember the name, add the join history, hand
 * the session + mic/camera/speaker choices to the room and replace the URL with the room
 * (keeping `fromPWA`). Like Zoom, a meeting that has not started holds the guest after Join
 * and joins automatically once validate reports it live.
 */
export function usePreJoinEntry({ number, validation, revalidate, entryPreferences }: PreJoinEntryOptions): PreJoinEntry {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { pwd, inShell } = usePreJoinParams();
  const { user } = useCurrentUser();
  // in the shell the Workplace user is signed in: their account name, no "Remember my name"
  const form = usePreJoinForm(needsPasscode(validation), inShell ? (user?.display_name ?? "") : null);
  const [onHold, setOnHold] = useState(false);
  const mutation = useMutation({ mutationFn: (body: JoinMeetingRequest) => joinMeeting(number, body) });
  const joining = mutation.isPending || mutation.isSuccess;

  // Built at send time: the form is hidden while on hold, but the mic/camera can still change there.
  const join = () => {
    const preferences = entryPreferences();
    const body: JoinMeetingRequest = {
      client_id: getClientId(),
      display_name: form.name.trim(),
      pwd,
      passcode: form.passcodeShown ? form.passcode.trim() : null,
      audio_muted: preferences.audioMuted,
      video_on: preferences.videoOn,
    };
    mutation.mutate(body, {
      onSuccess: (session) => {
        if (form.rememberShown) setRememberedName(form.rememberName ? body.display_name : null);
        addJoinHistoryEntry({ number, topic: validation.topic ?? "" });
        saveMeetingSession(number, session, preferences);
        // the left page must ask validate again instead of reusing this page's answer
        void queryClient.invalidateQueries({ queryKey: queryKeys.meetings.validation(number, pwd), refetchType: "none" });
        router.replace(routes.room(number, { fromPWA: inShell }));
      },
      onError: (error) => {
        const failure = toJoinFailure(error);
        if (failure.kind === "waiting") setOnHold(true);
        if (failure.kind !== "form") return revalidate();
        setOnHold(false);
        if (failure.showPasscode) form.revealPasscode();
        form.setErrors(failure.errors);
      },
    });
  };

  // on hold, Join is sent again once, when validate reports that the host has started
  const startedWhileHeld = onHold && !isWaitingForHost(validation);
  const rejoinHeld = useEffectEvent(() => {
    if (!mutation.isPending) join();
  });
  useEffect(() => {
    if (startedWhileHeld) rejoinHeld();
  }, [startedWhileHeld]);

  const submit = () => {
    if (!form.canSubmit || joining || onHold) return;
    form.setErrors({});
    join();
  };

  const leave = () => {
    setOnHold(false);
    router.push(inShell ? routes.home() : routes.left(number, { reason: "left", pwd }));
  };

  return { form, submit, joining, onHold, leave };
}
