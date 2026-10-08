"use client";

import type { Size } from "@/shared/hooks";
import { usePhoneRoom } from "../../hooks/usePhoneRoom";
import { useStageTiles } from "../../hooks/useStageTiles";
import { useParticipants } from "../../realtime/useParticipants";
import { GalleryView } from "./GalleryView";
import { PhoneGallery } from "./PhoneGallery";
import { SpeakerView } from "./SpeakerView";

/** Speaker or gallery tiles for the current stage size (PRD §8.3); phones get their own layouts [D]. */
export function VideoArea({ stage, toolbarVisible }: { stage: Size; toolbarVisible: boolean }) {
  const { view, gallery, active, filmstrip, participantCount } = useStageTiles();
  const { talkingId } = useParticipants();
  const phone = usePhoneRoom();
  if (stage.width === 0) return null;
  if (view === "speaker") {
    return <SpeakerView active={active} filmstrip={filmstrip} stage={stage} toolbarVisible={toolbarVisible} phone={phone} />;
  }
  const Gallery = phone ? PhoneGallery : GalleryView;
  return <Gallery tiles={gallery} stage={stage} talkingId={talkingId} participantCount={participantCount} />;
}
