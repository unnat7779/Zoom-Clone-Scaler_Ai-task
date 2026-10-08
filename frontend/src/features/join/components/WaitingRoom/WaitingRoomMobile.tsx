"use client";

import { PreJoinFooter } from "../PreJoinLayout/PreJoinFooter";
import { ExitIcon } from "./ExitIcon";
import { HoldRing } from "./HoldRing";
import type { WaitingRoomProps } from "./WaitingRoom";
import styles from "./WaitingRoomMobile.module.css";

/**
 * Zoom's phone page `.mobile-waiting-room--dark` (main-client `POt`): Exit icon at (24,24) and the
 * "Waiting Room" title, the content panel, then topic, schedule, tip + ring and a full-width red
 * Leave; side by side in landscape. In the shell the panel's "‹ Back" replaces the Exit icon.
 */
export function WaitingRoomMobile({ topic, scheduleLabel, inShell, onLeave }: WaitingRoomProps) {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        {inShell ? null : (
          <button type="button" className={styles.exit} aria-label="Exit" onClick={onLeave}>
            <ExitIcon className={styles.exitIcon} />
          </button>
        )}
        <h2 className={styles.title}>Waiting Room</h2>
      </header>
      <div className={styles.main}>
        <div className={styles.content} />
        <div className={styles.information} role="status">
          <h1 className={styles.topic}>{topic}</h1>
          <p className={styles.date}>{scheduleLabel}</p>
          <p className={styles.indication}>
            <span>Waiting for the host to start the meeting.</span>
            <HoldRing />
          </p>
          <button type="button" className={styles.leave} onClick={onLeave}>
            Leave
          </button>
        </div>
      </div>
      <PreJoinFooter className={styles.footer} />
    </div>
  );
}
