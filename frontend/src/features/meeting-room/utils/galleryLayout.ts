/**
 * Zoom's gallery grid (PRD §8.3.3, spec 05 §3.4 [J], ported exactly): for each
 * allowed rows×cols, the 16:9 tile is `unit = min(W/(16c), H/(9r))`; pick the
 * largest tile. No gap; 60px padding when there are 2+ tiles; rows fill top to
 * bottom, the last row is centred, the grid is centred both ways.
 */

type Grid = readonly [rows: number, cols: number];

const ALLOWED: Record<number, readonly Grid[]> = {
  1: [[1, 1]],
  2: [[1, 2], [2, 1]],
  3: [[1, 3], [3, 1], [2, 2]],
  4: [[1, 4], [4, 1], [2, 2]],
  5: [[1, 5], [5, 1], [2, 3], [3, 2]],
  6: [[2, 3], [3, 2], [1, 6], [6, 1]],
  7: [[2, 4], [4, 2], [3, 3], [1, 7], [7, 1]],
  8: [[2, 4], [4, 2], [3, 3], [1, 8], [8, 1]],
  9: [[3, 3], [5, 2], [2, 5], [1, 9], [9, 1]],
  10: [[2, 5], [5, 2], [3, 4], [4, 3], [1, 10], [10, 1]],
  11: [[3, 4], [4, 3], [2, 6], [6, 2], [1, 11], [11, 1]],
  12: [[3, 4], [4, 3], [2, 6], [6, 2], [1, 12], [12, 1]],
  13: [[5, 3], [3, 5], [2, 7], [7, 2], [4, 4], [1, 13], [13, 1]],
  14: [[5, 3], [3, 5], [2, 7], [7, 2], [4, 4], [1, 14], [14, 1]],
  15: [[5, 3], [3, 5], [4, 4], [2, 8], [8, 2], [1, 15], [15, 1]],
  16: [[5, 4], [4, 5], [4, 4], [6, 3], [3, 6], [2, 8], [8, 2]],
  17: [[5, 4], [4, 5], [6, 3], [3, 6], [2, 9], [9, 2]],
  18: [[5, 4], [4, 5], [6, 3], [3, 6], [2, 9], [9, 2]],
  19: [[5, 4], [4, 5], [3, 7], [7, 3], [2, 10], [10, 2]],
  20: [[5, 4], [4, 5], [3, 7], [7, 3], [2, 10], [10, 2]],
  21: [[5, 5], [3, 7], [7, 3], [6, 4], [4, 6], [2, 11], [11, 2]],
  22: [[5, 5], [6, 4], [4, 6], [2, 11], [11, 2]],
  23: [[2, 12], [3, 8], [5, 5], [4, 6], [6, 4], [8, 3], [12, 2]],
  24: [[2, 12], [3, 8], [5, 5], [4, 6], [6, 4], [8, 3], [12, 2]],
  25: [[5, 5]],
};

export const GALLERY_MAX_TILES = 25;
const GALLERY_PADDING = 60;
/** The gallery lays out between the header (48) and the toolbar (52) (PRD §8.3.3 [M]). */
export const GALLERY_AREA_TOP = 48;
export const GALLERY_AREA_BOTTOM = 52;

export interface TileRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Largest 16:9 box inside width × height. */
export function fit16x9(width: number, height: number): { width: number; height: number } {
  const unit = Math.max(0, Math.min(width / 16, height / 9));
  return { width: Math.round(16 * unit), height: Math.round(9 * unit) };
}

/** Tiles of equal size: the grid with fewer cells (fewer empty slots), then the squarer one, wins (16 → 4×4, not 5+5+5+1). */
const UNIT_EPSILON = 1e-9;
const cellCount = ([rows, cols]: Grid) => rows * cols;
const squareness = ([rows, cols]: Grid) => Math.abs(rows - cols);

function isBetterTie(candidate: Grid, current: Grid): boolean {
  if (cellCount(candidate) !== cellCount(current)) return cellCount(candidate) < cellCount(current);
  return squareness(candidate) < squareness(current);
}

function bestGrid(count: number, width: number, height: number): { grid: Grid; unit: number } {
  const options = ALLOWED[Math.min(count, GALLERY_MAX_TILES)] ?? ALLOWED[1]!;
  let best: { grid: Grid; unit: number } = { grid: options[0]!, unit: 0 };
  for (const grid of options) {
    const [rows, cols] = grid;
    const unit = Math.min(width / (16 * cols), height / (9 * rows));
    const tie = Math.abs(unit - best.unit) < UNIT_EPSILON;
    if (unit > best.unit + UNIT_EPSILON || (tie && isBetterTie(grid, best.grid))) best = { grid, unit };
  }
  return best;
}

/** Tile rectangles (relative to the layout area) for `count` tiles in an area of width × height. */
export function galleryLayout(count: number, width: number, height: number): TileRect[] {
  if (count <= 0 || width <= 0 || height <= 0) return [];
  const padding = count > 1 ? GALLERY_PADDING : 0;
  const innerWidth = Math.max(0, width - 2 * padding);
  const innerHeight = Math.max(0, height - 2 * padding);
  const { grid, unit } = bestGrid(count, innerWidth, innerHeight);
  const cols = grid[1];
  const tileWidth = Math.round(16 * unit);
  const tileHeight = Math.round(9 * unit);
  const rows = Math.ceil(count / cols);
  const top = Math.floor((height - rows * tileHeight) / 2);
  return Array.from({ length: count }, (_, index) => {
    const row = Math.floor(index / cols);
    const inRow = row === rows - 1 ? count - row * cols : cols;
    const left = Math.floor((width - inRow * tileWidth) / 2);
    return { x: left + (index % cols) * tileWidth, y: top + row * tileHeight, width: tileWidth, height: tileHeight };
  });
}
