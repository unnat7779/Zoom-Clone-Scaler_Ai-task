import { describe, expect, it } from "vitest";
import { panelLayoutFor } from "./panelLayout";

describe("panelLayoutFor", () => {
  it("keeps Zoom's side column while the stage stays at least 480px wide", () => {
    expect(panelLayoutFor(1280, false)).toBe("side"); // in-shell 1366
    expect(panelLayoutFor(1180, false)).toBe("side"); // iPad landscape
    expect(panelLayoutFor(938, false)).toBe("side"); // in-shell 1024 → stage 538
    expect(panelLayoutFor(880, false)).toBe("side");
  });

  it("pops the panel out into a floating window on narrower rooms (tablets in portrait)", () => {
    expect(panelLayoutFor(879, false)).toBe("floating");
    expect(panelLayoutFor(820, false)).toBe("floating"); // iPad Air portrait
    expect(panelLayoutFor(768, false)).toBe("floating"); // iPad mini portrait
    expect(panelLayoutFor(682, false)).toBe("floating"); // in-shell 768
  });

  it("uses a full-screen sheet on phones in either orientation", () => {
    expect(panelLayoutFor(375, true)).toBe("sheet");
    expect(panelLayoutFor(852, true)).toBe("sheet");
  });

  it("starts with the side column before the room is measured", () => {
    expect(panelLayoutFor(0, false)).toBe("side");
  });
});
