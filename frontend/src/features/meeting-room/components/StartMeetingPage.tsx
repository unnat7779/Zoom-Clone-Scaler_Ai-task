"use client";

import { useStartMeeting } from "../hooks/useStartMeeting";
import { DarkDialog } from "./dialogs/DarkDialog";
import { RoomFrame } from "./RoomFrame/RoomFrame";

/** `/wc/{number}/start`: dark room frame with a spinner while the host start runs (PRD §7.3). */
export function StartMeetingPage({ number }: { number: string }) {
  const { error, inShell, goHome } = useStartMeeting(number);
  if (!error) return <RoomFrame inShell={inShell} />;
  return (
    <RoomFrame inShell={inShell}>
      <DarkDialog title={error} onDismiss={goHome} actions={[{ label: "OK", kind: "primary", onClick: goHome }]} />
    </RoomFrame>
  );
}
