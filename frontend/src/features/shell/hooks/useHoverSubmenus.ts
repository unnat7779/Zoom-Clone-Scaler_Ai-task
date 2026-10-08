"use client";

import { type KeyboardEvent, type MouseEvent, useCallback, useEffect, useRef, useState } from "react";

/** Time the pointer has to cross the 16px between a row and its submenu [D]. */
const CLOSE_DELAY_MS = 150;
const OPEN_KEYS = ["Enter", " ", "ArrowRight"];

interface OpenSubmenu<T extends string> {
  id: T;
  /** the row the submenu belongs to (positions it, gets focus back) */
  row: HTMLElement;
  /** opened from the keyboard → focus its first item */
  focusFirst: boolean;
}

/**
 * Profile-menu submenus (PRD §6.6): a row opens its submenu on hover (unless `hoverEnabled` is
 * false, e.g. on the touch sheet), on click, or with Enter / Space / →. The submenu stays open while
 * the pointer crosses to it; `back()` closes it and returns focus to its row.
 */
export function useHoverSubmenus<T extends string>(hoverEnabled: boolean) {
  const [open, setOpen] = useState<OpenSubmenu<T> | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const cancelClose = useCallback(() => window.clearTimeout(timer.current), []);
  const scheduleClose = useCallback(() => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(null), CLOSE_DELAY_MS);
  }, []);
  useEffect(() => cancelClose, [cancelClose]);

  const show = (id: T, row: HTMLElement, focusFirst: boolean) => {
    cancelClose();
    setOpen({ id, row, focusFirst });
  };

  const back = () => {
    cancelClose();
    open?.row.focus({ preventScroll: true });
    setOpen(null);
  };

  const rowProps = (id: T) => ({
    active: open?.id === id,
    "aria-haspopup": "menu" as const,
    "aria-expanded": open?.id === id,
    onClick: (event: MouseEvent<HTMLElement>) => show(id, event.currentTarget, false),
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
      if (!OPEN_KEYS.includes(event.key)) return;
      event.preventDefault();
      show(id, event.currentTarget, true);
    },
    onMouseEnter: hoverEnabled ? (event: MouseEvent<HTMLElement>) => show(id, event.currentTarget, false) : undefined,
    onMouseLeave: hoverEnabled ? scheduleClose : undefined,
  });

  const panelProps = { onMouseEnter: cancelClose, onMouseLeave: hoverEnabled ? scheduleClose : undefined };

  return { open, rowProps, panelProps, back };
}
