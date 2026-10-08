import { type ReactNode, Suspense } from "react";
import { RoomChromeGate } from "@/features/meeting-room";

/**
 * `/wc/[number]/(join|start|meeting|left)`: inside the Workplace shell when
 * `?fromPWA=1`, otherwise full viewport (PRD §4.1); the room is full viewport on phones (DV10).
 */
export default function MeetingRouteLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense>
      <RoomChromeGate>{children}</RoomChromeGate>
    </Suspense>
  );
}
