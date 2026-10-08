"use client";

import touch from "@/shared/styles/touch.module.css";
import { Button } from "@/shared/ui";
import { useLeftPage } from "../../hooks/useLeftPage";
import styles from "./LeftMeetingPage.module.css";

/** Where a full-viewport (invite-link) participant lands after leaving (PRD §7.11). */
export function LeftMeetingPage({ number }: { number: string }) {
  const { message, canRejoin, rejoin, goHome } = useLeftPage(number);
  return (
    <main className={styles.page}>
      <h1 className={styles.title}>{message}</h1>
      <div className={styles.actions}>
        {canRejoin ? (
          <Button variant="primary" size="md" className={touch.target} onClick={rejoin}>
            Rejoin
          </Button>
        ) : null}
        <Button variant="secondary" size="md" className={touch.target} onClick={goHome}>
          Return Home
        </Button>
      </div>
    </main>
  );
}
