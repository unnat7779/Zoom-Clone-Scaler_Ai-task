"use client";

import { useEffect } from "react";
import { isSearchShortcut } from "../utils/searchShortcut";

/** Any modal dialog on the page (Join, Delete, Settings, the Search dialog itself…). */
const OPEN_MODAL_SELECTOR = '[aria-modal="true"]';

/**
 * ⌘K / Ctrl+K opens the global Search dialog from anywhere in the shell (PRD §6.4 [M]). While the
 * dialog is open the shortcut is swallowed; while another modal is open it is left alone.
 */
export function useSearchShortcut(searchOpen: boolean, openSearch: () => void): void {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || !isSearchShortcut(event)) return;
      if (searchOpen) {
        event.preventDefault();
        return;
      }
      if (document.querySelector(OPEN_MODAL_SELECTOR)) return;
      event.preventDefault();
      openSearch();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [openSearch, searchOpen]);
}
