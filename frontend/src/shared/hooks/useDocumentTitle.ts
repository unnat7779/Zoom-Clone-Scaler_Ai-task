"use client";

import { useEffect } from "react";

/**
 * Sets `document.title` while mounted (for titles that depend on loaded data, e.g. "Error - Zoom",
 * "My Meetings - Zoom") and restores the previous one afterwards. `null` leaves the title alone;
 * `delayMs` sets it later (the launch page's second title).
 */
export function useDocumentTitle(title: string | null, delayMs = 0): void {
  useEffect(() => {
    if (title === null) return;
    const previous = document.title;
    const apply = () => {
      document.title = title;
    };
    const timer = delayMs > 0 ? window.setTimeout(apply, delayMs) : undefined;
    if (timer === undefined) apply();
    return () => {
      window.clearTimeout(timer);
      document.title = previous;
    };
  }, [title, delayMs]);
}
