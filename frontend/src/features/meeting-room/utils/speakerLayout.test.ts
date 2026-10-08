import { describe, expect, it } from "vitest";
import { activeTileRect, filmstripPageSize, phoneFilmstrip } from "./speakerLayout";

describe("activeTileRect", () => {
  it("fits the whole stage when alone", () => {
    expect(activeTileRect(1366, 768, false)).toEqual({ x: 0, y: 0, width: 1365, height: 768 });
  });

  it("sits below the 120px filmstrip (y=168) and is centred horizontally", () => {
    expect(activeTileRect(1366, 768, true)).toEqual({ x: 149, y: 168, width: 1067, height: 600 });
  });

  it("collapses to nothing when the stage is shorter than the filmstrip", () => {
    expect(activeTileRect(1366, 100, true)).toMatchObject({ width: 0, height: 0, y: 168 });
  });
});

describe("phone speaker view", () => {
  it("uses thumbnails a third of a portrait width and of a landscape height, 16:9", () => {
    expect(phoneFilmstrip(375, 667)).toEqual({ top: 48, thumbWidth: 117, thumbHeight: 66, pagerWidth: 44 });
    expect(phoneFilmstrip(360, 800)).toMatchObject({ thumbWidth: 113, thumbHeight: 64 });
    expect(phoneFilmstrip(852, 393)).toMatchObject({ thumbWidth: 126, thumbHeight: 71 });
    // never below 96 or above 160
    expect(phoneFilmstrip(280, 900).thumbWidth).toBe(96);
    expect(phoneFilmstrip(1000, 1000).thumbWidth).toBe(160);
  });

  it("lets the active tile fill a portrait phone below the strip (3:4 at most)", () => {
    const metrics = phoneFilmstrip(375, 667);
    // strip bottom 48 + 3 + 66 = 117; 375 × 550 left → 375 × 500
    expect(activeTileRect(375, 667, true, metrics, true)).toEqual({ x: 0, y: 142, width: 375, height: 500 });
    // alone: the whole stage
    expect(activeTileRect(375, 667, false, metrics, true)).toEqual({ x: 0, y: 83, width: 375, height: 500 });
  });

  it("keeps the landscape active tile 16:9 under the strip", () => {
    const metrics = phoneFilmstrip(852, 393);
    expect(activeTileRect(852, 393, true, metrics, true)).toEqual({ x: 185, y: 122, width: 482, height: 271 });
  });

  it("pages the phone filmstrip with 44px buttons", () => {
    const metrics = phoneFilmstrip(375, 667);
    expect(filmstripPageSize(375, 3, metrics)).toBe(3);
    expect(filmstripPageSize(375, 4, metrics)).toBe(2);
  });
});

describe("filmstripPageSize", () => {
  it.each([
    [1366, 3, 3],
    [1366, 6, 6],
    // 7 > 6 that fit, so the ‹ › buttons (32px each) take room: (1366 − 64) / 207 → 6
    [1366, 7, 6],
    [880, 10, 3],
    [200, 5, 1],
    [200, 1, 1],
  ])("width %i, %i thumbnails → %i per page", (width, count, expected) => {
    expect(filmstripPageSize(width, count)).toBe(expected);
  });
});
