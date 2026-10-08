"use client";

import { useRef } from "react";
import { useToggle } from "@/shared/hooks";
import { usePopoverDismiss } from "../../../hooks/usePopoverDismiss";
import { ChatPrivacyIcon } from "./ChatPrivacyIcon";
import styles from "./ChatDisclaimer.module.css";

/** Bar above the composer; opens Zoom's explanation of who can read the chat. */
export function ChatDisclaimer() {
  const [open, toggle, setOpen] = useToggle(false);
  const ref = useRef<HTMLDivElement | null>(null);
  usePopoverDismiss([ref], open, () => setOpen(false));
  return (
    <div ref={ref} className={styles.wrap}>
      {open ? (
        <div className={styles.popover} role="dialog" aria-label="Who can see your messages?">
          <p>
            Everyone in the meeting can see and save your messages sent to Meeting Group Chat – and share them with apps and others.
            These messages will also be posted in the dedicated Meeting Group Chat in Team Chat, and everyone, including those not in
            the meeting, can see, save and share them.
          </p>
          <p>Only you and those you chat with can save your direct messages and share them with apps and others.</p>
          <span className={styles.arrow} aria-hidden />
        </div>
      ) : null}
      <button type="button" className={styles.bar} aria-expanded={open} onClick={toggle}>
        <ChatPrivacyIcon />
        Who can see your messages?
      </button>
    </div>
  );
}
