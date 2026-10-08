"use client";

import { type KeyboardEvent, type PointerEvent, type RefObject, useEffect, useRef, useState } from "react";
import { PANEL_DEFAULT_WIDTH, PANEL_KEY_STEP, clampPanelWidth } from "../utils/panelWidth";

interface DragStart {
  x: number;
  width: number;
  /** content column + panel: the width the two share while dragging */
  room: number;
}

/** Content column + panel width; the DOM order is `[content column] [handle] [panel]`. */
function sharedRoom(panel: HTMLElement | null): number | null {
  const column = panel?.previousElementSibling?.previousElementSibling as HTMLElement | null | undefined;
  return panel && column ? column.offsetWidth + panel.offsetWidth : null;
}

/**
 * Width of the docked Activity Center panel and the handlers of its 6px resize handle (PRD §6.5):
 * drag left to widen, right to narrow; ← / → step 16px, Home / End jump to the range ends. A window
 * resize re-clamps the width so the content column keeps its minimum.
 */
export function usePanelResize(panelRef: RefObject<HTMLElement | null>) {
  const [width, setWidth] = useState(PANEL_DEFAULT_WIDTH);
  const drag = useRef<DragStart | null>(null);

  useEffect(() => {
    const onResize = () => {
      const room = sharedRoom(panelRef.current);
      if (room !== null) setWidth((current) => clampPanelWidth(current, room));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [panelRef]);

  const resizeTo = (next: number, room = sharedRoom(panelRef.current)) => {
    if (room !== null) setWidth(clampPanelWidth(next, room));
  };

  const onPointerDown = (event: PointerEvent<HTMLElement>) => {
    const room = sharedRoom(panelRef.current);
    if (event.button !== 0 || room === null) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { x: event.clientX, width, room };
  };

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    const start = drag.current;
    if (start) resizeTo(start.width + start.x - event.clientX, start.room);
  };

  const onPointerUp = (event: PointerEvent<HTMLElement>) => {
    drag.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    const targets: Record<string, number> = {
      ArrowLeft: width + PANEL_KEY_STEP,
      ArrowRight: width - PANEL_KEY_STEP,
      Home: 0,
      End: Number.POSITIVE_INFINITY,
    };
    const next = targets[event.key];
    if (next === undefined) return;
    event.preventDefault();
    resizeTo(next);
  };

  return { width, handleProps: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp, onKeyDown } };
}
