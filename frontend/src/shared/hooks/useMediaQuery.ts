"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Live `window.matchMedia(query).matches`; `false` during server rendering.
 * Prefer CSS media queries for layout — use this only when behaviour changes
 * (e.g. the profile menu becoming a sheet, the room going full viewport).
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** Breakpoints measured in PRD §11.1 (max-width queries). */
export const MEDIA = {
  phone: "(max-width: 767px)",
  tablet: "(max-width: 768px)",
  narrowHeader: "(max-width: 1080px)",
  wideHeader: "(min-width: 1440px)",
  /**
   * [D] a phone in either orientation (portrait ≤ 767 wide, landscape ≤ 500 tall): the pre-join
   * and the meeting room switch to their phone layouts (PRD §11.5). Repeated in the join / room
   * CSS as `@media (max-width: 767px), (max-height: 500px) and (max-width: 1023px)`.
   */
  handheld: "(max-width: 767px), (max-height: 500px) and (max-width: 1023px)",
  /** touch screens: hit areas grow to 44px (phones and tablets) */
  coarse: "(pointer: coarse)",
} as const;
