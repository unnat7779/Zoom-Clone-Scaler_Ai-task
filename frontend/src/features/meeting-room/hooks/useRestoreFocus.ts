"use client";

import { type RefObject, useLayoutEffect } from "react";

/**
 * While `active`, remembers the element that had focus (the menu's trigger) and gives
 * focus back to it when the layer closes — unless the user already moved focus
 * somewhere else (another control, a dialog that opened from the menu).
 * A layout effect: it must read the trigger before the menu's autofocus (a passive effect) moves focus.
 */
export function useRestoreFocus(active: boolean, containerRef: RefObject<HTMLElement | null>): void {
  useLayoutEffect(() => {
    if (!active) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const container = containerRef.current;
    return () => {
      const focused = document.activeElement;
      const lost = !focused || focused === document.body || Boolean(container?.contains(focused));
      if (lost && previous?.isConnected) previous.focus({ preventScroll: true });
    };
  }, [active, containerRef]);
}
