"use client";

import { useShellDialog } from "../../hooks/useShellIntegration";
import { useSearchShortcut } from "../../hooks/useSearchShortcut";
import { AboutModal } from "../AboutModal/AboutModal";
import { SearchDialog } from "../SearchDialog/SearchDialog";
import { SettingsModal } from "../SettingsModal/SettingsModal";

/** The shell's dialogs (Settings §6.9, Search §6.4, About §6.6) and the ⌘K / Ctrl+K shortcut. */
export function ShellOverlays() {
  const search = useShellDialog("search");
  useSearchShortcut(search.open, search.show);
  return (
    <>
      <SettingsModal />
      <SearchDialog />
      <AboutModal />
    </>
  );
}
