"use client";

import { type ReactNode, createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import type { PresenceStatus } from "@/shared/ui/Avatar";

/** Return false to cancel a rail navigation (e.g. the room shows its End/Leave popover first). */
export type NavigationGuard = (href: string) => boolean;

/** The shell's modal dialogs (one at a time): Settings (§6.9), global Search (§6.4), About (§6.6). */
export type ShellDialog = "settings" | "search" | "about";

/** The header's popovers (one at a time): profile menu (§6.6), History (§6.3). */
export type ShellMenu = "profile" | "history";

interface ShellContextValue {
  /** status chosen in the profile menu (local only, PRD §6.6) */
  status: PresenceStatus;
  setStatus: (status: PresenceStatus) => void;
  /** true while this browser shows a meeting → avatar glyph "In a meeting", no rail tab selected */
  inMeeting: boolean;
  setInMeeting: (value: boolean) => void;
  /** the open shell dialog, if any */
  dialog: ShellDialog | null;
  /** opening a dialog (e.g. Search by ⌘K) closes the open header popover */
  setDialog: (dialog: ShellDialog | null) => void;
  /** the open header popover, if any */
  menu: ShellMenu | null;
  setMenu: (menu: ShellMenu | null) => void;
  /** the docked Activity Center panel (bell, PRD §6.5) */
  activityOpen: boolean;
  setActivityOpen: (open: boolean) => void;
  setNavigationGuard: (guard: NavigationGuard | null) => void;
  /** asks the registered guard (if any) whether a rail navigation may proceed */
  canNavigate: (href: string) => boolean;
}

const ShellContext = createContext<ShellContextValue | null>(null);

/** State shared by the Workplace header, rail and the page inside the shell. */
export function ShellProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<PresenceStatus>("available");
  const [inMeeting, setInMeeting] = useState(false);
  const [dialog, setDialogState] = useState<ShellDialog | null>(null);
  const [menu, setMenu] = useState<ShellMenu | null>(null);
  const [activityOpen, setActivityOpen] = useState(false);
  const guardRef = useRef<NavigationGuard | null>(null);

  const setDialog = useCallback((next: ShellDialog | null) => {
    setDialogState(next);
    if (next) setMenu(null);
  }, []);
  const setNavigationGuard = useCallback((guard: NavigationGuard | null) => {
    guardRef.current = guard;
  }, []);
  const canNavigate = useCallback((href: string) => guardRef.current?.(href) ?? true, []);

  const value = useMemo(
    () => ({
      status,
      setStatus,
      inMeeting,
      setInMeeting,
      dialog,
      setDialog,
      menu,
      setMenu,
      activityOpen,
      setActivityOpen,
      setNavigationGuard,
      canNavigate,
    }),
    [activityOpen, canNavigate, dialog, inMeeting, menu, setDialog, setNavigationGuard, status],
  );
  return <ShellContext.Provider value={value}>{children}</ShellContext.Provider>;
}

/**
 * Shell state, or null outside `WorkplaceShell` (portal pages). Full-viewport meeting pages keep
 * the provider (their chrome is only hidden), so their state survives a chrome toggle.
 */
export const useShellContext = () => useContext(ShellContext);
