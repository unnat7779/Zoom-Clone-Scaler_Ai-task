"use client";

import { useMemo } from "react";
import { queryOptions, useQuery, useQueryClient } from "@tanstack/react-query";
import { copyText } from "@/shared/hooks/useClipboard";
import { type MeetingRef, getMeetingInvitation } from "./meetings";
import { queryKeys } from "./queryKeys";

/** Meeting mutations invalidate `queryKeys.meetings.all`, so the text can be reused for a minute. */
const INVITATION_STALE_MS = 60_000;

/**
 * The one invitation query (`GET /api/meetings/{n}/invitation[?id=]`, PRD §10.5, CRLF text), shared by
 * the Home PMI submenu and calendar card, the Meetings tab / portal detail and the room's Invite window.
 */
const invitationQuery = (ref: MeetingRef) =>
  queryOptions({
    queryKey: queryKeys.meetings.invitation(ref.number, ref.id),
    queryFn: ({ signal }) => getMeetingInvitation(ref, signal),
    staleTime: INVITATION_STALE_MS,
  });

/** Invitation text of one meeting; `enabled: false` defers the request until it is first shown. */
export function useMeetingInvitation(ref: MeetingRef, { enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({ ...invitationQuery(ref), enabled });
}

/**
 * Copy Invitation on the same cache entry: `prefetch` warms it when a menu opens, `copy` fetches
 * (or reuses) the text and puts it on the clipboard, resolving false when either step fails.
 * Stable across renders.
 */
export function useInvitationActions() {
  const queryClient = useQueryClient();
  return useMemo(
    () => ({
      prefetch: (ref: MeetingRef) => void queryClient.prefetchQuery(invitationQuery(ref)),
      copy: (ref: MeetingRef): Promise<boolean> =>
        queryClient
          .fetchQuery(invitationQuery(ref))
          .then(({ text }) => copyText(text))
          .catch(() => false),
    }),
    [queryClient],
  );
}
