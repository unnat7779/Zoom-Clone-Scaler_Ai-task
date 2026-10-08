"use client";

import clsx from "clsx";
import { useLingering } from "@/shared/hooks/useLingering";
import { Modal } from "@/shared/ui/Modal";
import { SEARCH_EXIT_MS } from "../../constants";
import { useShellDialog } from "../../hooks/useShellIntegration";
import { SearchPanel } from "./SearchPanel";
import styles from "./SearchDialog.module.css";

/**
 * Global Search dialog (PRD §6.4, 01-shell-home §4) — Static UI only: 720×628 paper centred on a
 * `rgba(0,0,0,.5)` backdrop, MUI Fade in .225s / out .195s. Opens from the header trigger or
 * ⌘K / Ctrl+K; closes on Escape and ✕ — a backdrop click does not close it [M]. The panel
 * unmounts after the fade-out, so the field and the chip selection start fresh every time.
 */
export function SearchDialog() {
  const { open, close } = useShellDialog("search");
  const exiting = useLingering(open, SEARCH_EXIT_MS);
  return (
    <Modal
      open={open || exiting}
      onClose={close}
      variant="bare"
      aria-label="Search"
      className={clsx(styles.paper, { [styles.exiting ?? ""]: exiting })}
      overlayClassName={clsx(styles.backdrop, { [styles.exiting ?? ""]: exiting })}
    >
      <SearchPanel onClose={close} />
    </Modal>
  );
}
