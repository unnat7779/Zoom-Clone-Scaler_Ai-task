"use client";

import { useRouter } from "next/navigation";
import { formatMeetingNumber } from "@/shared/lib/format";
import { routes } from "@/shared/lib/routes";
import type { MeetingListItem } from "@/shared/types/api";
import { MtgMeetingsDeleteXIcon } from "@/shared/icons/generated/MtgMeetingsDeleteXIcon";
import { MtgMeetingsEditIcon } from "@/shared/icons/generated/MtgMeetingsEditIcon";
import { Button } from "@/shared/ui/Button";
import { useDeleteMeetingFlow } from "../../hooks/useDeleteMeetingFlow";
import { meetingRefOf, startHref } from "../../utils/meetingRef";
import { scheduledTimeRange } from "../../utils/rows";
import { CopyInvitationButton } from "./CopyInvitationButton";
import { DeleteMeetingModal } from "./DeleteMeetingModal";
import { DetailFrame } from "./DetailFrame";
import { DetailRow } from "./DetailRow";
import { InvitationBlock } from "./InvitationBlock";
import { TimeRow } from "./TimeRow";

interface ScheduledDetailProps {
  meeting: MeetingListItem;
  onDeleted: () => void;
}

/**
 * Scheduled (or live instant) meeting: time row with notice, `Host:`, `Meeting ID:`;
 * Start · Copy Invitation · Edit · Delete — Edit/Delete only for scheduled rows, disabled while live.
 */
export function ScheduledDetail({ meeting, onDeleted }: ScheduledDetailProps) {
  const router = useRouter();
  const number = meeting.meeting_number;
  const meetingRef = meetingRefOf(meeting);
  const deletion = useDeleteMeetingFlow(meetingRef, { onDeleted });
  const editable = meeting.type === "scheduled";

  return (
    <DetailFrame
      topic={meeting.topic}
      rows={
        <>
          <TimeRow
            range={scheduledTimeRange(meeting.start_time, meeting.duration_minutes)}
            startIso={meeting.start_time}
            durationMinutes={meeting.duration_minutes}
            isLive={meeting.is_live}
          />
          <DetailRow>Host: {meeting.host_name}</DetailRow>
          <DetailRow>Meeting ID: {formatMeetingNumber(number)}</DetailRow>
        </>
      }
      actions={
        <>
          <Button family="z" variant="normal" onClick={() => router.push(startHref(meetingRef))}>
            Start
          </Button>
          <CopyInvitationButton meetingRef={meetingRef} />
          {editable ? (
            <>
              <Button
                family="z"
                variant="tertiary"
                leadingIcon={<MtgMeetingsEditIcon />}
                disabled={meeting.is_live}
                onClick={() => router.push(routes.meetingEdit(number, { id: meetingRef.id }))}
              >
                Edit
              </Button>
              <Button
                family="z"
                variant="tertiary-danger"
                leadingIcon={<MtgMeetingsDeleteXIcon />}
                disabled={meeting.is_live}
                onClick={deletion.openModal}
              >
                Delete
              </Button>
            </>
          ) : null}
        </>
      }
    >
      <InvitationBlock meetingRef={meetingRef} />
      <DeleteMeetingModal open={deletion.open} pending={deletion.pending} onConfirm={deletion.confirm} onClose={deletion.close} />
    </DetailFrame>
  );
}
