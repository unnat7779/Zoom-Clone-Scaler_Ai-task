"use client";

import type { Participant } from "@/shared/types/api";
import { useRoomContext } from "./roomContext";

/** Shown large in speaker view: the detected speaker, else the first remote participant, else self (PRD §8.3.2). */
function resolveActiveSpeaker(detected: number | null, remotes: Participant[], self: Participant | null): number | null {
  if (detected !== null && remotes.some((participant) => participant.id === detected)) return detected;
  return remotes[0]?.id ?? self?.id ?? null;
}

/** Roster (join order), remote media and the active speaker. */
export function useParticipants() {
  const { connection, speakerId } = useRoomContext();
  const { participants, selfId, streams, connections } = connection.state;
  const self = participants.find((participant) => participant.id === selfId) ?? null;
  const remotes = participants.filter((participant) => participant.id !== selfId);
  return {
    participants,
    self,
    remotes,
    streams,
    connections,
    activeSpeakerId: resolveActiveSpeaker(speakerId, remotes, self),
    /** who actually talked last (gallery ring); null until someone does */
    talkingId: remotes.some((participant) => participant.id === speakerId) ? speakerId : null,
    count: participants.length,
  };
}
