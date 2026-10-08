import { describe, expect, it } from "vitest";
import { meetingRefOf, startHref } from "./meetingRef";

const PMI = "3574179140";

describe("meetingRefOf / startHref (R2 bug 1: Start keeps ?id= for PMI calendar entries)", () => {
  it("adds the meeting id for a calendar entry that runs on the PMI", () => {
    const ref = meetingRefOf({ meeting_number: PMI, uses_pmi: true, id: 17 });
    expect(ref).toEqual({ number: PMI, id: 17 });
    expect(startHref(ref)).toBe(`/wc/${PMI}/start?fromPWA=1&id=17`);
  });

  it("reads `meeting_id` from an ended instance (Previous)", () => {
    expect(meetingRefOf({ meeting_number: PMI, uses_pmi: true, meeting_id: 21 })).toEqual({ number: PMI, id: 21 });
  });

  it("leaves unique numbers alone: scheduled meetings and the PMI itself", () => {
    expect(meetingRefOf({ meeting_number: "82190376667", uses_pmi: false, meeting_id: 9 })).toEqual({ number: "82190376667", id: undefined });
    const pmi = meetingRefOf({ meeting_number: PMI, uses_pmi: false, id: 1 });
    expect(startHref(pmi)).toBe(`/wc/${PMI}/start?fromPWA=1`);
  });
});
