import type { ReactNode } from "react";
import styles from "./DetailFrame.module.css";

interface DetailFrameProps {
  topic: string;
  /** `DetailRow`s under the topic (time, host, number…) */
  rows: ReactNode;
  /** z-buttons: Start / Copy Invitation / Edit / Delete */
  actions: ReactNode;
  /** Show/Hide Meeting Invitation block */
  children?: ReactNode;
}

/** `.meetings__detail`: topic, info rows, button row and the invitation area (PRD §7.4.3). */
export function DetailFrame({ topic, rows, actions, children }: DetailFrameProps) {
  return (
    <div className={styles.detail}>
      <div className={styles.info} id="meetings-detail-info-aria-desc">
        <div className={styles.topic}>{topic}</div>
        {rows}
      </div>
      <div className={styles.buttons}>{actions}</div>
      {children}
    </div>
  );
}

