"use client";

import { type ReactNode, useCallback, useMemo } from "react";
import { useMediaDevices } from "@/shared/media";
import type { StoredMeetingSession } from "@/shared/lib/meetingSession";
import { useRoomToasts } from "../hooks/useRoomToasts";
import { announceRoomEvent } from "../utils/announceRoomEvent";
import type { RoomEvent } from "./messageHandler";
import { RoomContext } from "./roomContext";
import { useActiveSpeaker } from "./useActiveSpeaker";
import { useRoomConnection } from "./useRoomConnection";
import { useRoomMedia } from "./useRoomMedia";

interface RoomProviderProps {
  number: string;
  session: StoredMeetingSession;
  inShell: boolean;
  children: ReactNode;
}

/** Owns the meeting: local media and device lists, signalling, peers, active speaker and room toasts. */
export function RoomProvider({ number, session, inShell, children }: RoomProviderProps) {
  const toasts = useRoomToasts();
  const { show, dismiss } = toasts;
  const { preferences } = session;
  const media = useRoomMedia({
    displayName: session.participant.display_name,
    initialAudioMuted: preferences.audioMuted,
    initialVideoOn: preferences.videoOn,
    audioInputId: preferences.audioInputId,
    videoInputId: preferences.videoInputId,
    audioOutputId: preferences.audioOutputId,
  });
  // listed once for the room (labels appear after a grant), so the device menus open fully populated
  const devices = useMediaDevices(`${media.ready}|${media.audioTrack?.id ?? ""}|${media.videoTrack?.id ?? ""}`);
  const onEvent = useCallback((event: RoomEvent) => announceRoomEvent({ show, dismiss }, event), [show, dismiss]);
  const connection = useRoomConnection({ number, token: session.token, media, onEvent });
  const { streams, participants, selfId } = connection.state;
  const speakerId = useActiveSpeaker(streams, participants, selfId);

  const value = useMemo(
    () => ({ number, inShell, session, media, devices, connection, speakerId, toasts }),
    [number, inShell, session, media, devices, connection, speakerId, toasts],
  );
  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
}
