"use client";

import type { Participant } from "@/shared/types/api";
import { useLocalControls } from "../realtime/useLocalControls";
import { useParticipants } from "../realtime/useParticipants";
import { useRoomUi } from "../state/useRoomUi";

export interface StageTile {
  participant: Participant;
  isSelf: boolean;
  /** stream shown in the tile (remote media, or the local camera for self) */
  stream: MediaStream | null;
  /** camera on and frames available → <video>, else the avatar name */
  showVideo: boolean;
  /** self: the local state (immediate); others: the server roster */
  audioMuted: boolean;
}

/**
 * Tiles for the current view (PRD §8.3): gallery = remote participants in join
 * order then self; speaker = the active speaker large plus a filmstrip of the
 * others in join order. "Hide Self View" drops the self tile.
 */
export function useStageTiles() {
  const { participants, self, streams, activeSpeakerId, count } = useParticipants();
  const { audioMuted, videoOn, selfVideoStream } = useLocalControls();
  const { view, hideSelfView } = useRoomUi();

  const toTile = (participant: Participant): StageTile => {
    const isSelf = participant.id === self?.id;
    const stream = isSelf ? selfVideoStream : (streams[participant.id] ?? null);
    const hasVideoTrack = Boolean(stream?.getVideoTracks().length);
    return {
      participant,
      isSelf,
      stream,
      showVideo: (isSelf ? videoOn : participant.video_on) && hasVideoTrack,
      audioMuted: isSelf ? audioMuted : participant.audio_muted,
    };
  };
  const visible = participants.filter((participant) => !(hideSelfView && participant.id === self?.id));
  const gallery = [...visible.filter((item) => item.id !== self?.id), ...visible.filter((item) => item.id === self?.id)];
  const active = visible.find((participant) => participant.id === activeSpeakerId) ?? visible[0] ?? null;

  return {
    view,
    participantCount: count,
    gallery: gallery.map(toTile),
    active: active ? toTile(active) : null,
    filmstrip: visible.filter((participant) => participant.id !== active?.id).map(toTile),
  };
}
