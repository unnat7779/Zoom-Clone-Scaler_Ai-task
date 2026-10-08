"use client";

import { type RefObject, useEffect, useState } from "react";

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

const MAX_MOUNT_CHECKS = 10;

/** Visible elements Tab can reach (buttons taken out of the tab order with tabindex="-1" are skipped). */
export const getFocusable = (root: HTMLElement): HTMLElement[] =>
  Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => el.tabIndex >= 0 && el.getClientRects().length > 0,
  );

export interface FocusTrapOptions {
  /** Element focused on activation; defaults to the first focusable, else the container. */
  initialFocusRef?: RefObject<HTMLElement | null>;
  /** Return focus to the previously focused element on deactivation (default true). */
  restoreFocus?: boolean;
}

/** Keeps Tab / Shift+Tab inside `containerRef` while `active`. */
export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  active: boolean,
  { initialFocusRef, restoreFocus = true }: FocusTrapOptions = {},
): void {
  // A dialog that is open on first render is portalled in after hydration, so the ref can
  // still be empty when this effect first runs: re-check on the next frame until it mounts.
  const [mountTick, setMountTick] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (active && !container && mountTick < MAX_MOUNT_CHECKS) {
      const frame = requestAnimationFrame(() => setMountTick((tick) => tick + 1));
      return () => cancelAnimationFrame(frame);
    }
    if (!active || !container) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const initial = initialFocusRef?.current ?? getFocusable(container)[0] ?? container;
    initial.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const items = getFocusable(container);
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) {
        event.preventDefault();
        return;
      }
      const current = document.activeElement;
      if (event.shiftKey && (current === first || !container.contains(current))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (current === last || !container.contains(current))) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (restoreFocus && previouslyFocused?.isConnected) previouslyFocused.focus({ preventScroll: true });
    };
  }, [active, containerRef, initialFocusRef, restoreFocus, mountTick]);
}
