"use client";

import { type ReactNode, useRef } from "react";
import { MtgMicMutedIcon } from "@/shared/icons/generated/MtgMicMutedIcon";
import { RoomAudioDisallowedIcon } from "@/shared/icons/generated/RoomAudioDisallowedIcon";
import { RoomJoinAudioIcon } from "@/shared/icons/generated/RoomJoinAudioIcon";
import { AudioLevelIcon } from "@/shared/media";
import { useLocalControls } from "../../realtime/useLocalControls";
import { useRoomUi } from "../../state/useRoomUi";
import { type AudioControlState, audioControlState } from "../../utils/localControlState";
import { AudioMenu } from "./AudioMenu";
import { ToolbarButton } from "./ToolbarButton";

const LABELS: Record<AudioControlState, { label: string; ariaLabel: string }> = {
  joining: { label: "Join Audio", ariaLabel: "join audio" },
  blocked: { label: "Audio", ariaLabel: "audio" },
  muted: { label: "Unmute", ariaLabel: "unmute my microphone" },
  live: { label: "Mute", ariaLabel: "mute my microphone" },
};

/**
 * Join Audio (microphone request pending: Zoom's `SvgJoinAudio`, no caret — the audio menu exists
 * only once computer audio is joined) / Mute / Unmute / Audio (permission denied)
 * + microphone & speaker menu (PRD §8.5.3, §8.6.2; labels from spec 05 §5.3 [J]).
 */
export function AudioButton() {
  const { audioJoining, audioMuted, audioBlocked, audioStream, toggleAudio } = useLocalControls();
  const { menu, toggleMenu, closeMenu } = useRoomUi();
  const caretRef = useRef<HTMLButtonElement | null>(null);
  const state = audioControlState({ joining: audioJoining, blocked: audioBlocked, muted: audioMuted });
  const icons: Record<AudioControlState, () => ReactNode> = {
    joining: () => <RoomJoinAudioIcon />,
    blocked: () => <RoomAudioDisallowedIcon />,
    muted: () => <MtgMicMutedIcon />,
    live: () => <AudioLevelIcon stream={audioStream} />,
  };

  return (
    <ToolbarButton
      label={LABELS[state].label}
      ariaLabel={LABELS[state].ariaLabel}
      icon={icons[state]()}
      onClick={toggleAudio}
      wide
      caretRef={caretRef}
      caret={state === "joining" ? undefined : { ariaLabel: "More audio controls", open: menu === "audio", onClick: () => toggleMenu("audio") }}
    >
      {menu === "audio" && state !== "joining" ? <AudioMenu anchorRef={caretRef} onClose={closeMenu} /> : null}
    </ToolbarButton>
  );
}
