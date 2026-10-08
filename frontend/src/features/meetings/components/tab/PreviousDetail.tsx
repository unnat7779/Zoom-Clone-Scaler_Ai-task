"use client";

import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { formatMeetingNumber, formatTimeRange, parseApiDate } from "@/shared/lib/format";
import type { InstanceListItem } from "@/shared/types/api";
import { Button } from "@/shared/ui/Button";
import { useInstanceDetail } from "../../api/meetingQueries";
import { meetingRefOf, startHref } from "../../utils/meetingRef";
import { participantNames } from "../../utils/participants";
import { CopyInvitationButton } from "./CopyInvitationButton";
import { DetailFrame } from "./DetailFrame";
import { DetailRow } from "./DetailRow";

/**
 * Previous meeting (DV3) [D]: date + actual times, host, number, duration and
 * participants; Start / Copy Invitation while the meeting definition still exists.
 */
export function PreviousDetail({ instance }: { instance: InstanceListItem }) {
  const router = useRouter();
  const detail = useInstanceDetail(instance.uuid);
  const started = parseApiDate(instance.started_at);
  const range = formatTimeRange(started, parseApiDate(instance.ended_at));
  const number = instance.meeting_number;
  const meetingRef = meetingRefOf(instance);
  const names = detail.data ? participantNames(detail.data.participants) : null;
  const startable = instance.meeting_exists && instance.type !== "instant";

  return (
    <DetailFrame
      topic={instance.topic}
      rows={
        <>
          <DetailRow>
            {format(started, "EEE, MMM d, yyyy")} · {range}
          </DetailRow>
          <DetailRow>Host: {instance.host_name}</DetailRow>
          <DetailRow>Meeting ID: {formatMeetingNumber(number)}</DetailRow>
          <DetailRow>Duration: {instance.duration_minutes} min</DetailRow>
          <DetailRow>Participants: {instance.participant_count}</DetailRow>
          {names ? <DetailRow>Attendees: {names}</DetailRow> : null}
        </>
      }
      actions={
        instance.meeting_exists ? (
          <>
            {startable ? (
              <Button family="z" variant="normal" onClick={() => router.push(startHref(meetingRef))}>
                Start
              </Button>
            ) : null}
            <CopyInvitationButton meetingRef={meetingRef} />
          </>
        ) : null
      }
    />
  );
}
