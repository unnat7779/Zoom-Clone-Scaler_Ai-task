import { describe, expect, it } from "vitest";
import { clampRoomCount, participantsPerRoomLabel } from "./breakoutRooms";

describe("clampRoomCount", () => {
  it.each([
    [1, 1],
    [7, 7],
    [0, 1],
    [-3, 1],
    [51, 50],
    [2.9, 2],
    [Number.NaN, 1],
  ])("%s → %s", (value, expected) => {
    expect(clampRoomCount(value)).toBe(expected);
  });
});

describe("participantsPerRoomLabel", () => {
  it("shows Zoom's 0 when the host is alone (room-20)", () => {
    expect(participantsPerRoomLabel(0, 1)).toBe("0 participants per room");
  });

  it("divides the attendees evenly when possible", () => {
    expect(participantsPerRoomLabel(4, 2)).toBe("2 participants per room");
    expect(participantsPerRoomLabel(1, 1)).toBe("1 participants per room");
  });

  it("shows a range for uneven splits", () => {
    expect(participantsPerRoomLabel(3, 2)).toBe("1-2 participants per room");
    expect(participantsPerRoomLabel(1, 3)).toBe("0-1 participants per room");
  });

  it("clamps the room count first", () => {
    expect(participantsPerRoomLabel(4, 0)).toBe("4 participants per room");
  });
});
