"use client";

import { useParticipants } from "../../realtime/useParticipants";

/** Zoom shows no joined/left toasts; screen readers hear the roster change instead (PRD §8.13, §12). */
export function RosterAnnouncer() {
  const { count } = useParticipants();
  return (
    <div className="visually-hidden" aria-live="polite">
      {count > 0 ? `${count} ${count === 1 ? "participant" : "participants"} in the meeting` : ""}
    </div>
  );
}
