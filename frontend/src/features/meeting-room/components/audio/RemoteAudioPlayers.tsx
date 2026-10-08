"use client";

import { useRoomContext } from "../../realtime/roomContext";
import { useParticipants } from "../../realtime/useParticipants";
import { RemoteAudio } from "./RemoteAudio";

/** One audio element per remote participant (video elements stay muted). */
export function RemoteAudioPlayers() {
  const { remotes, streams } = useParticipants();
  const { media } = useRoomContext();
  return (
    <>
      {remotes.map((participant) => {
        const stream = streams[participant.id];
        return stream ? <RemoteAudio key={participant.id} stream={stream} sinkId={media.audioOutputId} /> : null;
      })}
    </>
  );
}
