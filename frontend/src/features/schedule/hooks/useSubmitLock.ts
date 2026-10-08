"use client";

import { useCallback, useMemo, useRef } from "react";

/**
 * Synchronous re-entry guard for Save (PRD §7.6.7 "ignores clicks while submitting"). A ref, not
 * render state: a second click that lands before React re-renders still sees the first one.
 * Release it on failure only — after a success the page navigates away, so stray clicks stay ignored.
 */
export function useSubmitLock() {
  const locked = useRef(false);
  const acquire = useCallback(() => {
    if (locked.current) return false;
    locked.current = true;
    return true;
  }, []);
  const release = useCallback(() => {
    locked.current = false;
  }, []);
  return useMemo(() => ({ acquire, release }), [acquire, release]);
}
