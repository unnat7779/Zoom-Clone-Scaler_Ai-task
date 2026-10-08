import { describe, expect, it } from "vitest";
import type { Participant } from "@/shared/types/api";
import { invitePwd, parseLeftReason } from "./leftPage";
import { avatarColor, panelOrder, participantLabel } from "./participantRows";

const person = (id: number, overrides: Partial<Participant> = {}): Participant => ({
  id,
  display_name: `Person ${id}`,
  role: "attendee",
  is_guest: true,
  audio_muted: false,
  video_on: true,
  joined_at: "2026-10-08T15:00:00Z",
  ...overrides,
});

const host = person(1, { role: "host", is_guest: false });
const guests = [person(2), person(3), person(4), person(5), person(6), person(7), person(8), person(9)];

describe("participantLabel", () => {
  it.each([
    [host, true, "(Host, me)"],
    [host, false, "(Host)"],
    [person(2), true, "(Me)"],
    [person(2), false, "(Guest)"],
    [person(2, { is_guest: false }), false, ""],
  ])("%#: → %j", (participant, isSelf, label) => {
    expect(participantLabel(participant, isSelf)).toBe(label);
  });
});

describe("avatarColor", () => {
  it("gives the signed-in user mc1 and guests the rest of the palette in join order, wrapping after 7", () => {
    const roster = [host, ...guests];
    expect(avatarColor(host, roster)).toBe("mc1");
    expect(guests.map((guest) => avatarColor(guest, roster))).toEqual(["mc2", "mc3", "mc4", "mc5", "mc6", "mc7", "mc8", "mc2"]);
  });

  it("falls back to the first guest colour for someone not in the roster", () => {
    expect(avatarColor(person(42), [host])).toBe("mc2");
  });
});

describe("panelOrder", () => {
  it("lists me first, then the host, then everyone else in roster order", () => {
    const roster = [person(2), person(3), host, person(4)];
    expect(panelOrder(roster, 3).map((p) => p.id)).toEqual([3, 1, 2, 4]);
    expect(panelOrder(roster, 1).map((p) => p.id)).toEqual([1, 2, 3, 4]);
    expect(panelOrder(roster, null).map((p) => p.id)).toEqual([1, 2, 3, 4]);
  });
});

describe("left page helpers", () => {
  it("parses the reason, defaulting to left", () => {
    expect(parseLeftReason("removed")).toBe("removed");
    expect(parseLeftReason("ended")).toBe("ended");
    expect(parseLeftReason("hacked")).toBe("left");
    expect(parseLeftReason(null)).toBe("left");
  });

  it("extracts pwd from the invite URL", () => {
    expect(invitePwd("http://localhost:3000/j/81234567890?pwd=aB3.dE5")).toBe("aB3.dE5");
    expect(invitePwd("http://localhost:3000/j/81234567890")).toBeNull();
    expect(invitePwd("not a url")).toBeNull();
    expect(invitePwd(undefined)).toBeNull();
  });
});
