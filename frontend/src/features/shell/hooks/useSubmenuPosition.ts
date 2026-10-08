"use client";

import { type RefObject, useLayoutEffect } from "react";
import { MEDIA } from "@/shared/hooks/useMediaQuery";

/** 3px between a submenu and the panel it opens from (01-shell-home §7.2). */
const SUBMENU_GAP = 3;
/** top = row top − 12 (Status row 116.5 → submenu 104.5, 01-shell-home §7.2). */
const SUBMENU_INSET = 12;
/** Minimum gap to the viewport's top and bottom edges [D]. */
const VIEWPORT_MARGIN = 8;
/** Panels a submenu can open from: the root profile popover (role=dialog) or another submenu. */
const SUBMENU_PARENT_SELECTOR = '[data-profile-panel], [role="dialog"]';

/**
 * Places a profile submenu (`position: fixed`) to the left of the panel its row belongs to, top =
 * row top − 12 (e.g. Status 232×186 at (847, 104.5) at 1366×768). On the ≤768px sheet the inline
 * position is cleared and CSS makes it full screen.
 */
export function useSubmenuPosition(panelRef: RefObject<HTMLElement | null>, row: HTMLElement) {
  useLayoutEffect(() => {
    const panel = panelRef.current;
    const parent = row.parentElement?.closest<HTMLElement>(SUBMENU_PARENT_SELECTOR);
    if (!panel || !parent) return;

    const place = () => {
      const sheet = window.matchMedia(MEDIA.tablet).matches;
      // a short (landscape) viewport keeps the whole submenu on screen [D]
      const lowest = window.innerHeight - panel.offsetHeight - VIEWPORT_MARGIN;
      const top = Math.max(VIEWPORT_MARGIN, Math.min(row.getBoundingClientRect().top - SUBMENU_INSET, lowest));
      panel.style.top = sheet ? "" : `${top}px`;
      panel.style.left = sheet ? "" : `${parent.getBoundingClientRect().left - SUBMENU_GAP - panel.offsetWidth}px`;
    };

    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [panelRef, row]);
}
