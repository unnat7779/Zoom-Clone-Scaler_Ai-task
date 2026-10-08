"use client";

import clsx from "clsx";
import { useClipboard } from "@/shared/hooks";
import { RoomCopiedCheckIcon } from "@/shared/icons/generated/RoomCopiedCheckIcon";
import { RoomCopyUrlIcon } from "@/shared/icons/generated/RoomCopyUrlIcon";
import touch from "@/shared/styles/touch.module.css";
import styles from "./InfoPopover.module.css";

/** PRD §8.4.3: after copying, the button shows a green check for 5 s. */
const COPIED_MS = 5000;

export function InviteLinkRow({ url }: { url: string }) {
  const { copy, copied } = useClipboard({ resetAfter: COPIED_MS });
  return (
    <div className={clsx(styles.row, styles.linkRow)}>
      <span className={styles.label}>Invite Link</span>
      <span className={clsx(styles.value, styles.link)}>{url}</span>
      <button
        type="button"
        className={clsx(styles.copy, touch.target)}
        aria-label={copied ? "Copied" : "Copy invite link"}
        onClick={() => void copy(url)}
      >
        {copied ? <RoomCopiedCheckIcon className={styles.copied} /> : <RoomCopyUrlIcon />}
      </button>
    </div>
  );
}
