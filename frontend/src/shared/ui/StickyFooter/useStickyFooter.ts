"use client";

import { type RefObject, useLayoutEffect, useState } from "react";
import { isOnScreenKeyboardOpen, subscribeOnScreenKeyboard } from "@/shared/hooks/useOnScreenKeyboard";

export interface StickyFooterState {
  /** the in-flow slot is not fully visible → the bar is pinned to the viewport bottom */
  fixed: boolean;
  /** slot left / width in viewport px (the fixed bar keeps the column's box) */
  left: number;
  width: number;
}

/**
 * Zoom's JS sticky footer (`zoom-sticky` / `zm-sticky`): the bar is `position: fixed;
 * bottom: 0` while its natural slot is below the fold and becomes static once the user
 * scrolls to it. Re-evaluated on scroll, resize and whenever the page grows or shrinks.
 * While a phone's on-screen keyboard is up the bar stays in its slot, so it never floats over
 * the field being typed in (clone-only [D]).
 */
export function useStickyFooter(slotRef: RefObject<HTMLElement | null>): StickyFooterState {
  const [state, setState] = useState<StickyFooterState>({ fixed: false, left: 0, width: 0 });

  useLayoutEffect(() => {
    const slot = slotRef.current;
    if (!slot) return;
    const update = () => {
      const rect = slot.getBoundingClientRect();
      const belowFold = Math.round(rect.bottom) > window.innerHeight;
      const next = { fixed: belowFold && !isOnScreenKeyboardOpen(), left: rect.left, width: rect.width };
      setState((prev) => (prev.fixed === next.fixed && prev.left === next.left && prev.width === next.width ? prev : next));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(document.body);
    observer.observe(slot);
    window.addEventListener("scroll", update, { passive: true });
    const unsubscribe = subscribeOnScreenKeyboard(update);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", update);
      unsubscribe();
    };
  }, [slotRef]);

  return state;
}
