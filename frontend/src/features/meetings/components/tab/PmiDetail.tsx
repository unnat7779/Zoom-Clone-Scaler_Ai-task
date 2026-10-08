"use client";

import { useRouter } from "next/navigation";
import { formatMeetingNumber } from "@/shared/lib/format";
import { routes } from "@/shared/lib/routes";
import type { Meeting } from "@/shared/types/api";
import { MtgMeetingsEditIcon } from "@/shared/icons/generated/MtgMeetingsEditIcon";
import { Button } from "@/shared/ui/Button";
import { CopyInvitationButton } from "./CopyInvitationButton";
import { DetailFrame } from "./DetailFrame";
import { DetailRow } from "./DetailRow";
import { startHref } from "../../utils/meetingRef";
import { InvitationBlock } from "./InvitationBlock";

/** PMI selected: topic + number only; Start · Copy Invitation · Edit (PRD §7.4.3). */
export function PmiDetail({ pmi }: { pmi: Meeting }) {
  const router = useRouter();
  const number = pmi.meeting_number;
  const meetingRef = { number };
  return (
    <DetailFrame
      topic="My Personal Meeting ID (PMI)"
      rows={<DetailRow>{formatMeetingNumber(number)}</DetailRow>}
      actions={
        <>
          <Button family="z" variant="normal" onClick={() => router.push(startHref(meetingRef))}>
            Start
          </Button>
          <CopyInvitationButton meetingRef={meetingRef} />
          <Button
            family="z"
            variant="tertiary"
            leadingIcon={<MtgMeetingsEditIcon />}
            disabled={pmi.is_live}
            onClick={() => router.push(routes.meetingEdit(number))}
          >
            Edit
          </Button>
        </>
      }
    >
      <InvitationBlock meetingRef={meetingRef} />
    </DetailFrame>
  );
}
