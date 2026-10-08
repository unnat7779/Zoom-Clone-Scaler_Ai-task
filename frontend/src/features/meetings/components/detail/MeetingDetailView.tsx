"use client";

import clsx from "clsx";
import { MtgPortalShieldCheckIcon } from "@/shared/icons/generated/MtgPortalShieldCheckIcon";
import { formatMeetingNumber } from "@/shared/lib/format";
import type { Meeting } from "@/shared/types/api";
import { useDetailActions } from "../../hooks/useDetailActions";
import { DeleteMeetingModal } from "../tab/DeleteMeetingModal";
import { AddToLinks } from "./AddToLinks";
import { CopyInvitationDialog } from "./CopyInvitationDialog";
import { DetailActionBar } from "./DetailActionBar";
import { DetailItem } from "./DetailItem";
import { DetailValue } from "./DetailValue";
import { InviteLinkValue } from "./InviteLinkValue";
import { SecurityValue } from "./SecurityValue";
import { VideoValue } from "./VideoValue";
import styles from "./MeetingDetailView.module.css";

interface MeetingDetailViewProps {
  meeting: Meeting;
  /** Personal Room: inside Zoom's tab content (`padding: 0 16px` → form x=348, w=955) */
  inset?: boolean;
}

/** Label/value grid of `/meeting/{n}` + sticky action bar and its dialogs (PRD §7.8.2–7.8.5). */
export function MeetingDetailView({ meeting, inset = false }: MeetingDetailViewProps) {
  const actions = useDetailActions(meeting);
  const options = [
    meeting.join_before_host ? "Allow participants to join anytime" : null,
    meeting.mute_upon_entry ? "Mute participants upon entry" : null,
  ].filter((option): option is string => option !== null);

  return (
    <div className={clsx(styles.form, { [styles.formInset ?? ""]: inset })}>
      <DetailItem label="Topic">
        <DetailValue>{meeting.topic}</DetailValue>
      </DetailItem>
      {meeting.description ? (
        <DetailItem label="Description">
          <DetailValue className={styles.description}>{meeting.description}</DetailValue>
        </DetailItem>
      ) : null}
      {meeting.time_label ? (
        <DetailItem label="Time">
          <DetailValue>{meeting.time_label}</DetailValue>
        </DetailItem>
      ) : null}
      <DetailItem label="Meeting ID">
        <DetailValue>{formatMeetingNumber(meeting.meeting_number)}</DetailValue>
      </DetailItem>
      <DetailItem label="Security">
        <SecurityValue passcode={meeting.passcode} waitingRoom={meeting.waiting_room} />
      </DetailItem>
      <DetailItem label="Invite Link">
        <InviteLinkValue url={meeting.invite_url} />
      </DetailItem>
      <DetailItem label="Add to">
        <AddToLinks />
      </DetailItem>
      <div className={styles.divider} />
      <DetailItem label="Encryption">
        <p className={styles.encryption}>
          <MtgPortalShieldCheckIcon className={styles.shield} />
          Enhanced encryption
        </p>
      </DetailItem>
      <DetailItem label="My Notes">
        <DetailValue>Allow participants to transcribe meeting with My Notes</DetailValue>
        <p className={styles.muted}>All participants</p>
      </DetailItem>
      <DetailItem label="Video">
        <VideoValue host={meeting.host_video_on} participant={meeting.participant_video_on} />
      </DetailItem>
      {options.length > 0 ? (
        <DetailItem label="Options">
          {options.map((option) => (
            <p key={option} className={styles.option}>
              {option}
            </p>
          ))}
        </DetailItem>
      ) : null}
      <DetailActionBar meeting={meeting} actions={actions} />
      <CopyInvitationDialog open={actions.copy.open} text={actions.copy.text} onClose={actions.copy.close} />
      <DeleteMeetingModal
        variant="portal"
        open={actions.remove.open}
        pending={actions.remove.pending}
        onConfirm={actions.remove.confirm}
        onClose={actions.remove.close}
      />
    </div>
  );
}
