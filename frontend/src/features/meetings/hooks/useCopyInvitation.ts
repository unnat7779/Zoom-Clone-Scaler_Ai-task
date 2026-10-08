"use client";

import { type MouseEvent, useCallback, useEffect, useRef, useState } from "react";
import type { MeetingRef } from "@/shared/lib/api";
import { useInvitationActions } from "@/shared/lib/api/invitation";

/** Clone-only: touch has no mouseleave, so the tooltip closes by itself [D]. */
const TOUCH_AUTO_CLOSE_MS = 2000;

/**
 * Meetings-tab Copy Invitation (PRD §7.4.5–7.4.6): fetch the invitation, copy it,
 * then show "Copied!" until the button loses the pointer or focus. Failures stay silent.
 */
export function useCopyInvitation({ number, id }: MeetingRef) {
  const invitation = useInvitationActions();
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mounted = useRef(true);

  const clearTimer = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      clearTimer();
    };
  }, []);

  const copy = useCallback(
    async (event: MouseEvent<HTMLButtonElement>) => {
      const isTouch = (event.nativeEvent as PointerEvent).pointerType === "touch";
      // Zoom gives no feedback when copying fails; the row may have been deselected while the request ran
      if (!(await invitation.copy({ number, id })) || !mounted.current) return;
      setCopied(true);
      clearTimer();
      if (isTouch) timer.current = setTimeout(() => setCopied(false), TOUCH_AUTO_CLOSE_MS);
    },
    [invitation, number, id],
  );

  const dismiss = useCallback(() => {
    clearTimer();
    setCopied(false);
  }, []);

  return { copied, copy, dismiss };
}
