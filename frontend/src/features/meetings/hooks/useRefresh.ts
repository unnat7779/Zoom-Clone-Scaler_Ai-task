"use client";

import { useCallback, useRef, useState } from "react";

/** Zoom debounces the Meetings refresh button for 3000 ms (02-meetings.md §A.2). */
const REFRESH_DEBOUNCE_MS = 3000;
/**
 * Zoom's spinner stays until `/wc/pwa-meeting/list` answers (~360 ms); the local API answers in a
 * few ms, so keep it up at least this long instead of a one-frame flash [D].
 */
const MIN_SPINNER_MS = 300;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Header refresh: ignores clicks for 3 s after the last accepted one and
 * reports `refreshing` until the lists come back (both panes show the spinner).
 */
export function useRefresh(refetch: () => Promise<unknown>) {
  const [refreshing, setRefreshing] = useState(false);
  const lastRun = useRef(0);

  const refresh = useCallback(async () => {
    const now = Date.now();
    if (now - lastRun.current < REFRESH_DEBOUNCE_MS) return;
    lastRun.current = now;
    setRefreshing(true);
    try {
      await Promise.all([refetch(), delay(MIN_SPINNER_MS)]);
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  return { refreshing, refresh };
}
