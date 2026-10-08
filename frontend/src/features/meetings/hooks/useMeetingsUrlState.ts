"use client";

import { useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { routes } from "@/shared/lib/routes";
import type { MeetingsTab } from "../types";

/** history.state marker of an entry `pushSelection` added (phones: Back returns to the list). */
const PUSHED_DETAIL = "zcMeetingsDetail";

/**
 * `?tab=upcoming|previous&select=…` (PRD §4.1): the URL is the source of truth. Next.js syncs
 * `history.replaceState` / `pushState` into `useSearchParams` without a router round-trip, so a
 * click selects instantly. Desktop selections replace the entry; a phone selection (DV11) pushes
 * one, so the browser's Back closes the pushed detail instead of leaving the tab.
 */
export function useMeetingsUrlState() {
  const params = useSearchParams();
  const tab: MeetingsTab = params.get("tab") === "previous" ? "previous" : "upcoming";
  const selectKey = params.get("select");

  const urlOf = useCallback(
    (nextTab: MeetingsTab, select?: string) => routes.meetings({ tab: nextTab === "previous" ? "previous" : undefined, select }),
    [],
  );

  const setSelection = useCallback((key?: string) => window.history.replaceState(null, "", urlOf(tab, key)), [tab, urlOf]);
  const pushSelection = useCallback(
    (key: string) => window.history.pushState({ [PUSHED_DETAIL]: true }, "", urlOf(tab, key)),
    [tab, urlOf],
  );
  /** "‹ Back" of the pushed detail: undo our own push, else drop `?select=` in place. */
  const clearSelection = useCallback(() => {
    if ((window.history.state as Record<string, unknown> | null)?.[PUSHED_DETAIL]) window.history.back();
    else setSelection(undefined);
  }, [setSelection]);
  const setTab = useCallback((next: MeetingsTab) => window.history.replaceState(null, "", urlOf(next)), [urlOf]);

  return useMemo(
    () => ({ tab, selectKey, setSelection, pushSelection, clearSelection, setTab }),
    [tab, selectKey, setSelection, pushSelection, clearSelection, setTab],
  );
}

export type MeetingsUrlState = ReturnType<typeof useMeetingsUrlState>;
