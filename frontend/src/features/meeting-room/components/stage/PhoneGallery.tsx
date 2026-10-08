"use client";

import type { Size } from "@/shared/hooks";
import { usePager } from "../../hooks/usePager";
import type { StageTile } from "../../hooks/useStageTiles";
import { useSwipe } from "../../hooks/useSwipe";
import { GALLERY_AREA_BOTTOM, GALLERY_AREA_TOP } from "../../utils/galleryLayout";
import { PHONE_PAGE_SIZE, phoneGalleryLayout } from "../../utils/phoneGalleryLayout";
import { GalleryPager } from "./GalleryPager";
import { VideoTile } from "./VideoTile";
import styles from "./PhoneGallery.module.css";

/** with more than one page, a strip under the tiles holds the page dots */
const DOTS_STRIP = 16;

interface PhoneGalleryProps {
  tiles: StageTile[];
  stage: Size;
  talkingId: number | null;
  participantCount: number;
}

/**
 * Phone gallery [D] (PRD §11.5.3): pages of up to 4 tiles that fill the area between the header
 * and the toolbar; swipe sideways or use the ‹ › buttons, dots show the page.
 */
export function PhoneGallery({ tiles, stage, talkingId, participantCount }: PhoneGalleryProps) {
  const pager = usePager(tiles, PHONE_PAGE_SIZE);
  const swipe = useSwipe({ onNext: pager.next, onPrevious: pager.previous });
  const paged = pager.pages > 1;
  const areaHeight = stage.height - GALLERY_AREA_TOP - GALLERY_AREA_BOTTOM - (paged ? DOTS_STRIP : 0);
  const rects = phoneGalleryLayout(pager.visible.length, stage.width, areaHeight);
  return (
    <div className={styles.gallery} data-gallery-page={pager.page} {...swipe}>
      {pager.visible.map((tile, index) => {
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
      {paged ? <GalleryPager pager={pager} areaTop={GALLERY_AREA_TOP} areaHeight={areaHeight} /> : null}
    </div>
  );
}
