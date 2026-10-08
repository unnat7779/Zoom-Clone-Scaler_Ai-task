"use client";

import { type KeyboardEvent, useCallback, useEffect, useRef, useState } from "react";
import { useClickOutside, useEscapeKey } from "@/shared/hooks";

/** Zoom keeps the menu's top 20px below the viewport top, but never shrinks it under 160px. */
const VIEWPORT_GAP = 20;
const MIN_HEIGHT = 160;
/** whatever happens, the menu stays this far inside the viewport (critic C10) */
const EDGE = 8;

/**
 * Keeps the bottom-anchored popover menu on screen: caps its height (the list scrolls) so its top
 * stays below the viewport top, and shifts it sideways when it would run off an edge (narrow
 * screens that are not phones; phones get a bottom sheet instead).
 */
function fitToViewport(menu: HTMLElement): void {
  menu.style.maxHeight = "";
  menu.style.left = "";
  const { top, height, left, right } = menu.getBoundingClientRect();
  if (top < VIEWPORT_GAP) {
    const capped = Math.max(MIN_HEIGHT, height - (VIEWPORT_GAP - top));
    const topAfterCap = top + (height - capped);
    menu.style.maxHeight = `${topAfterCap < EDGE ? height - (EDGE - top) : capped}px`;
  }
  const overflowRight = right - (window.innerWidth - EDGE);
  const overflowLeft = EDGE - left;
  if (overflowRight > 0) menu.style.left = `${-Math.min(overflowRight, left - EDGE)}px`;
  else if (overflowLeft > 0) menu.style.left = `${overflowLeft}px`;
}

/**
 * Pre-join caret menu (`.preview__toggle` + `.preview__dropdown-menu`): the menu takes focus
 * when it opens; Escape or Tab closes it and focuses the caret again (Zoom's menu `onKeyDown`);
 * a click outside closes it. As a phone bottom sheet (`sheet`) it is not repositioned.
 */
export function usePreviewMenu(sheet: boolean) {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLUListElement | null>(null);
  const close = useCallback(() => setOpen(false), []);
  const closeToCaret = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  useClickOutside([toggleRef, menuRef], close, open);
  useEscapeKey(closeToCaret, open);

  useEffect(() => {
    const menu = menuRef.current;
    if (!open || !menu) return;
    menu.focus({ preventScroll: true });
    if (sheet) return;
    const fit = () => fitToViewport(menu);
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [open, sheet]);

  const onMenuKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "Tab") return;
    event.preventDefault();
    closeToCaret();
  };

  return { open, toggle: () => setOpen((value) => !value), close, toggleRef, menuRef, onMenuKeyDown };
}
