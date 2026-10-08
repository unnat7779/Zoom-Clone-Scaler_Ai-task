"use client";

import clsx from "clsx";
import { StaticButton } from "@/shared/ui/StaticButton";
import { PreJoinFooter } from "../PreJoinLayout/PreJoinFooter";
import { ExitIcon } from "./ExitIcon";
import { HoldPreview } from "./HoldPreview";
import { HoldRing } from "./HoldRing";
import type { WaitingRoomProps } from "./WaitingRoom";
import styles from "./WaitingRoom.module.css";

/**
 * Zoom's `.waiting-room-container` (main-client `a1e`, dark theme), which replaces the whole preview:
 * the corner self view, the centred information block (topic, schedule, tip + ring, Host Sign in ·
 * Exit), the grey default content panel and the page footer.
 */
export function WaitingRoomDesktop({ topic, scheduleLabel, inShell, stream, name, onLeave }: WaitingRoomProps) {
  return (
    <div className={clsx(styles.container, inShell && styles.inShell)}>
      <HoldPreview stream={stream} name={name} inShell={inShell} />
      <div className={styles.information} role="status">
        <h1 className={styles.topic}>{topic}</h1>
        <p className={styles.date}>{scheduleLabel}</p>
        <p className={styles.tip}>
          <span>Waiting for the host to start the meeting.</span>
          <HoldRing />
        </p>
        <div className={styles.buttons}>
          {/* `host-signin-btn`: only for signed-out guests (the full-viewport page) — Static UI */}
          {inShell ? null : <StaticButton className={styles.button}>Host Sign in</StaticButton>}
          <button type="button" className={styles.button} onClick={onLeave}>
            Exit
            <ExitIcon className={styles.exitIcon} />
          </button>
        </div>
      </div>
      <div className={styles.content} />
      <PreJoinFooter className={styles.footer} />
    </div>
  );
}
