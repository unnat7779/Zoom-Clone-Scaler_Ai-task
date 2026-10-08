"use client";

import { type RefObject, useCallback, useState } from "react";
import { usePathname } from "next/navigation";
import { useEscapeKey } from "@/shared/hooks/useEscapeKey";
import { useMediaQuery } from "@/shared/hooks/useMediaQuery";
import { useScrollLock } from "@/shared/hooks/useScrollLock";

/** the hamburger exists at ≤1024 (07-responsive.md §2.4); wider, the menu cannot be open */
const WIDE_HEADER = "(min-width: 1025px)";

/**
 * State of the portal hamburger menu (Zoom's `#navbar.navbar-collapse`): toggled by ☰, closed by
 * Escape (focus back on ☰), by any navigation and when the window grows past 1024px. The page
 * behind does not scroll while it is open.
 */
export function useMobileNavMenu(toggleRef: RefObject<HTMLButtonElement | null>) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [openedOn, setOpenedOn] = useState(pathname);
  if (openedOn !== pathname) {
    setOpenedOn(pathname);
    setOpen(false);
  }
  const wide = useMediaQuery(WIDE_HEADER);
  const visible = open && !wide;

  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((current) => !current), []);
  useScrollLock(visible);
  useEscapeKey(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, visible);

  return { open: visible, toggle, close };
}
