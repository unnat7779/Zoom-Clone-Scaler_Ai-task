"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Grace period that lets the pointer travel from the trigger onto the popover. */
const CLOSE_DELAY_MS = 100;

/** Open while the pointer is over the trigger or the popover (or the trigger has keyboard focus). */
export function useHoverIntent() {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };

  const enter = useCallback(() => {
    cancelClose();
    setOpen(true);
  }, []);

  const leave = useCallback(() => {
    cancelClose();
    timer.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  }, []);

  const close = useCallback(() => {
    cancelClose();
    setOpen(false);
  }, []);

  useEffect(() => cancelClose, []);

  return { open, enter, leave, close };
}
