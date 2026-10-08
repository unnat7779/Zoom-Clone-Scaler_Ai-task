"use client";

import { useMemo } from "react";
import { useClock } from "@/shared/hooks/useClock";
import { usePreviousMeetings } from "../api/meetingQueries";
import type { PreviousSelection } from "../types";
import { groupPrevious } from "../utils/grouping";

/** Data of Meetings → Previous (DV3): ended instances grouped by day; `?select=` is the instance uuid. */
export function usePreviousView(selectKey: string | null) {
  const now = useClock("minute");
  const list = usePreviousMeetings();
  const groups = useMemo(() => (list.data && now ? groupPrevious(list.data, now) : []), [list.data, now]);

  const selected = useMemo<PreviousSelection | null>(() => {
    const items = groups.flatMap((group) => group.items);
    const instance = items.find((item) => item.uuid === selectKey) ?? items[0];
    return instance ? { key: instance.uuid, instance } : null;
  }, [groups, selectKey]);

  return { loading: list.isPending, failed: list.isError, groups, selected, refetch: list.refetch };
}
