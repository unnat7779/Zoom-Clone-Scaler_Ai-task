"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { type StoredMeetingSession, loadMeetingSession } from "@/shared/lib/meetingSession";
import { FROM_PWA_PARAM, routes } from "@/shared/lib/routes";

const noSubscription = () => () => undefined;
const cache = new Map<string, StoredMeetingSession | null>();

/** sessionStorage read once per page load (stable object for useSyncExternalStore). */
function readSession(number: string): StoredMeetingSession | null {
  if (!cache.has(number)) cache.set(number, loadMeetingSession(number));
  return cache.get(number) ?? null;
}

/** Forget the cached hand-off so a later visit reads sessionStorage again. */
export function forgetRoomSession(number: string): void {
  cache.delete(number);
}

/**
 * The start/join hand-off for this tab (`shared/lib/meetingSession`). Without one,
 * the room sends the user to the pre-join page.
 */
export function useRoomSession(number: string) {
  const router = useRouter();
  const inShell = useSearchParams().get(FROM_PWA_PARAM) === "1";
  const session = useSyncExternalStore(
    noSubscription,
    () => readSession(number),
    () => undefined,
  );

  useEffect(() => {
    if (session === null) router.replace(routes.preJoin(number, { fromPWA: inShell }));
  }, [session, number, inShell, router]);

  return { session: session ?? null, inShell };
}
