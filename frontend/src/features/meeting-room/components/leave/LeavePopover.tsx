"use client";

import type { Ref } from "react";
import clsx from "clsx";
import { useMeetingRoom } from "../../realtime/useMeetingRoom";
import styles from "./LeavePopover.module.css";

/**
 * Host: End Meeting for All (red) + Leave Meeting (the host role passes to the
 * earliest attendee, §3). Attendee: a single red Leave Meeting.
 */
export function LeavePopover({ ref }: { ref?: Ref<HTMLDivElement> }) {
  const { isHost, leave, endForAll } = useMeetingRoom();
  return (
    <div ref={ref} className={styles.popover} role="dialog" aria-label={isHost ? "End meeting" : "Leave meeting"}>
      {isHost ? (
        <>
          <button type="button" className={clsx(styles.option, styles.danger)} onClick={() => void endForAll()}>
            End Meeting for All
          </button>
          <button type="button" className={clsx(styles.option, styles.default)} onClick={leave}>
            Leave Meeting
          </button>
        </>
      ) : (
        <button type="button" className={clsx(styles.option, styles.danger)} onClick={leave}>
          Leave Meeting
        </button>
      )}
    </div>
  );
}
