"use client";

import { useCallback, useMemo } from "react";
import { useClock } from "@/shared/hooks/useClock";
import { usePmiMeeting, useUpcomingMeetings } from "../api/meetingQueries";
import type { UpcomingSelection } from "../types";
import { groupUpcoming, upcomingKey } from "../utils/grouping";

/**
 * Data of Meetings → Upcoming: PMI card, day groups and the selected entry.
 * Default selection (PRD §7.4.2): `?select=` when it matches, else the first
 * meeting, else the PMI card.
 */
export function useUpcomingView(selectKey: string | null) {
  const now = useClock("minute");
  const list = useUpcomingMeetings();
  const pmi = usePmiMeeting();

  const groups = useMemo(() => (list.data && now ? groupUpcoming(list.data, now) : []), [list.data, now]);
  const items = useMemo(() => groups.flatMap((group) => group.items), [groups]);
  const pmiMeeting = pmi.data ?? null;
  const pmiKey = pmiMeeting?.meeting_number ?? null;

  const selected = useMemo<UpcomingSelection | null>(() => {
    const byKey = (key: string | null) => items.find((item) => upcomingKey(item) === key);
    const item = byKey(selectKey) ?? (selectKey === pmiKey ? undefined : items[0]);
    if (item) return { kind: "meeting", key: upcomingKey(item), meeting: item };
    return pmiMeeting && pmiKey ? { kind: "pmi", key: pmiKey, meeting: pmiMeeting } : null;
  }, [items, pmiKey, pmiMeeting, selectKey]);

  /** Entry to select after `key` is deleted: the next row, else the previous one, else the PMI. */
  const keyAfterRemoving = useCallback(
    (key: string): string | undefined => {
      const index = items.findIndex((item) => upcomingKey(item) === key);
      const neighbour = items[index + 1] ?? items[index - 1];
      return neighbour ? upcomingKey(neighbour) : (pmiKey ?? undefined);
    },
    [items, pmiKey],
  );

  const { refetch: refetchList } = list;
  const { refetch: refetchPmi } = pmi;
  const refetch = useCallback(() => Promise.all([refetchList(), refetchPmi()]), [refetchList, refetchPmi]);

  return {
    loading: list.isPending || pmi.isPending,
    failed: list.isError,
    groups,
    pmi: pmiMeeting,
    selected,
    keyAfterRemoving,
    refetch,
  };
}
