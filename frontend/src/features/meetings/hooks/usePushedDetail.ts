"use client";

import { MEDIA, useMediaQuery } from "@/shared/hooks/useMediaQuery";
import type { MeetingsUrlState } from "./useMeetingsUrlState";

/**
 * DV11 [D]: on phones the detail is "pushed" over the full-width list while the URL carries
 * `?select=` — so a deep link opens it, a tap pushes a history entry and Back (browser or "‹ Back")
 * returns to the list. Desktop shows both panes and only replaces the selection.
 */
export function usePushedDetail(url: MeetingsUrlState) {
  const isPhone = useMediaQuery(MEDIA.phone);
  const detailOpen = isPhone && url.selectKey !== null;
  return {
    isPhone,
    detailOpen,
    select: (key: string) => (isPhone ? url.pushSelection(key) : url.setSelection(key)),
    back: url.clearSelection,
  };
}
