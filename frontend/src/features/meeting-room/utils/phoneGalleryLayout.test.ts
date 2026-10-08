import { describe, expect, it } from "vitest";
import type { TileRect } from "./galleryLayout";
import { PHONE_PAGE_SIZE, fitTileAspect, phoneGalleryLayout } from "./phoneGalleryLayout";

const rowsOf = (rects: TileRect[]) => new Set(rects.map((rect) => rect.y)).size;
const colsOf = (rects: TileRect[]) => new Set(rects.map((rect) => rect.x)).size;
const aspect = (rect: TileRect) => rect.width / rect.height;

describe("fitTileAspect", () => {
  it("keeps a box whose aspect is already between 3:4 and 16:9", () => {
    expect(fitTileAspect(375, 282)).toEqual({ width: 375, height: 282 });
  });

  it("narrows boxes wider than 16:9 and shortens boxes taller than 3:4", () => {
    expect(fitTileAspect(852, 293)).toEqual({ width: 521, height: 293 });
    expect(fitTileAspect(375, 667)).toEqual({ width: 375, height: 500 });
  });

  it("returns nothing for an empty box", () => {
    expect(fitTileAspect(0, 100)).toEqual({ width: 0, height: 0 });
    expect(fitTileAspect(100, -1)).toEqual({ width: 0, height: 0 });
  });
});

describe("phoneGalleryLayout", () => {
  it("shows at most 4 tiles (one page)", () => {
    expect(PHONE_PAGE_SIZE).toBe(4);
    expect(phoneGalleryLayout(7, 375, 567)).toHaveLength(4);
    expect(phoneGalleryLayout(0, 375, 567)).toEqual([]);
    expect(phoneGalleryLayout(2, 0, 567)).toEqual([]);
  });

  it("stacks two tiles full width in portrait (iPhone SE: 375 × 667 − header − toolbar)", () => {
    expect(phoneGalleryLayout(2, 375, 567)).toEqual([
      { x: 0, y: 0, width: 375, height: 282 },
      { x: 0, y: 284, width: 375, height: 282 },
    ]);
  });

  it("puts two tiles side by side in landscape (852 × 393)", () => {
    const rects = phoneGalleryLayout(2, 852, 293);
    expect(rowsOf(rects)).toBe(1);
    expect(rects.map((rect) => rect.width)).toEqual([425, 425]);
    expect(rects[0]?.height).toBe(293);
  });

  it("uses a single column for 3 tiles on a tall phone and a single row in landscape", () => {
    expect(colsOf(phoneGalleryLayout(3, 393, 752))).toBe(1);
    expect(rowsOf(phoneGalleryLayout(3, 852, 293))).toBe(1);
  });

  it("lays 4 tiles out 2×2, each no taller than 3:4, centred", () => {
    const rects = phoneGalleryLayout(4, 375, 567);
    expect(rowsOf(rects)).toBe(2);
    expect(colsOf(rects)).toBe(2);
    for (const rect of rects) expect(aspect(rect)).toBeCloseTo(3 / 4, 1);
    const top = Math.min(...rects.map((rect) => rect.y));
    const bottom = Math.max(...rects.map((rect) => rect.y + rect.height));
    expect(Math.abs(top - (567 - bottom))).toBeLessThanOrEqual(1);
  });

  it("keeps every page inside the area, non-overlapping, 2px apart and between 3:4 and 16:9", () => {
    const areas: [number, number][] = [
      [360, 700],
      [375, 567],
      [393, 752],
      [412, 815],
      [852, 293],
      [667, 275],
    ];
    for (const [width, height] of areas) {
      for (let count = 1; count <= 4; count += 1) {
        const rects = phoneGalleryLayout(count, width, height);
        rects.forEach((rect, index) => {
          expect(rect.x).toBeGreaterThanOrEqual(0);
          expect(rect.y).toBeGreaterThanOrEqual(0);
          expect(rect.x + rect.width).toBeLessThanOrEqual(width);
          expect(rect.y + rect.height).toBeLessThanOrEqual(height);
          expect(aspect(rect)).toBeGreaterThanOrEqual(0.74);
          expect(aspect(rect)).toBeLessThanOrEqual(1.79);
          for (const other of rects.slice(index + 1)) {
            const apart = rect.x + rect.width + 2 <= other.x + 0.5 || other.x + other.width + 2 <= rect.x + 0.5 || rect.y + rect.height + 2 <= other.y + 0.5 || other.y + other.height + 2 <= rect.y + 0.5;
            expect(apart).toBe(true);
          }
        });
      }
    }
  });

  it("fills more of a portrait phone than Zoom's desktop grid would", () => {
    // desktop: 2 tiles stacked inside 60px padding → 255×143 each at 375 × 567
    const [first] = phoneGalleryLayout(2, 375, 567);
    expect((first?.width ?? 0) * (first?.height ?? 0)).toBeGreaterThan(255 * 143 * 2);
  });
});
