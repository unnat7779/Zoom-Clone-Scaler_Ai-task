"use client";

import type { MeetingAvatarColor } from "@/shared/lib/avatar";
import type { Participant } from "@/shared/types/api";
import { useLocalControls } from "../realtime/useLocalControls";
import { useParticipants } from "../realtime/useParticipants";
import { avatarColor, panelOrder, participantLabel } from "../utils/participantRows";

export interface ParticipantRowModel {
  participant: Participant;
  isSelf: boolean;
  /** "(Host, me)" / "(Me)" / "(Host)" / "(Guest)" / "" */
  label: string;
  color: MeetingAvatarColor;
  audioMuted: boolean;
  videoOn: boolean;
}

/** Rows of the Participants panel: me, the host, then the rest by join time (PRD §8.8). */
export function useParticipantRows(): ParticipantRowModel[] {
  const { participants, self } = useParticipants();
  const local = useLocalControls();
  return panelOrder(participants, self?.id ?? null).map((participant) => {
    const isSelf = participant.id === self?.id;
    return {
      participant,
      isSelf,
      label: participantLabel(participant, isSelf),
      color: avatarColor(participant, participants),
      audioMuted: isSelf ? local.audioMuted || local.audioBlocked : participant.audio_muted,
      videoOn: isSelf ? local.videoOn : participant.video_on,
    };
  });
}
