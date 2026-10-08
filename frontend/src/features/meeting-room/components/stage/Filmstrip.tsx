"use client";

import clsx from "clsx";
import { useFilmstripPage } from "../../hooks/useFilmstripPage";
import type { StageTile } from "../../hooks/useStageTiles";
import { FILMSTRIP_PADDING, type FilmstripMetrics } from "../../utils/speakerLayout";
import { VideoTile } from "./VideoTile";
import styles from "./Filmstrip.module.css";

interface FilmstripProps {
  tiles: StageTile[];
  stageWidth: number;
  /** desktop: 207×117 thumbnails, 32px page buttons (PRD §8.3.2); phones: smaller thumbnails, 44px buttons */
  metrics: FilmstripMetrics;
}

/** Strip at y=48 (padding 3px 0) with its thumbnails centred and ‹ › page buttons when they overflow. */
export function Filmstrip({ tiles, stageWidth, metrics }: FilmstripProps) {
  const { visible, paged, canPrevious, canNext, previous, next } = useFilmstripPage(tiles, stageWidth, metrics);
  const { thumbWidth, thumbHeight, pagerWidth } = metrics;
  const top = metrics.top + FILMSTRIP_PADDING;
  const groupWidth = visible.length * thumbWidth;
  const left = Math.floor((stageWidth - groupWidth) / 2);
  const pagerBox = { top, width: pagerWidth, height: thumbHeight };
  return (
    <>
      {paged ? (
        <button
          type="button"
          className={clsx(styles.pager, styles.previous)}
          style={{ ...pagerBox, left: left - pagerWidth }}
          aria-label="Previous page"
          disabled={!canPrevious}
          onClick={previous}
        >
          <span className={styles.chevron} />
        </button>
      ) : null}
      {visible.map((tile, index) => (
        <VideoTile key={tile.participant.id} tile={tile} rect={{ x: left + index * thumbWidth, y: top, width: thumbWidth, height: thumbHeight }} />
      ))}
      {paged ? (
        <button
          type="button"
          className={clsx(styles.pager, styles.next)}
          style={{ ...pagerBox, left: left + groupWidth }}
          aria-label="Next page"
          disabled={!canNext}
          onClick={next}
        >
          <span className={styles.chevron} />
        </button>
      ) : null}
    </>
  );
}
