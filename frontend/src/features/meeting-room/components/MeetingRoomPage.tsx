"use client";

import { useEffect } from "react";
import { forgetRoomSession, useRoomSession } from "../hooks/useRoomSession";
import { RoomProvider } from "../realtime/RoomProvider";
import { RoomUiProvider } from "../state/RoomUiProvider";
import { MeetingRoom } from "./MeetingRoom/MeetingRoom";
import { RoomFrame } from "./RoomFrame/RoomFrame";

/** `/wc/{number}/meeting` (PRD §8): needs the start/join hand-off, else → pre-join. */
export function MeetingRoomPage({ number }: { number: string }) {
  const { session, inShell } = useRoomSession(number);

  useEffect(() => () => forgetRoomSession(number), [number]);

  if (!session) return <RoomFrame inShell={inShell} />;
  return (
    <RoomProvider number={number} session={session} inShell={inShell}>
      <RoomUiProvider>
        <MeetingRoom />
      </RoomUiProvider>
    </RoomProvider>
  );
}
