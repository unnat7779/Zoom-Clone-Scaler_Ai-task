/**
 * Phone gallery [D] (DV10, PRD §11.5.3): at most 4 tiles per page (2×2), swiped or paged with
 * arrows. Zoom's desktop grid keeps tiles 16:9 inside 60px padding, which leaves a portrait phone
 * mostly black; on phones the tiles fill their grid cells instead (2px apart, no padding), with
 * the tile aspect kept between 3:4 and 16:9 (the video is cropped, `object-fit: cover`).
 */
import type { TileRect } from "./galleryLayout";

export const PHONE_PAGE_SIZE = 4;
const PHONE_GAP = 2;
const MIN_ASPECT = 3 / 4;
const MAX_ASPECT = 16 / 9;
const EPSILON = 1e-6;

type Grid = readonly [rows: number, cols: number];

/** rows × cols to try for 1–4 tiles; 4 is always 2×2 */
const PHONE_GRIDS: Record<number, readonly Grid[]> = {
  1: [[1, 1]],
  2: [[2, 1], [1, 2]],
  3: [[3, 1], [1, 3], [2, 2]],
  4: [[2, 2]],
};

/** The largest box inside width × height whose aspect stays between 3:4 and 16:9. */
export function fitTileAspect(width: number, height: number): { width: number; height: number } {
  if (width <= 0 || height <= 0) return { width: 0, height: 0 };
  const aspect = width / height;
  if (aspect > MAX_ASPECT) return { width: Math.round(height * MAX_ASPECT), height: Math.round(height) };
  if (aspect < MIN_ASPECT) return { width: Math.round(width), height: Math.round(width / MIN_ASPECT) };
  return { width: Math.round(width), height: Math.round(height) };
}

function bestGrid(count: number, width: number, height: number) {
  let best: { cols: number; tile: { width: number; height: number }; area: number } | null = null;
  for (const [rows, cols] of PHONE_GRIDS[count] ?? PHONE_GRIDS[1]!) {
    const tile = fitTileAspect(Math.floor((width - (cols - 1) * PHONE_GAP) / cols), Math.floor((height - (rows - 1) * PHONE_GAP) / rows));
    const area = tile.width * tile.height;
    if (!best || area > best.area + EPSILON) best = { cols, tile, area };
  }
  return best!;
}

/** Rectangles (relative to the area) for the tiles of one page; the grid and its last row are centred. */
export function phoneGalleryLayout(count: number, width: number, height: number): TileRect[] {
  const tiles = Math.min(count, PHONE_PAGE_SIZE);
  if (tiles <= 0 || width <= 0 || height <= 0) return [];
  const { cols, tile } = bestGrid(tiles, width, height);
  const rows = Math.ceil(tiles / cols);
  const top = Math.floor((height - (rows * tile.height + (rows - 1) * PHONE_GAP)) / 2);
  return Array.from({ length: tiles }, (_, index) => {
    const row = Math.floor(index / cols);
    const inRow = row === rows - 1 ? tiles - row * cols : cols;
    const left = Math.floor((width - (inRow * tile.width + (inRow - 1) * PHONE_GAP)) / 2);
    return {
      x: left + (index % cols) * (tile.width + PHONE_GAP),
      y: top + row * (tile.height + PHONE_GAP),
      width: tile.width,
      height: tile.height,
    };
  });
}
