"use client";

import { useEffect } from "react";

let locks = 0;
let previousOverflow = "";
let previousPaddingRight = "";

/** Exposes the removed scrollbar's width to fixed elements (e.g. the portal header: `right: var(…)`). */
export const SCROLL_LOCK_GAP_VAR = "--scroll-lock-gap";

/**
 * Prevents the document from scrolling while `active` (modals). Nested locks are counted. Like
 * Element's `lock-scroll`, the body is padded by the scrollbar width it hides, so the page does
 * not shift sideways; `--scroll-lock-gap` lets fixed bars do the same.
 */
export function useScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) return;
    if (locks === 0) {
      const { body, documentElement } = document;
      const gap = window.innerWidth - documentElement.clientWidth;
      previousOverflow = body.style.overflow;
      previousPaddingRight = body.style.paddingRight;
      body.style.overflow = "hidden";
      if (gap > 0) {
        body.style.paddingRight = `${gap}px`;
        documentElement.style.setProperty(SCROLL_LOCK_GAP_VAR, `${gap}px`);
      }
    }
    locks += 1;
    return () => {
      locks -= 1;
      if (locks > 0) return;
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      document.documentElement.style.removeProperty(SCROLL_LOCK_GAP_VAR);
    };
  }, [active]);
}
