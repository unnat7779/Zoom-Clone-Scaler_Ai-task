"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { queryKeys, validateMeeting } from "@/shared/lib/api";
import { routes } from "@/shared/lib/routes";
import { type LeftReason, parseLeftReason } from "../utils/leftPage";

const MESSAGES: Record<LeftReason, string> = {
  left: "You have left the meeting.",
  ended: "This meeting has been ended by host.",
  removed: "You have been removed from this meeting by the host.",
};

/** `/wc/{n}/left` (PRD §7.11, DV9): message by reason; Rejoin only while the meeting is live and not removed. */
export function useLeftPage(number: string) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reason = parseLeftReason(searchParams.get("reason"));
  const pwd = searchParams.get("pwd");
  const validation = useQuery({
    queryKey: queryKeys.meetings.validation(number, pwd),
    queryFn: ({ signal }) => validateMeeting(number, pwd, signal),
    enabled: reason !== "removed",
    // the pre-join page may have cached this meeting as live: Rejoin needs the state after leaving
    staleTime: 0,
  });
  return {
    message: MESSAGES[reason],
    canRejoin: reason !== "removed" && Boolean(validation.data?.is_live),
    rejoin: () => router.push(routes.preJoin(number, { pwd })),
    goHome: () => router.push(routes.home()),
  };
}
