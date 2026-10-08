"use client";

import type { RefObject } from "react";
import { RoomFloating } from "../../menus/RoomFloating";
import type { ParticipantRowModel } from "../../../hooks/useParticipantRows";
import { useHostControls } from "../../../realtime/useHostControls";
import { useLocalControls } from "../../../realtime/useLocalControls";
import { useRoomUi } from "../../../state/useRoomUi";
import { type ParticipantMenuAction, participantMenuEntries } from "../../../utils/participantMenu";
import styles from "./RowMenu.module.css";

interface ParticipantRowMenuProps {
  row: ParticipantRowModel;
  open: boolean;
  anchorRef: RefObject<HTMLButtonElement | null>;
  onClose: () => void;
}

/** Row "…" menu under its button, right-aligned (PRD §8.8); the entries come from `participantMenuEntries`. */
export function ParticipantRowMenu({ row, open, anchorRef, onClose }: ParticipantRowMenuProps) {
  const { isHost } = useHostControls();
  const local = useLocalControls();
  const { openDialog } = useRoomUi();
  const { participant, videoOn } = row;

  const run = (action: ParticipantMenuAction | undefined) => {
    onClose();
    if (action === "toggleSelfVideo") local.setVideo(!videoOn);
    else if (action === "remove") openDialog({ type: "remove", participantId: participant.id, name: participant.display_name });
  };

  return (
    <RoomFloating open={open} onClose={onClose} anchorRef={anchorRef} placement="bottom-end" offset={2} className={styles.menu} aria-label="More options">
      {participantMenuEntries(row, isHost).map((entry, index) =>
        entry === "divider" ? (
          <div key={`divider-${index}`} className={styles.divider} role="separator" />
        ) : (
          <button key={entry.label} type="button" role="menuitem" className={styles.item} onClick={() => run(entry.action)}>
            {entry.label}
          </button>
        ),
      )}
    </RoomFloating>
  );
}
