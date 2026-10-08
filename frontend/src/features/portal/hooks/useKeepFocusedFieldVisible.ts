"use client";

import { useEffect } from "react";
import { isOnScreenKeyboardOpen } from "@/shared/hooks/useOnScreenKeyboard";

/** the keyboard slides in over ≈250–300ms; check again once it has settled */
const SETTLE_MS = 320;

/** distance kept from the keyboard; the top margin is the page's scroll-padding (fixed header + 16) */
const MARGIN_BOTTOM = 16;

const scrollPaddingTop = () => parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;

/**
 * Phones (clone-only [D]): when the on-screen keyboard opens or the visual viewport changes while a
 * text field has focus, scroll that field back into the part of the page the keyboard leaves visible.
 */
export function useKeepFocusedFieldVisible() {
  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const reveal = () => {
      const field = document.activeElement;
      if (!(field instanceof HTMLElement) || !isOnScreenKeyboardOpen()) return;
      const rect = field.getBoundingClientRect();
      const top = viewport.offsetTop + scrollPaddingTop();
      const bottom = viewport.offsetTop + viewport.height - MARGIN_BOTTOM;
      // an open filter select goes to the top, so its menu has room between it and the keyboard
      const menuOpen = field.getAttribute("role") === "combobox" && field.getAttribute("aria-expanded") === "true";
      if (menuOpen || rect.top < top || rect.bottom > bottom) field.scrollIntoView({ block: menuOpen ? "start" : "center", inline: "nearest" });
    };
    const schedule = () => {
      clearTimeout(timer);
      timer = setTimeout(reveal, SETTLE_MS);
    };

    viewport.addEventListener("resize", schedule);
    document.addEventListener("focusin", schedule);
    return () => {
      clearTimeout(timer);
      viewport.removeEventListener("resize", schedule);
      document.removeEventListener("focusin", schedule);
    };
  }, []);
}
