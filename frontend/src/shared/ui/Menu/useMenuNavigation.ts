"use client";

import { type KeyboardEvent, type RefObject, useCallback, useEffect } from "react";

const ITEM_SELECTOR = '[role="menuitem"]:not([aria-disabled="true"]),[role="menuitemcheckbox"]:not([aria-disabled="true"]),[role="menuitemradio"]:not([aria-disabled="true"])';

/**
 * Roving keyboard focus for a menu: ArrowUp/ArrowDown wrap, Home/End jump.
 * With `autoFocus`, the first item is focused when the menu mounts.
 */
export function useMenuNavigation(menuRef: RefObject<HTMLElement | null>, autoFocus: boolean) {
  useEffect(() => {
    if (!autoFocus) return;
    menuRef.current?.querySelector<HTMLElement>(ITEM_SELECTOR)?.focus({ preventScroll: true });
  }, [autoFocus, menuRef]);

  return useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      const menu = menuRef.current;
      if (!menu || !["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
      const items = Array.from(menu.querySelectorAll<HTMLElement>(ITEM_SELECTOR));
      if (items.length === 0) return;
      event.preventDefault();
      const current = items.indexOf(document.activeElement as HTMLElement);
      const last = items.length - 1;
      const next =
        event.key === "Home" ? 0
        : event.key === "End" ? last
        : event.key === "ArrowDown" ? (current >= last ? 0 : current + 1)
        : current <= 0 ? last : current - 1;
      items[next]?.focus();
    },
    [menuRef],
  );
}
