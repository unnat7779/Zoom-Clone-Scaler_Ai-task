"use client";

import type { RefObject } from "react";
import clsx from "clsx";
import { MtgMicOnIcon } from "@/shared/icons/generated/MtgMicOnIcon";
import { RoomPlParticipantsListAudioMutedIcon } from "@/shared/icons/generated/RoomPlParticipantsListAudioMutedIcon";
import { RoomPlParticipantsListVideoOffIcon } from "@/shared/icons/generated/RoomPlParticipantsListVideoOffIcon";
import { RoomPlSvgEllipsisIcon } from "@/shared/icons/generated/RoomPlSvgEllipsisIcon";
import { RoomPlVideoOnIcon } from "@/shared/icons/generated/RoomPlVideoOnIcon";
import type { ParticipantRowModel } from "../../../hooks/useParticipantRows";
import { useHostControls } from "../../../realtime/useHostControls";
import { useLocalControls } from "../../../realtime/useLocalControls";
import styles from "./ParticipantRow.module.css";

interface ParticipantRowActionsProps {
  row: ParticipantRowModel;
  moreRef: RefObject<HTMLButtonElement | null>;
  onMore: () => void;
}

/**
 * Mic: self toggles; the host mutes an unmuted participant ("Ask to Unmute" is static).
 * Video: self toggles; others static. "…" opens the row menu.
 */
export function ParticipantRowActions({ row, moreRef, onMore }: ParticipantRowActionsProps) {
  const { participant, isSelf, audioMuted, videoOn } = row;
  const local = useLocalControls();
  const { isHost, mute } = useHostControls();

  const micTitle = audioMuted ? (isSelf ? "Unmute" : "Ask to Unmute") : "Mute";
  const micAction = isSelf ? () => local.setMuted(!audioMuted) : isHost && !audioMuted ? () => mute(participant.id) : undefined;
  const videoAction = isSelf ? () => local.setVideo(!videoOn) : undefined;

  return (
    <div className={styles.actions}>
      <button type="button" className={clsx(styles.icon, !micAction && styles.inert)} title={micTitle} aria-label={micTitle} onClick={micAction}>
        {audioMuted ? <RoomPlParticipantsListAudioMutedIcon className={styles.danger} /> : <MtgMicOnIcon />}
      </button>
      <button
        type="button"
        className={clsx(styles.icon, !videoAction && styles.inert)}
        title={videoOn ? "Stop Video" : "Start Video"}
        aria-label={videoOn ? "Stop Video" : "Start Video"}
        onClick={videoAction}
      >
        {videoOn ? <RoomPlVideoOnIcon className={styles.videoOn} /> : <RoomPlParticipantsListVideoOffIcon />}
      </button>
      <button ref={moreRef} type="button" className={clsx(styles.icon, styles.more)} title="More options" aria-label="More options" onClick={onMore}>
        <RoomPlSvgEllipsisIcon />
      </button>
    </div>
  );
}
