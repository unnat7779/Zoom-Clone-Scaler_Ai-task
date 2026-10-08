"use client";

import { useRef } from "react";
import { useToggle } from "@/shared/hooks";
import { useHostControls } from "../../../realtime/useHostControls";
import { useLocalControls } from "../../../realtime/useLocalControls";
import { useRoomUi } from "../../../state/useRoomUi";
import { FooterMoreMenu } from "./FooterMoreMenu";
import styles from "./ParticipantsFooter.module.css";

/** Host: Invite · Mute All · More. Attendee: Invite · Unmute / Mute (own mic). */
export function ParticipantsFooter() {
  const { isHost } = useHostControls();
  const { audioMuted, audioBlocked, toggleAudio } = useLocalControls();
  const { setInviteOpen, openDialog } = useRoomUi();
  const [moreOpen, toggleMore, setMoreOpen] = useToggle(false);
  const moreRef = useRef<HTMLButtonElement | null>(null);

  return (
    <div className={styles.footer}>
      <button type="button" className={styles.pill} onClick={() => setInviteOpen(true)}>
        Invite
      </button>
      {isHost ? (
        <>
          <button type="button" className={styles.pill} onClick={() => openDialog({ type: "muteAll" })}>
            Mute All
          </button>
          <button ref={moreRef} type="button" className={styles.pill} aria-haspopup="menu" aria-expanded={moreOpen} onClick={toggleMore}>
            More
          </button>
          <FooterMoreMenu open={moreOpen} anchorRef={moreRef} onClose={() => setMoreOpen(false)} />
        </>
      ) : (
        <button type="button" className={styles.pill} onClick={toggleAudio}>
          {audioMuted || audioBlocked ? "Unmute" : "Mute"}
        </button>
      )}
    </div>
  );
}
