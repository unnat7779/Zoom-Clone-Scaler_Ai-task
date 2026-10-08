"use client";

import type { MeetingRef } from "@/shared/lib/api";
import { MtgMeetingsCopyIcon } from "@/shared/icons/generated/MtgMeetingsCopyIcon";
import { Button } from "@/shared/ui/Button";
import { Tooltip } from "@/shared/ui/Tooltip";
import { useCopyInvitation } from "../../hooks/useCopyInvitation";
import styles from "./CopyInvitationButton.module.css";

/** Tertiary z-button that copies the invitation and shows the white "Copied!" tooltip 6px above (PRD §7.4.6). */
export function CopyInvitationButton({ meetingRef }: { meetingRef: MeetingRef }) {
  const { copied, copy, dismiss } = useCopyInvitation(meetingRef);
  return (
    <Tooltip content="Copied!" variant="light" placement="top" offset={6} open={copied} className={styles.tooltip}>
      <Button
        family="z"
        variant="tertiary"
        leadingIcon={<MtgMeetingsCopyIcon />}
        onClick={copy}
        onPointerLeave={dismiss}
        onBlur={dismiss}
      >
        Copy Invitation
      </Button>
    </Tooltip>
  );
}
