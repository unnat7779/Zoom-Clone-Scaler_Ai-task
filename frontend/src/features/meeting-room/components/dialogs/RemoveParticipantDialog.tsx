"use client";

import { useHostControls } from "../../realtime/useHostControls";
import { DarkDialog } from "./DarkDialog";

interface RemoveParticipantDialogProps {
  participantId: number;
  name: string;
  onClose: () => void;
}

/** Row "…" → Remove (PRD §8.12.2) with Zoom's `wc_remove_user` string; the participant cannot rejoin. */
export function RemoveParticipantDialog({ participantId, name, onClose }: RemoveParticipantDialogProps) {
  const { remove } = useHostControls();
  return (
    <DarkDialog
      title={`Do you want to remove ${name}?`}
      onDismiss={onClose}
      actions={[
        { label: "Cancel", onClick: onClose },
        {
          label: "Remove",
          kind: "danger",
          onClick: () => {
            remove(participantId);
            onClose();
          },
        },
      ]}
    />
  );
}
