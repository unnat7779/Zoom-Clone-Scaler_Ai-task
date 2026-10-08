"use client";

import { type RefObject, useRef } from "react";
import clsx from "clsx";
import { usePopoverDismiss } from "../../hooks/usePopoverDismiss";
import { RoomPaper } from "./RoomPaper";
import styles from "./EncryptionPopover.module.css";

interface EncryptionPopoverProps {
  anchorRef: RefObject<HTMLButtonElement | null>;
  onClose: () => void;
}

/** Static encryption information (Report / Security settings are no-ops). */
export function EncryptionPopover({ anchorRef, onClose }: EncryptionPopoverProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  usePopoverDismiss([ref, anchorRef], true, onClose);
  return (
    <RoomPaper ref={ref} className={styles.popover} aria-label="Encryption information">
      <div className={styles.title}>Enhanced encryption is on</div>
      <p className={styles.text}>You are connected to the Zoom Global Network via a data center in the United States.</p>
      <div className={styles.row}>
        <span className={styles.label}>Encryption</span>
        <span>Enabled</span>
      </div>
      <div className={styles.divider} />
      <div className={styles.actions}>
        <button type="button" className={clsx(styles.action, styles.report)}>
          Report
        </button>
        <button type="button" className={styles.action}>
          Security settings
        </button>
      </div>
    </RoomPaper>
  );
}
