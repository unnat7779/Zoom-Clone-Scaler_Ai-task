"use client";

import { useState } from "react";
import { SchCheckmarkIcon } from "@/shared/icons/generated/SchCheckmarkIcon";
import { Button } from "@/shared/ui/Button";
import styles from "./SecurityValue.module.css";

const MASK = "********";

/** ✓ Passcode ******** Show/Hide · ✓ Everyone goes into the waiting room (PRD §7.8.2 Security). */
export function SecurityValue({ passcode, waitingRoom }: { passcode: string | null; waitingRoom: boolean }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <>
      {passcode !== null ? (
        <div className={styles.passcodeLine}>
          <SchCheckmarkIcon className={styles.check} />
          Passcode
          <span className={styles.passcodeValue}>{revealed ? passcode : MASK}</span>
          <Button
            family="portal"
            variant="link"
            className={styles.showButton}
            aria-label={revealed ? `hide passcode ${passcode}` : `show passcode ${MASK}`}
            onClick={() => setRevealed((value) => !value)}
          >
            {revealed ? "Hide" : "Show"}
          </Button>
        </div>
      ) : null}
      {waitingRoom ? (
        <p className={styles.waitingRoom}>
          <SchCheckmarkIcon className={styles.check} />
          Everyone goes into the waiting room
        </p>
      ) : null}
    </>
  );
}
