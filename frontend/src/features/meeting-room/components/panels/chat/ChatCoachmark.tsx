"use client";

import { type RefObject, useRef } from "react";
import { useLocalStorage } from "@/shared/hooks";
import { useRoomAnchor } from "../../../hooks/useRoomAnchor";
import styles from "./ChatCoachmark.module.css";

const SEEN_KEY = "zc.chat_coachmark_seen";

/**
 * Shown the first time the chat opens in this browser; "Got it" dismisses it for good.
 * Anchored under the header's Team Chat icon (room x 878, y 40) as a fixed layer, so the
 * panel's rounded clipping never cuts its left edge.
 */
export function ChatCoachmark({ anchorRef }: { anchorRef: RefObject<HTMLElement | null> }) {
  const [seen, setSeen] = useLocalStorage<boolean>(SEEN_KEY, false);
  const ref = useRef<HTMLDivElement | null>(null);
  useRoomAnchor({ anchorRef, floatingRef: ref, open: !seen, placement: "bottom-start", offset: 5, shift: -8 });
  if (seen) return null;
  return (
    <div ref={ref} className={styles.coachmark} role="dialog" aria-label="Continue the Conversation">
      <span className={styles.arrow} aria-hidden />
      <div className={styles.title}>Continue the Conversation</div>
      <p className={styles.body}>
        There&apos;s now a meeting group chat named after this meeting in Team Chat. Continue the conversation there at any time.
      </p>
      <div className={styles.footer}>
        <button type="button" className={styles.gotIt} onClick={() => setSeen(true)}>
          Got it
        </button>
      </div>
    </div>
  );
}
