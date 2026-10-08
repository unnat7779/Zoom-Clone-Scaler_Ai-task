"use client";

import { useCallback, useEffect } from "react";
import { type NavigationGuard, type ShellDialog, type ShellMenu, useShellContext } from "../context/ShellContext";

/**
 * For pages rendered inside the Workplace shell (the in-shell meeting room):
 * while `active`, the header avatar shows the orange "In a meeting" glyph and
 * no rail tab is selected (PRD §6.7). No-op outside the shell.
 */
export function useShellMeetingPresence(active: boolean): void {
  const shell = useShellContext();
  const setInMeeting = shell?.setInMeeting;
  useEffect(() => {
    if (!setInMeeting) return;
    setInMeeting(active);
    return () => setInMeeting(false);
  }, [active, setInMeeting]);
}

/**
 * Registers a guard that runs before a rail tab navigates (PRD §6.7 [D]: in a
 * meeting, open the End/Leave popover first). Return false to cancel. No-op outside the shell.
 */
export function useRailNavigationGuard(guard: NavigationGuard | null): void {
  const shell = useShellContext();
  const setNavigationGuard = shell?.setNavigationGuard;
  useEffect(() => {
    if (!setNavigationGuard) return;
    setNavigationGuard(guard);
    return () => setNavigationGuard(null);
  }, [guard, setNavigationGuard]);
}

/** One header popover: whether it is open, and functions to toggle / close it (no-ops outside the shell). */
export function useShellMenu(menu: ShellMenu) {
  const shell = useShellContext();
  const setMenu = shell?.setMenu;
  const open = shell?.menu === menu;
  const toggle = useCallback(() => setMenu?.(open ? null : menu), [menu, open, setMenu]);
  const close = useCallback(() => setMenu?.(null), [setMenu]);
  return { open, toggle, close };
}

/** One shell dialog: whether it is open, and functions to open / close it (no-ops outside the shell). */
export function useShellDialog(dialog: ShellDialog) {
  const shell = useShellContext();
  const setDialog = shell?.setDialog;
  const show = useCallback(() => setDialog?.(dialog), [dialog, setDialog]);
  const close = useCallback(() => setDialog?.(null), [setDialog]);
  return { open: shell?.dialog === dialog, show, close };
}
