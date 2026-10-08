import { describe, expect, it } from "vitest";
import { PANEL_DEFAULT_WIDTH, PANEL_MAX_WIDTH, clampPanelWidth } from "./panelWidth";

/** 1366×768: main body 1360 − rail 80 − handle 6 = 1274 shared by the content column and the panel. */
const ROOM_1366 = 1274;

describe("clampPanelWidth", () => {
  it("keeps widths inside the range", () => {
    expect(clampPanelWidth(420, ROOM_1366)).toBe(420);
  });

  it("never goes below the 328 default", () => {
    expect(clampPanelWidth(100, ROOM_1366)).toBe(PANEL_DEFAULT_WIDTH);
  });

  it("caps at 600 on wide screens", () => {
    expect(clampPanelWidth(900, 1834)).toBe(PANEL_MAX_WIDTH);
  });

  it("leaves the content column 400px", () => {
    expect(clampPanelWidth(600, 900)).toBe(500);
  });

  it("stays at 328 when the window is too narrow to grow", () => {
    expect(clampPanelWidth(500, 600)).toBe(PANEL_DEFAULT_WIDTH);
  });

  it("rounds sub-pixel pointer positions", () => {
    expect(clampPanelWidth(400.6, ROOM_1366)).toBe(401);
  });
});
