"use client";

import { Modal } from "@/shared/ui/Modal";
import { useShellDialog } from "../../hooks/useShellIntegration";
import { SettingsDialogContent } from "./SettingsDialogContent";
import styles from "./SettingsModal.module.css";

/**
 * Settings placeholder (rail Settings / profile Settings) — 820×660, contents static (PRD §6.9).
 * Like Zoom's `.settings-dialog__backdrop-dialog{pointer-events:none}`, the page behind stays
 * clickable. A full-screen sheet on phones [D].
 */
export function SettingsModal() {
  const { open, close } = useShellDialog("settings");
  return (
    <Modal open={open} onClose={close} variant="bare" aria-label="Settings" className={styles.dialog} overlayClassName={styles.overlay}>
      <SettingsDialogContent onClose={close} />
    </Modal>
  );
}
