"use client";

import { useState } from "react";
import type { MeetingRef } from "@/shared/lib/api";
import { useMeetingInvitation } from "@/shared/lib/api/invitation";
import { Spinner } from "@/shared/ui/Spinner";
import styles from "./InvitationBlock.module.css";

/** "Show / Hide Meeting Invitation" + the `<pre>` invitation (PRD §7.4.7); the first open fetches the text. */
export function InvitationBlock({ meetingRef }: { meetingRef: MeetingRef }) {
  const [shown, setShown] = useState(false);
  const invitation = useMeetingInvitation(meetingRef, { enabled: shown });

  return (
    <div className={styles.block}>
      <button type="button" className={styles.toggle} aria-expanded={shown} onClick={() => setShown((value) => !value)}>
        {shown ? "Hide Meeting Invitation" : "Show Meeting Invitation"}
      </button>
      {shown ? (
        <div className={styles.content}>
          {invitation.data ? (
            <pre className={styles.text}>{invitation.data.text}</pre>
          ) : invitation.isError ? (
            // clone-only [D]: Zoom shows nothing; offer a retry instead of an empty block
            <button type="button" className={styles.retry} onClick={() => void invitation.refetch()}>
              Couldn&apos;t load the invitation. Try again
            </button>
          ) : (
            <Spinner variant="pwa" className={styles.spinner} />
          )}
        </div>
      ) : null}
    </div>
  );
}
