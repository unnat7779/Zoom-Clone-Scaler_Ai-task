"use client";

import { type RefObject, useRef } from "react";
import { formatMeetingNumber } from "@/shared/lib/format";
import { usePopoverDismiss } from "../../hooks/usePopoverDismiss";
import { useMeetingRoom } from "../../realtime/useMeetingRoom";
import { InfoRow } from "./InfoRow";
import { InviteLinkRow } from "./InviteLinkRow";
import { RoomPaper } from "./RoomPaper";
import { TopicField } from "./TopicField";
import styles from "./InfoPopover.module.css";

interface InfoPopoverProps {
  anchorRef: RefObject<HTMLButtonElement | null>;
  onClose: () => void;
}

/** Meeting information: topic, invite link (copy), ID, host, passcode, participant ID. */
export function InfoPopover({ anchorRef, onClose }: InfoPopoverProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { meeting, self, host, isHost, number } = useMeetingRoom();
  usePopoverDismiss([ref, anchorRef], true, onClose);
  const hostName = host ? `${host.display_name}${host.id === self?.id ? " (You)" : ""}` : (meeting?.host_name ?? "");

  return (
    <RoomPaper ref={ref} className={styles.popover} aria-label="Meeting information">
      {isHost ? (
        <TopicField topic={meeting?.topic ?? ""} />
      ) : (
        <div className={styles.topicText}>{meeting?.topic}</div>
      )}
      <InviteLinkRow url={meeting?.invite_url ?? ""} />
      <InfoRow label="Meeting ID" value={formatMeetingNumber(meeting?.number ?? number)} />
      <InfoRow label="Host" value={hostName} />
      {meeting?.passcode ? <InfoRow label="Passcode" value={meeting.passcode} /> : null}
      {meeting?.numeric_passcode ? (
        <InfoRow label="Numeric Password Telephone/Room Systems" value={meeting.numeric_passcode} />
      ) : null}
      {self ? <InfoRow label="Participant ID" value={String(self.id).padStart(6, "0")} /> : null}
    </RoomPaper>
  );
}
