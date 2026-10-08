"use client";

import { useSyncExternalStore } from "react";

/** the visual viewport must lose at least this much height before we call it a keyboard (not browser chrome) */
const KEYBOARD_MIN_HEIGHT = 150;

const TEXT_ENTRY = "input:not([type=checkbox], [type=radio], [type=button], [type=submit], [type=reset]), textarea, [contenteditable=true]";

/**
 * True while a phone's on-screen keyboard covers part of the page: a text field has focus and the
 * visual viewport is much shorter than the layout viewport (iOS Safari and Chrome ≥108 only shrink
 * the visual viewport). Pinch zoom is factored out through `visualViewport.scale`.
 */
export function isOnScreenKeyboardOpen(): boolean {
  const viewport = window.visualViewport;
  if (!viewport || !document.activeElement?.matches(TEXT_ENTRY)) return false;
  return window.innerHeight - viewport.height * viewport.scale > KEYBOARD_MIN_HEIGHT;
}

/** Calls `onChange` whenever the keyboard may have opened or closed. */
export function subscribeOnScreenKeyboard(onChange: () => void): () => void {
  const viewport = window.visualViewport;
  viewport?.addEventListener("resize", onChange);
  window.addEventListener("resize", onChange);
  document.addEventListener("focusin", onChange);
  document.addEventListener("focusout", onChange);
  return () => {
    viewport?.removeEventListener("resize", onChange);
    window.removeEventListener("resize", onChange);
    document.removeEventListener("focusin", onChange);
    document.removeEventListener("focusout", onChange);
  };
}

/** Live `isOnScreenKeyboardOpen()`; false while server rendering. */
export function useOnScreenKeyboard(): boolean {
  return useSyncExternalStore(subscribeOnScreenKeyboard, isOnScreenKeyboardOpen, () => false);
}
