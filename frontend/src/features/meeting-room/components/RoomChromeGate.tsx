"use client";

import type { ReactNode } from "react";
import { MeetingChromeGate } from "@/features/shell";

/**
 * Layout gate of `/wc/[number]/*`. It always renders the same element around the room, so
 * crossing the phone breakpoint never remounts the meeting (which would drop the socket,
 * peers and streams, R7 F13); the shell's gate decides the chrome, phones included (DV10).
 */
export function RoomChromeGate({ children }: { children: ReactNode }) {
  return <MeetingChromeGate>{children}</MeetingChromeGate>;
}
