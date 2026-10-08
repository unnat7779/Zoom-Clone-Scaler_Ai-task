"use client";

import { type PointerEvent, useRef } from "react";

/** A horizontal move of at least this many px, clearly wider than tall, is a swipe. */
const SWIPE_MIN = 40;
const HORIZONTAL_RATIO = 1.5;

interface SwipeOptions {
  /** swipe to the left (finger moves right → left) */
  onNext: () => void;
  onPrevious: () => void;
}

/** Pointer handlers that page left / right on a horizontal swipe (phone gallery). */
export function useSwipe({ onNext, onPrevious }: SwipeOptions) {
  const start = useRef<{ x: number; y: number } | null>(null);
  return {
    onPointerDown: (event: PointerEvent) => {
      start.current = { x: event.clientX, y: event.clientY };
    },
    onPointerUp: (event: PointerEvent) => {
      const from = start.current;
      start.current = null;
      if (!from) return;
      const dx = event.clientX - from.x;
      const dy = event.clientY - from.y;
      if (Math.abs(dx) < SWIPE_MIN || Math.abs(dx) < Math.abs(dy) * HORIZONTAL_RATIO) return;
      if (dx < 0) onNext();
      else onPrevious();
    },
    onPointerCancel: () => {
      start.current = null;
    },
  };
}
