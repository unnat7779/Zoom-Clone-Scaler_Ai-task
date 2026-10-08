"use client";

import { useRoomExit } from "../../hooks/useRoomExit";
import { useRoomShellIntegration } from "../../hooks/useRoomShellIntegration";
import { useMeetingRoom } from "../../realtime/useMeetingRoom";
import { useRoomUi } from "../../state/useRoomUi";
import { RemoteAudioPlayers } from "../audio/RemoteAudioPlayers";
import { BreakoutRoomsWindow } from "../breakout/BreakoutRoomsWindow";
import { RosterAnnouncer } from "../audio/RosterAnnouncer";
import { RoomDialogs } from "../dialogs/RoomDialogs";
import { InviteWindow } from "../invite/InviteWindow";
import { RightPanels } from "../panels/RightPanels";
import { RoomFrame } from "../RoomFrame/RoomFrame";
import { RoomSettingsWindow } from "../settings/RoomSettingsWindow";
import { Stage } from "../stage/Stage";

/** `#wc-content`: stage + right panels, room-scoped windows / dialogs and the remote audio (PRD §8.2). */
export function MeetingRoom() {
  const { inShell } = useMeetingRoom();
  const { roomRef, panels, inviteOpen, settingsTab, breakoutOpen } = useRoomUi();
  const exit = useRoomExit();
  useRoomShellIntegration();

  return (
    <RoomFrame ref={roomRef} inShell={inShell}>
      <Stage />
      {panels.length > 0 ? <RightPanels /> : null}
      {inviteOpen ? <InviteWindow /> : null}
      {settingsTab ? <RoomSettingsWindow tab={settingsTab} /> : null}
      {breakoutOpen ? <BreakoutRoomsWindow /> : null}
      <RoomDialogs onExit={exit} />
      <RemoteAudioPlayers />
      <RosterAnnouncer />
    </RoomFrame>
  );
}
