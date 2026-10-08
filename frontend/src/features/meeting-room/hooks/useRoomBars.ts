"use client";

import { type PointerEvent, useCallback, useEffect, useRef, useState } from "react";

/** PRD §8.5.6 [M JS]: hide 3000 ms after the last mousemove; the handler is throttled to 1000 ms. */
const AUTO_HIDE_MS = 3000;
const THROTTLE_MS = 1000;
/** a touch that moved further than this is a swipe (gallery paging), not a tap */
const TAP_SLOP = 10;
/** taps on these keep the bars up instead of toggling them */
const CONTROL_SELECTOR = "button, a, input, select, textarea, [role='menu'], [role='dialog'], [role='toolbar']";

interface RoomBarsOptions {
  /** keep the bars up: a menu / the leave bar is open, the pointer is on the toolbar, Ctrl+\ is on */
  pinned: boolean;
  onToggleAlwaysShow: () => void;
}

/**
 * Visibility of the room header + toolbar: auto-hide after mouse moves, Ctrl+\ "always show
 * meeting controls", and on touch screens a tap on the stage toggles them (PRD §8.5.6 [D]); a tap
 * shows them for the same 3 s, and a swipe (gallery paging) leaves them as they are.
 */
export function useRoomBars({ pinned, onToggleAlwaysShow }: RoomBarsOptions) {
  const [active, setActive] = useState(true);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const trailingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastRun = useRef(0);
  const touchStart = useRef<{ x: number; y: number; pinned: boolean } | null>(null);
  const pinnedRef = useRef(pinned);

  const restart = useCallback(() => {
    lastRun.current = Date.now();
    setActive(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setActive(false), AUTO_HIDE_MS);
  }, []);

  const hide = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setActive(false);
  }, []);

  /** mouse / pen moves (touch is handled by taps: its compatibility mousemove would always show the bars) */
  const onPointerMove = useCallback(
    (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const wait = THROTTLE_MS - (Date.now() - lastRun.current);
      if (wait <= 0) restart();
      else if (!trailingTimer.current) {
        trailingTimer.current = setTimeout(() => {
          trailingTimer.current = null;
          restart();
        }, wait);
      }
    },
    [restart],
  );

  const onPointerUp = useCallback(
    (event: PointerEvent) => {
      const start = touchStart.current;
      touchStart.current = null;
      if (event.pointerType !== "touch") return;
      if (start && Math.hypot(event.clientX - start.x, event.clientY - start.y) > TAP_SLOP) return;
      const onControl = event.target instanceof Element && event.target.closest(CONTROL_SELECTOR);
      if (onControl || start?.pinned || !active) restart();
      else hide();
    },
    [active, restart, hide],
  );

  useEffect(() => {
    pinnedRef.current = pinned;
  }, [pinned]);

  /**
   * Where a touch starts, and whether a menu / sheet pinned the bars at that moment (a tap that
   * dismisses it keeps the bars up). Window capture runs before the menus' outside-click close.
   */
  useEffect(() => {
    const onPointerDown = (event: globalThis.PointerEvent) => {
      touchStart.current = event.pointerType === "touch" ? { x: event.clientX, y: event.clientY, pinned: pinnedRef.current } : null;
    };
    window.addEventListener("pointerdown", onPointerDown, true);
    return () => window.removeEventListener("pointerdown", onPointerDown, true);
  }, []);

  useEffect(() => {
    hideTimer.current = setTimeout(() => setActive(false), AUTO_HIDE_MS);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "\\") {
        event.preventDefault();
        onToggleAlwaysShow();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      if (hideTimer.current) clearTimeout(hideTimer.current);
      if (trailingTimer.current) clearTimeout(trailingTimer.current);
    };
  }, [onToggleAlwaysShow]);

  return { visible: active || pinned, onPointerMove, onPointerUp };
}
