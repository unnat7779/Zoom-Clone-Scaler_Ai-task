"use client";

import type { Size } from "@/shared/hooks";
import type { StageTile } from "../../hooks/useStageTiles";
import { GALLERY_AREA_BOTTOM, GALLERY_AREA_TOP, galleryLayout } from "../../utils/galleryLayout";
import { VideoTile } from "./VideoTile";

interface GalleryViewProps {
  tiles: StageTile[];
  stage: Size;
  /** id of the participant talking (ring only with more than 2 participants) */
  talkingId: number | null;
  participantCount: number;
}

/** Desktop gallery: Zoom's 16:9 grid between the header and the toolbar (PRD §8.3.3). */
export function GalleryView({ tiles, stage, talkingId, participantCount }: GalleryViewProps) {
  const rects = galleryLayout(tiles.length, stage.width, stage.height - GALLERY_AREA_TOP - GALLERY_AREA_BOTTOM);
  return (
    <>
      {tiles.map((tile, index) => {
        const rect = rects[index];
        if (!rect) return null;
        return (
          <VideoTile
            key={tile.participant.id}
            tile={tile}
            rect={{ ...rect, y: rect.y + GALLERY_AREA_TOP }}
            active={participantCount > 2 && tile.participant.id === talkingId}
          />
        );
      })}
    </>
  );
}
