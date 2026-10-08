"use client";

import { useRef } from "react";
import { useClipboard } from "@/shared/hooks";
import { MtgParticipantsIcon } from "@/shared/icons/generated/MtgParticipantsIcon";
import { useMeetingRoom } from "../../realtime/useMeetingRoom";
import { useRoomUi } from "../../state/useRoomUi";
import { ParticipantsMenu } from "./ParticipantsMenu";
import { ToolbarButton } from "./ToolbarButton";
import styles from "./ParticipantsButton.module.css";

/** "Invite link has been copied to clipboard" stays ≈2 s (PRD §8.6.4). */
const COPIED_TOOLTIP_MS = 2000;

/** Participants (count badge) toggles the panel; its caret has Invite / Copy invite link. */
export function ParticipantsButton() {
  const { meeting, participantCount } = useMeetingRoom();
  const { panels, menu, togglePanel, toggleMenu, closeMenu } = useRoomUi();
  const caretRef = useRef<HTMLButtonElement | null>(null);
  const { copy, copied } = useClipboard({ resetAfter: COPIED_TOOLTIP_MS });
  const open = panels.includes("participants");
  // Zoom's screen-reader string, typo included ("particpants")
  const ariaLabel = `${open ? "close" : "open"} the manage participants list pane,${participantCount} particpants`;

  return (
    <ToolbarButton
      label="Participants"
      ariaLabel={ariaLabel}
      icon={
        <>
          <MtgParticipantsIcon />
          <span className={styles.counter}>{participantCount || ""}</span>
        </>
      }
      onClick={() => togglePanel("participants")}
      caretRef={caretRef}
      caret={{ ariaLabel: "Participants Settings", open: menu === "participants", onClick: () => toggleMenu("participants") }}
    >
      {menu === "participants" ? (
        <ParticipantsMenu anchorRef={caretRef} onClose={closeMenu} onCopyLink={() => void copy(meeting?.invite_url ?? "")} />
      ) : null}
      {copied ? (
        <div className={styles.tooltip} role="status">
          Invite link has been copied to clipboard
        </div>
      ) : null}
    </ToolbarButton>
  );
}
