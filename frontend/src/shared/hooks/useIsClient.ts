"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** false while server rendering / hydrating, true afterwards (portals, browser-only UI). */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
