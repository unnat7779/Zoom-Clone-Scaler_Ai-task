"use client";

import { useSyncExternalStore } from "react";

export type ClockResolution = "minute" | "second";

const STEP: Record<ClockResolution, number> = { minute: 60_000, second: 1_000 };

/** One shared, boundary-aligned ticker per resolution. */
function createTicker(step: number) {
  let current = new Date(Math.floor(Date.now() / step) * step);
  let timer: ReturnType<typeof setTimeout> | null = null;
  const listeners = new Set<() => void>();

  const schedule = () => {
    const delay = step - (Date.now() % step) + 5;
    timer = setTimeout(() => {
      current = new Date(Math.floor(Date.now() / step) * step);
      listeners.forEach((listener) => listener());
      schedule();
    }, delay);
  };

  return {
    subscribe(listener: () => void) {
      listeners.add(listener);
      if (listeners.size === 1) {
        current = new Date(Math.floor(Date.now() / step) * step);
        schedule();
      }
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0 && timer) clearTimeout(timer);
      };
    },
    getSnapshot: () => current,
  };
}

const tickers = { minute: createTicker(STEP.minute), second: createTicker(STEP.second) };
const getServerSnapshot = () => null;

/**
 * Current time, updated exactly on minute (or second) boundaries.
 * Returns `null` during server rendering — render a placeholder then, so the
 * prerendered HTML never shows a stale time.
 */
export function useClock(resolution: ClockResolution = "minute"): Date | null {
  const ticker = tickers[resolution];
  return useSyncExternalStore(ticker.subscribe, ticker.getSnapshot, getServerSnapshot);
}
