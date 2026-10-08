"use client";

import { MtgMeetingsCopyIcon } from "@/shared/icons/generated/MtgMeetingsCopyIcon";
import { HoverPopover } from "@/shared/ui/HoverPopover";
import { usePortalCopy } from "../../hooks/usePortalCopy";
import { DetailValue } from "./DetailValue";
import styles from "./InviteLinkValue.module.css";

/** Invite URL (new tab) + ghost copy icon with the "Copy the Link" light tooltip (PRD §7.8.2). */
export function InviteLinkValue({ url }: { url: string }) {
  const copy = usePortalCopy();
  return (
    <DetailValue>
      <a href={url} target="_blank" rel="noreferrer" className={styles.link}>
        {url}
      </a>
      <HoverPopover content="Copy the Link" variant="portal" placement="top" offset={12}>
        <button type="button" aria-label="Copy Url" className={styles.copy} onClick={() => void copy(url)}>
          <MtgMeetingsCopyIcon />
        </button>
      </HoverPopover>
    </DetailValue>
  );
}
