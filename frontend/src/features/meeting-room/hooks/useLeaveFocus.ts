"use client";

import { type RefObject, useCallback, useEffect } from "react";
import { useRoomUi } from "../state/useRoomUi";

/** The End / Leave toolbar button (it is re-mounted when the toolbar comes back). */
const END_BUTTON = "[role='toolbar'] [aria-label='End'], [role='toolbar'] [aria-label='Leave']";

/**
 * Focus of the End / Leave flow (PRD §8.14): the popover's first option takes focus when it opens;
 * Cancel or Escape restores the toolbar and gives focus back to End / Leave.
 */
export function useLeaveFocus(popoverRef: RefObject<HTMLElement | null>) {
  const { setLeaveOpen, roomRef } = useRoomUi();

  useEffect(() => {
    popoverRef.current?.querySelector<HTMLButtonElement>("button")?.focus({ preventScroll: true });
  }, [popoverRef]);

  return useCallback(() => {
    setLeaveOpen(false);
    requestAnimationFrame(() => roomRef.current?.querySelector<HTMLButtonElement>(END_BUTTON)?.focus({ preventScroll: true }));
  }, [setLeaveOpen, roomRef]);
}
