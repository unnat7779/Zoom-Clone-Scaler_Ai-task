"use client";

import { type KeyboardEvent, useCallback, useEffect, useRef, useState } from "react";
import { useEscapeKey } from "@/shared/hooks/useEscapeKey";

const OPEN_KEYS = ["Enter", " ", "ArrowRight"];

/**
 * Hover submenu (New-meeting PMI row, PRD §7.1.4): opens while the pointer is over the row or the
 * submenu (focus moves to the row, as in Zoom), on click, or with Enter / Space / → (then the
 * first item gets focus). ← and Escape close it and return focus to the row; Escape is layered so
 * the parent popover stays open.
 */
export function useSubmenu() {
  const [open, setOpen] = useState(false);
  const [focusFirst, setFocusFirst] = useState(false);
  const rowRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    rowRef.current?.focus();
  }, []);
  useEscapeKey(close, open);

  useEffect(() => {
    if (open && focusFirst) menuRef.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus();
  }, [focusFirst, open]);

  const onRowKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!OPEN_KEYS.includes(event.key)) return;
    event.preventDefault();
    setFocusFirst(true);
    setOpen(true);
  };

  const onMenuKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowLeft") close();
  };

  return {
    open,
    rowRef,
    menuRef,
    hoverProps: {
      onMouseEnter: () => {
        setFocusFirst(false);
        setOpen(true);
        rowRef.current?.focus({ preventScroll: true });
      },
      onMouseLeave: () => setOpen(false),
    },
    onRowClick: () => setOpen(true),
    onRowKeyDown,
    onMenuKeyDown,
  };
}
