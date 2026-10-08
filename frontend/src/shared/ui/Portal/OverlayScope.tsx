"use client";

import { type ReactNode, createContext, useContext } from "react";

const OverlayScopeContext = createContext<string | undefined>(undefined);

interface OverlayScopeProps {
  /** class for the `display: contents` wrapper of every overlay rendered inside the scope */
  className: string;
  children: ReactNode;
}

/**
 * Overlays (select menus, popovers, tooltips, dialogs) are appended to `document.body`, outside
 * the page's DOM tree, so they miss the CSS variables a surface sets on its root. Inside an
 * `OverlayScope`, `Portal` wraps them in an element with `className` (e.g. the zoom.us portal
 * font, tracking and floating layer set by `PortalShell`).
 */
export function OverlayScope({ className, children }: OverlayScopeProps) {
  return <OverlayScopeContext.Provider value={className}>{children}</OverlayScopeContext.Provider>;
}

/** Class of the nearest `OverlayScope`, if any. */
export const useOverlayScope = () => useContext(OverlayScopeContext);
