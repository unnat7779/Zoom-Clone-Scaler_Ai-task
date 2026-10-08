"use client";

import { MEDIA, useMediaQuery } from "@/shared/hooks";
import { WaitingRoomDesktop } from "./WaitingRoomDesktop";
import { WaitingRoomMobile } from "./WaitingRoomMobile";

export interface WaitingRoomProps {
  topic: string;
  /** "Scheduled: …" / "This is a recurring meeting" / empty */
  scheduleLabel: string;
  inShell: boolean;
  /** the camera chosen before Join (corner self view); null = video off */
  stream: MediaStream | null;
  name: string;
  /** "Exit" / "Leave" */
  onLeave: () => void;
}

/**
 * Waiting for the host (PRD §7.10.1, critic C1): like Zoom, the whole preview is replaced by the
 * waiting-room page — desktop / tablet `.waiting-room-container`, phones `.mobile-waiting-room`.
 * The page keeps polling validate and joins on its own once the host starts.
 */
export function WaitingRoom(props: WaitingRoomProps) {
  const phone = useMediaQuery(MEDIA.handheld);
  return phone ? <WaitingRoomMobile {...props} /> : <WaitingRoomDesktop {...props} />;
}
