import type { ReactNode } from "react";
import clsx from "clsx";
import { PreJoinFooter } from "./PreJoinFooter";
import styles from "./PreJoinLayout.module.css";

interface PreJoinLayoutProps {
  /** inside the web-client panel: fills it (the footer shows there too, as in Zoom's PWA iframe) */
  inShell: boolean;
  preview: ReactNode;
  children: ReactNode;
}

/**
 * `.preview-root--dark` (PRD §7.10.2): `#1D1E20`, no header; the 700px preview card and
 * the 392px info column, 40px apart, centred as one row (the column is vertically centred
 * on the card), above Zoom's footer 16px from the bottom.
 */
export function PreJoinLayout({ inShell, preview, children }: PreJoinLayoutProps) {
  return (
    <div className={clsx(styles.root, inShell ? styles.inShell : styles.fullViewport)}>
      <div className={styles.row}>
        {preview}
        <div className={styles.info}>{children}</div>
      </div>
      <PreJoinFooter />
    </div>
  );
}
