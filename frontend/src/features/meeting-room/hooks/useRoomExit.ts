"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { clearMeetingSession } from "@/shared/lib/meetingSession";
import { routes } from "@/shared/lib/routes";
import { useToast } from "@/shared/ui";
import { useMeetingRoom } from "../realtime/useMeetingRoom";
import { type LeftReason, invitePwd } from "../utils/leftPage";
import { forgetRoomSession } from "./useRoomSession";

/**
 * Where the tab goes when the meeting is over for it (PRD §8.1, §8.14): in-shell →
 * `/wc/home`; full viewport → `/wc/{n}/left`. "ended" / "duplicate" / "failed" wait for their dialog's OK.
 */
export function useRoomExit() {
  const router = useRouter();
  const toast = useToast();
  const { number, inShell, phase, meeting } = useMeetingRoom();
  const pwd = invitePwd(meeting?.invite_url);

  const exit = useCallback(
    (reason: LeftReason | "home") => {
      clearMeetingSession(number);
      forgetRoomSession(number);
      router.replace(inShell || reason === "home" ? routes.home() : routes.left(number, { reason, pwd }));
    },
    [inShell, number, pwd, router],
  );

  useEffect(() => {
    if (phase === "left") exit("left");
    if (phase === "removed") {
      if (inShell) toast.show({ message: "You have been removed from this meeting by the host.", kind: "info" });
      exit("removed");
    }
  }, [phase, exit, inShell, toast]);

  return exit;
}
