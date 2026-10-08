"use client";

import type { MeetingValidation } from "@/shared/types/api";
import { usePreJoinEntry } from "../hooks/usePreJoinEntry";
import { usePreJoinParams } from "../hooks/usePreJoinParams";
import { usePreviewMedia } from "../hooks/usePreviewMedia";
import { formatScheduledLabel } from "../utils/scheduledLabel";
import { MeetingInfoForm } from "./MeetingInfoForm/MeetingInfoForm";
import { PreJoinLayout } from "./PreJoinLayout/PreJoinLayout";
import { PreviewCard } from "./PreviewCard/PreviewCard";
import { WaitingRoom } from "./WaitingRoom/WaitingRoom";

interface PreJoinScreenProps {
  number: string;
  validation: MeetingValidation;
  revalidate: () => void;
}

/** The dark pre-join page: live preview card + "Enter Meeting Info"; after Join on a meeting that has not started, Zoom's waiting room. */
export function PreJoinScreen({ number, validation, revalidate }: PreJoinScreenProps) {
  const { inShell } = usePreJoinParams();
  const media = usePreviewMedia({
    participantVideoOn: validation.participant_video_on,
    muteUponEntry: validation.mute_upon_entry,
  });
  const entry = usePreJoinEntry({ number, validation, revalidate, entryPreferences: media.entryPreferences });

  if (entry.onHold) {
    return (
      <WaitingRoom
        topic={validation.topic ?? ""}
        scheduleLabel={formatScheduledLabel(validation.start_time, new Date(), validation.is_recurring)}
        inShell={inShell}
        stream={media.videoStream}
        name={entry.form.name.trim()}
        onLeave={entry.leave}
      />
    );
  }
  return (
    <PreJoinLayout inShell={inShell} preview={<PreviewCard media={media} />}>
      <MeetingInfoForm form={entry.form} joining={entry.joining} onSubmit={entry.submit} />
    </PreJoinLayout>
  );
}
