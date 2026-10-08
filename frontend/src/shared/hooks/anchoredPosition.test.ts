import { describe, expect, it } from "vitest";
import { type AnchorRect, computeAnchoredPosition, type PositionRequest } from "./anchoredPosition";

const rect = (left: number, top: number, width: number, height: number): AnchorRect => ({
  left,
  top,
  width,
  height,
  right: left + width,
  bottom: top + height,
});

// the Home day picker on an iPhone SE: 343×376 under a 116×32 date button, 10px gap
const request = (anchorTop: number, overrides: Partial<PositionRequest> = {}): PositionRequest => ({
  anchor: rect(114, anchorTop, 116, 32),
  floating: { width: 343, height: 376 },
  viewport: { width: 375, top: 0, bottom: 667 },
  placement: "bottom",
  offset: 10,
  flip: true,
  padding: 8,
  clamp: "both",
  ...overrides,
});

describe("computeAnchoredPosition", () => {
  it("centres the element under the anchor and keeps it 8px from the side edges", () => {
    expect(computeAnchoredPosition(request(100))).toEqual({ top: 142, left: 8, side: "bottom", clamped: false });
  });

  it("flips above the anchor when only the top side has room", () => {
    expect(computeAnchoredPosition(request(420))).toEqual({ top: 34, left: 8, side: "top", clamped: false });
  });

  it("pushes the element on screen, over the anchor, when neither side has room", () => {
    const position = computeAnchoredPosition(request(300));
    expect(position).toEqual({ top: 283, left: 8, side: "bottom", clamped: true });
  });

  it("never flips or moves vertically without flip and with a horizontal clamp (Zoom's desktop picker)", () => {
    const desktop = { anchor: rect(700, 600, 116, 32), viewport: { width: 1366, top: 0, bottom: 768 } };
    const position = computeAnchoredPosition(request(600, { ...desktop, flip: false, clamp: "horizontal" }));
    expect(position).toEqual({ top: 642, left: 586.5, side: "bottom", clamped: false });
  });

  it("keeps the element inside the visible band above an on-screen keyboard", () => {
    const position = computeAnchoredPosition(request(100, { viewport: { width: 375, top: 0, bottom: 367 } }));
    expect(position).toEqual({ top: 8, left: 8, side: "bottom", clamped: true });
  });

  it("aligns start / end placements and flips horizontal sides", () => {
    const menu = { floating: { width: 200, height: 100 }, viewport: { width: 1366, top: 0, bottom: 768 } };
    expect(computeAnchoredPosition(request(100, { ...menu, placement: "bottom-start" })).left).toBe(114);
    expect(computeAnchoredPosition(request(100, { ...menu, placement: "bottom-end" })).left).toBe(30);
    const right = computeAnchoredPosition({ ...request(100, menu), anchor: rect(1250, 100, 100, 32), placement: "right-start" });
    expect(right).toEqual({ top: 100, left: 1040, side: "left", clamped: false });
  });
});
