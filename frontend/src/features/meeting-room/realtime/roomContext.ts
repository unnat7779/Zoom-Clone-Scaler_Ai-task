"use client";

import { createContext, useContext } from "react";
import type { StoredMeetingSession } from "@/shared/lib/meetingSession";
import type { MediaDeviceLists } from "@/shared/media";
import type { RoomToasts } from "../hooks/useRoomToasts";
import type { RoomConnection } from "./useRoomConnection";
import type { RoomMedia } from "./useRoomMedia";

export interface RoomContextValue {
  number: string;
  /** rendered inside the Workplace shell (`?fromPWA=1`) */
  inShell: boolean;
  session: StoredMeetingSession;
  media: RoomMedia;
  /** microphones / speakers / cameras, re-listed after a grant or a device change */
  devices: MediaDeviceLists;
  connection: RoomConnection;
  /** detected active speaker (raw; see useParticipants for the resolved one) */
  speakerId: number | null;
  toasts: RoomToasts;
}

export const RoomContext = createContext<RoomContextValue | null>(null);

export function useRoomContext(): RoomContextValue {
  const value = useContext(RoomContext);
  if (!value) throw new Error("Meeting-room hooks must be used inside <RoomProvider>");
  return value;
}
