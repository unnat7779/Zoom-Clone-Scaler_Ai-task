"use client";

import type { LeftReason } from "../../utils/leftPage";
import { useMeetingRoom } from "../../realtime/useMeetingRoom";
import { useRoomUi } from "../../state/useRoomUi";
import { CaptionsDialog } from "./CaptionsDialog";
import { DarkDialog } from "./DarkDialog";
import { MuteAllDialog } from "./MuteAllDialog";
import { RemoveParticipantDialog } from "./RemoveParticipantDialog";

/**
 * Host confirmations, the static captions dialog, plus the "meeting ended" / "joined elsewhere" /
 * "disconnected" endings (PRD §8.12).
 */
export function RoomDialogs({ onExit }: { onExit: (reason: LeftReason | "home") => void }) {
  const { phase } = useMeetingRoom();
  const { dialog, closeDialog } = useRoomUi();

  if (phase === "ended") {
    const ok = () => onExit("ended");
    return <DarkDialog title="This meeting has been ended by host" onDismiss={ok} actions={[{ label: "OK", kind: "primary", onClick: ok }]} />;
  }
  if (phase === "duplicate") {
    const ok = () => onExit("home");
    return (
      <DarkDialog title="You have joined this meeting on another platform." onDismiss={ok} actions={[{ label: "OK", kind: "primary", onClick: ok }]}>
        This window will be exited.
      </DarkDialog>
    );
  }
  if (phase === "failed") {
    // the socket was refused or every reconnect failed (PRD §9.1.7); Zoom's i18n strings
    const ok = () => onExit("left");
    return (
      <DarkDialog title="Meeting Disconnected" onDismiss={ok} actions={[{ label: "OK", kind: "primary", onClick: ok }]}>
        Network error, please try again.
      </DarkDialog>
    );
  }
  if (dialog?.type === "muteAll") return <MuteAllDialog onClose={closeDialog} />;
  if (dialog?.type === "captions") return <CaptionsDialog onClose={closeDialog} />;
  if (dialog?.type === "remove") {
    return <RemoveParticipantDialog participantId={dialog.participantId} name={dialog.name} onClose={closeDialog} />;
  }
  return null;
}
