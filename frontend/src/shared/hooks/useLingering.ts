"use client";

import { useEffect, useState } from "react";

/**
 * True for `exitMs` after `open` turns false, so a closing overlay can play its leave animation
 * before it unmounts (Prism tooltip `opacity 300ms`, zoom.us dialog `dialog-fade-out .2s`).
 * `exitMs = 0` unmounts at once.
 */
export function useLingering(open: boolean, exitMs: number): boolean {
  const [lingering, setLingering] = useState(false);
  const [wasOpen, setWasOpen] = useState(open);
  // adjust state while rendering when `open` flips (no extra frame without the tooltip)
  if (open !== wasOpen) {
    setWasOpen(open);
    setLingering(!open && exitMs > 0);
  }

  useEffect(() => {
    if (!lingering) return;
    const timer = setTimeout(() => setLingering(false), exitMs);
    return () => clearTimeout(timer);
  }, [lingering, exitMs]);

  return lingering;
}
