"use client";

import clsx from "clsx";
import { HomeMenuExternalIcon } from "@/shared/icons/generated/HomeMenuExternalIcon";
import { PwaZoomLogoIcon } from "@/shared/icons/generated/PwaZoomLogoIcon";
import { SchCloseIcon } from "@/shared/icons/generated/SchCloseIcon";
import touch from "@/shared/styles/touch.module.css";
import { Modal } from "@/shared/ui/Modal";
import { useToast } from "@/shared/ui/Toast";
import { useShellDialog } from "../../hooks/useShellIntegration";
import styles from "./AboutModal.module.css";

/** Shown instead of Zoom's build string "7.2.0.3239 ( 0924 )" (PRD §6.6 [D]). */
const CLONE_VERSION = "Clone 1.0";

/**
 * "About Zoom Workplace" (Help submenu, PRD §6.6, 01-shell-home §7.4): 480×305 card centred on a
 * white .75 overlay — wordmark, version, copyright and the static "Open Source Software ↗" link.
 */
export function AboutModal() {
  const { open, close } = useShellDialog("about");
  const toast = useToast();
  return (
    <Modal open={open} onClose={close} variant="bare" aria-label="About Zoom Workplace" className={styles.card} overlayClassName={styles.overlay}>
      <button type="button" aria-label="Close" className={clsx(styles.close, touch.target)} onClick={close}>
        <SchCloseIcon width={12} height={12} />
      </button>
      <div className={styles.content}>
        <PwaZoomLogoIcon width={106} height={24} className={styles.logo} title="Zoom" />
        <p className={styles.version}>Version: {CLONE_VERSION}</p>
        <p className={styles.copyright}>
          Copyright ©2012-{new Date().getFullYear()} Zoom Communications, Inc. All rights reserved.
        </p>
        <button type="button" className={styles.link} onClick={toast.notAvailable}>
          Open Source Software
          <HomeMenuExternalIcon width={12} height={12} />
        </button>
      </div>
    </Modal>
  );
}
