"use client";

import { type RefObject, useEffect } from "react";
import { ROOM_FRAME_SELECTOR } from "./useRoomAnchor";

/** Presses on these never start a drag, even inside the handle. */
const INTERACTIVE = "button, a, input, select, textarea, [role='tab']";

/**
 * Zoom's `react-draggable` windows (PRD §8.17, spec 05 §8.1): pressing the window's header (any
 * element matching `handleSelector`, except its controls) and moving drags the window, kept inside
 * the room. The offset is a CSS `translate`, so the window's own layout is untouched and it opens
 * at its default place again next time.
 */
export function useDragWindow(windowRef: RefObject<HTMLElement | null>, handleSelector: string, enabled = true): void {
  useEffect(() => {
    const element = windowRef.current;
    if (!element || !enabled) return;
    let offset = { x: 0, y: 0 };
    let drag: { startX: number; startY: number; base: { x: number; y: number }; bounds: DOMRect; box: DOMRect } | null = null;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Element | null;
      if (event.button !== 0 || !target?.closest(handleSelector) || target.closest(INTERACTIVE)) return;
      const frame = element.closest(ROOM_FRAME_SELECTOR);
      drag = {
        startX: event.clientX,
        startY: event.clientY,
        base: offset,
        bounds: frame?.getBoundingClientRect() ?? new DOMRect(0, 0, window.innerWidth, window.innerHeight),
        box: element.getBoundingClientRect(),
      };
      element.setPointerCapture?.(event.pointerId);
      event.preventDefault();
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!drag) return;
      const { bounds, box, base } = drag;
      const dx = Math.min(Math.max(event.clientX - drag.startX, bounds.left - box.left), bounds.right - box.right);
      const dy = Math.min(Math.max(event.clientY - drag.startY, bounds.top - box.top), bounds.bottom - box.bottom);
      offset = { x: base.x + dx, y: base.y + dy };
      element.style.translate = `${offset.x}px ${offset.y}px`;
    };
    const onPointerUp = () => {
      drag = null;
    };

    element.addEventListener("pointerdown", onPointerDown);
    element.addEventListener("pointermove", onPointerMove);
    element.addEventListener("pointerup", onPointerUp);
    element.addEventListener("pointercancel", onPointerUp);
    return () => {
      element.removeEventListener("pointerdown", onPointerDown);
      element.removeEventListener("pointermove", onPointerMove);
      element.removeEventListener("pointerup", onPointerUp);
      element.removeEventListener("pointercancel", onPointerUp);
      element.style.translate = "";
    };
  }, [windowRef, handleSelector, enabled]);
}
