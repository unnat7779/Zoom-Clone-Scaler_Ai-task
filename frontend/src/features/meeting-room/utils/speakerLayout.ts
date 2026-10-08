/**
 * Speaker view geometry (PRD §8.3.2 [M]): alone → one 16:9 tile fitted to the whole
 * stage (header and toolbar overlay it); with others → a 120px filmstrip at y=48
 * (207×117 thumbnails) and the active speaker as the largest 16:9 tile below y=168.
 *
 * Phones [D] (DV10, PRD §11.5.3) use smaller thumbnails (about a third of a portrait screen),
 * 44px page buttons, and an active tile that may be taller than 16:9 (down to 3:4, the video
 * is cropped at the sides) so it fills a portrait screen.
 */
import { type TileRect, fit16x9 } from "./galleryLayout";
import { fitTileAspect } from "./phoneGalleryLayout";

export interface FilmstripMetrics {
  /** top of the strip (below the header) */
  top: number;
  thumbWidth: number;
  thumbHeight: number;
  /** ‹ › page buttons at both ends */
  pagerWidth: number;
}

export const FILMSTRIP_TOP = 48;
/** thumbnails sit 3px below the top of the strip (`padding: 3px 0`) */
export const FILMSTRIP_PADDING = 3;
export const DESKTOP_FILMSTRIP: FilmstripMetrics = { top: FILMSTRIP_TOP, thumbWidth: 207, thumbHeight: 117, pagerWidth: 32 };

const PHONE_PAGER = 44;
const PHONE_THUMB_MIN = 96;
const PHONE_THUMB_MAX = 160;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

/**
 * Phone thumbnails, 16:9: width / 3.2 in portrait (117 at 375, three side by side), height × 0.32
 * in landscape (126×71 at 852×393, so the strip leaves room for the active speaker), 96–160 wide.
 */
export function phoneFilmstrip(width: number, height: number): FilmstripMetrics {
  const thumbWidth = Math.round(clamp(Math.min(width / 3.2, height * 0.32), PHONE_THUMB_MIN, PHONE_THUMB_MAX));
  return { top: FILMSTRIP_TOP, thumbWidth, thumbHeight: Math.round((thumbWidth * 9) / 16), pagerWidth: PHONE_PAGER };
}

/** the strip is 120px at 207×117 (thumbnails 3px below its top, PRD §8.3.2) → the active tile starts at y=168 */
const stripBottom = (metrics: FilmstripMetrics) => metrics.top + FILMSTRIP_PADDING + metrics.thumbHeight;

/** Rectangle of the large tile in a stage of width × height (phones: aspect 3:4 – 16:9). */
export function activeTileRect(
  width: number,
  height: number,
  withFilmstrip: boolean,
  metrics: FilmstripMetrics = DESKTOP_FILMSTRIP,
  phone = false,
): TileRect {
  const top = withFilmstrip ? stripBottom(metrics) : 0;
  const areaHeight = Math.max(0, height - top);
  const size = phone ? fitTileAspect(width, areaHeight) : fit16x9(width, areaHeight);
  return {
    ...size,
    x: Math.floor((width - size.width) / 2),
    y: top + Math.floor((areaHeight - size.height) / 2),
  };
}

/** How many thumbnails fit; page buttons (one at each end) are needed above that. */
export function filmstripPageSize(width: number, count: number, metrics: FilmstripMetrics = DESKTOP_FILMSTRIP): number {
  const all = Math.max(1, Math.floor(width / metrics.thumbWidth));
  if (count <= all) return count;
  return Math.max(1, Math.floor((width - 2 * metrics.pagerWidth) / metrics.thumbWidth));
}
