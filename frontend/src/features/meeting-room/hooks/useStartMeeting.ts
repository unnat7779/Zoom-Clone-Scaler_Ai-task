"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { isApiError, startMeeting } from "@/shared/lib/api";
import { useCurrentUser } from "@/shared/lib/api/useCurrentUser";
import { getClientId } from "@/shared/lib/identity";
import { saveMeetingSession } from "@/shared/lib/meetingSession";
import { FROM_PWA_PARAM, routes } from "@/shared/lib/routes";
import type { MeetingSession } from "@/shared/types/api";

/** One request per meeting even when React StrictMode runs the effect twice. */
const inFlight = new Map<string, Promise<MeetingSession>>();

/** [D] copy for start failures (the room has no measured error states for the host path). */
function startErrorMessage(error: unknown): string {
  if (isApiError(error, "MEETING_FULL")) return "This meeting has reached the maximum number of participants.";
  if (isApiError(error, "REMOVED")) return "You are unable to rejoin this meeting because you were previously removed by the host";
  if (isApiError(error) && error.status === 404) return "This meeting link is invalid (3,001)";
  return "Unable to start the meeting. Please check your network connection and try again.";
}

/**
 * `/wc/{n}/start` (PRD §7.3): host path — `POST /start` (with `?id=` for a PMI calendar
 * entry), save the hand-off (mic muted, video off), then replace the URL with the room.
 */
export function useStartMeeting(number: string) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromPWA = searchParams.get(FROM_PWA_PARAM) === "1";
  const idParam = searchParams.get("id");
  const meetingId = idParam && /^\d+$/.test(idParam) ? Number(idParam) : undefined;
  const { user } = useCurrentUser();
  const displayName = user?.display_name;
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!displayName) return;
    let cancelled = false;
    const key = `${number}#${meetingId ?? ""}`;
    const request = inFlight.get(key) ?? startMeeting(number, { client_id: getClientId(), display_name: displayName }, meetingId);
    inFlight.set(key, request);
    request
      .then((session) => {
        inFlight.delete(key);
        if (cancelled) return;
        saveMeetingSession(number, session, { audioMuted: true, videoOn: false });
        router.replace(routes.room(number, { fromPWA }));
      })
      .catch((cause: unknown) => {
        inFlight.delete(key);
        if (!cancelled) setError(startErrorMessage(cause));
      });
    return () => {
      cancelled = true;
    };
  }, [displayName, number, meetingId, fromPWA, router]);

  return { error, inShell: fromPWA, goHome: () => router.replace(routes.home()) };
}
