import { describe, expect, it } from "vitest";
import { GALLERY_MAX_TILES, type TileRect, fit16x9, galleryLayout } from "./galleryLayout";

const rows = (rects: TileRect[]) => [...new Set(rects.map((rect) => rect.y))].length;
const cols = (rects: TileRect[]) => Math.max(...[...new Set(rects.map((rect) => rect.y))].map((y) => rects.filter((r) => r.y === y).length));

describe("fit16x9", () => {
  it("returns the largest 16:9 box inside the area", () => {
    expect(fit16x9(1280, 720)).toEqual({ width: 1280, height: 720 });
    expect(fit16x9(1366, 600)).toEqual({ width: 1067, height: 600 });
    expect(fit16x9(400, 900)).toEqual({ width: 400, height: 225 });
    expect(fit16x9(-10, 100)).toEqual({ width: 0, height: 0 });
  });
});

describe("galleryLayout", () => {
  it("returns nothing for no tiles or an empty area", () => {
    expect(galleryLayout(0, 1366, 668)).toEqual([]);
    expect(galleryLayout(3, 0, 668)).toEqual([]);
    expect(galleryLayout(3, 1366, -1)).toEqual([]);
  });

  it("fills the whole area with a single tile (no padding) and centres it", () => {
    expect(galleryLayout(1, 1280, 720)).toEqual([{ x: 0, y: 0, width: 1280, height: 720 }]);
    expect(galleryLayout(1, 1366, 600)).toEqual([{ x: 149, y: 0, width: 1067, height: 600 }]);
  });

  it("puts two tiles side by side inside the 60px padding at 1366×668", () => {
    const rects = galleryLayout(2, 1366, 668);
    // inner 1246×548: 1×2 → unit min(1246/32, 548/9) = 38.94 → 623×350
    expect(rects).toEqual([
      { x: 60, y: 159, width: 623, height: 350 },
      { x: 683, y: 159, width: 623, height: 350 },
    ]);
  });

  it("stacks two tiles on a portrait phone", () => {
    const rects = galleryLayout(2, 375, 712);
    expect(rects[0]?.x).toBe(rects[1]?.x);
    expect(rows(rects)).toBe(2);
  });

  it("centres the incomplete last row", () => {
    // 3 tiles at 1366×768 → 2×2 grid (unit 36 → 576×324); the third tile sits alone, centred
    const rects = galleryLayout(3, 1366, 768);
    expect(rects.map(({ x, y }) => [x, y])).toEqual([
      [107, 60],
      [683, 60],
      [395, 384],
    ]);
  });

  it.each([
    [4, 2, 2],
    [6, 2, 3],
    [9, 3, 3],
    [12, 3, 4],
    [20, 4, 5],
    [25, 5, 5],
  ])("lays %i tiles out as %i×%i on a 1366×668 stage", (count, expectedRows, expectedCols) => {
    const rects = galleryLayout(count, 1366, 668);
    expect(rows(rects)).toBe(expectedRows);
    expect(cols(rects)).toBe(expectedCols);
  });

  it("prefers 4×4 over 4 rows of 5 for 16 tiles when both give the same tile size", () => {
    const rects = galleryLayout(16, 1366, 668);
    expect(rows(rects)).toBe(4);
    expect(cols(rects)).toBe(4);
  });

  it("chooses a single column for a narrow, tall area", () => {
    const rects = galleryLayout(5, 375, 812);
    expect(new Set(rects.map((rect) => rect.x)).size).toBe(1);
    expect(rows(rects)).toBe(5);
  });

  it(`keeps every layout up to ${GALLERY_MAX_TILES} tiles inside the area, non-overlapping and 16:9`, () => {
    const areas: [number, number][] = [
      [1366, 668],
      [1920, 980],
      [880, 668],
      [375, 712],
      [768, 924],
    ];
    for (const [width, height] of areas) {
      for (let count = 1; count <= GALLERY_MAX_TILES; count += 1) {
        const rects = galleryLayout(count, width, height);
        const where = `${count} tiles in ${width}×${height}`;
        expect(rects, where).toHaveLength(count);
        for (const [index, rect] of rects.entries()) {
          expect(rect.x, where).toBeGreaterThanOrEqual(0);
          expect(rect.y, where).toBeGreaterThanOrEqual(0);
          expect(rect.x + rect.width, where).toBeLessThanOrEqual(width);
          expect(rect.y + rect.height, where).toBeLessThanOrEqual(height);
          expect(Math.abs(rect.width / rect.height - 16 / 9), where).toBeLessThan(0.05);
          for (const other of rects.slice(index + 1)) {
            const overlaps =
              rect.x < other.x + other.width &&
              other.x < rect.x + rect.width &&
              rect.y < other.y + other.height &&
              other.y < rect.y + rect.height;
            expect(overlaps, `${where}: tiles ${index} overlap`).toBe(false);
          }
        }
      }
    }
  });
});
