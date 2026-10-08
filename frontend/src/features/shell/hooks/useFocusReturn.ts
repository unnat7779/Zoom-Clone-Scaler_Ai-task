"use client";

import { type RefObject, useEffect, useRef } from "react";

/**
 * When a popover closes and takes the focused element with it (Escape, a row that opens a dialog,
 * ⌘K), focus goes back to its trigger instead of `<body>` — so a dialog opened from the popover
 * also returns focus there. Runs before the shell dialogs' own focus handling (the header renders
 * first), and leaves focus alone if it already moved somewhere else.
 */
export function useFocusReturn(open: boolean, triggerRef: RefObject<HTMLElement | null>): void {
  const wasOpen = useRef(open);
  useEffect(() => {
    const closed = wasOpen.current && !open;
    wasOpen.current = open;
    if (!closed) return;
    const active = document.activeElement;
    if (!active || active === document.body) triggerRef.current?.focus({ preventScroll: true });
  }, [open, triggerRef]);
}
