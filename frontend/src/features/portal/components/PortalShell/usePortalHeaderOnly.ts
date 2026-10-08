"use client";

import { createContext, useContext, useLayoutEffect } from "react";

/** `PortalShell`'s switch between the side-menu layout and the header-only layout. */
export const PortalHeaderOnlyContext = createContext<(headerOnly: boolean) => void>(() => {});

/**
 * While the calling component is mounted, `PortalShell` shows the header only — no side menu,
 * no content padding — like Zoom's error pages ("Invalid meeting ID. (3,001)", PRD §7.8.6).
 * Runs before paint, so the side menu never flashes.
 */
export function usePortalHeaderOnly() {
  const setHeaderOnly = useContext(PortalHeaderOnlyContext);
  useLayoutEffect(() => {
    setHeaderOnly(true);
    return () => setHeaderOnly(false);
  }, [setHeaderOnly]);
}
