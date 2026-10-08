"use client";

import { type KeyboardEvent, useCallback, useEffect, useRef, useState } from "react";
import { useClickOutside } from "@/shared/hooks/useClickOutside";
import { useEscapeKey } from "@/shared/hooks/useEscapeKey";

const ROW_SELECTOR = '[role="option"], button';

/**
 * Join-modal meeting-history dropdown (PRD §7.2.6): toggle by click / Enter / Space, the first
 * row is focused on open, ↑/↓ move between rows, Escape closes only the dropdown (layered),
 * outside clicks close it, and focus returns to the toggle.
 */
export function useHistoryDropdown() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  /** Closes and focuses `focusTarget` (the toggle by default; it disappears after Clear History). */
  const close = useCallback((focusTarget?: HTMLElement | null) => {
    setOpen(false);
    (focusTarget ?? toggleRef.current)?.focus();
  }, []);

  useEscapeKey(() => close(), open);
  useClickOutside([listRef, toggleRef], () => setOpen(false), open);

  useEffect(() => {
    if (open) listRef.current?.querySelector<HTMLElement>(ROW_SELECTOR)?.focus();
  }, [open]);

  const onListKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    const rows = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(ROW_SELECTOR));
    const index = rows.indexOf(document.activeElement as HTMLElement);
    const step = event.key === "ArrowDown" ? 1 : -1;
    rows[(index + step + rows.length) % rows.length]?.focus();
  };

  return { open, toggle: () => setOpen((value) => !value), close, toggleRef, listRef, onListKeyDown };
}
