import { describe, expect, it } from "vitest";
import { formatScheduledLabel } from "./scheduledLabel";

// Tests run in America/New_York (vitest.config.mts): 15:00Z on Oct 10 is 11:00 AM local.
const now = new Date("2026-10-08T14:00:00Z");

describe("formatScheduledLabel (Zoom's .wr-schedule-date)", () => {
  it("shows the medium date and the time for another day", () => {
    expect(formatScheduledLabel("2026-10-10T15:00:00Z", now)).toBe("Scheduled: Oct 10, 2026, 11:00 AM");
  });

  it("shows only the time for a meeting later today", () => {
    expect(formatScheduledLabel("2026-10-08T23:30:00Z", now)).toBe("Scheduled: 7:30 PM");
  });

  it("is empty for meetings without a start time (instant, PMI)", () => {
    expect(formatScheduledLabel(null, now)).toBe("");
    expect(formatScheduledLabel(undefined, now)).toBe("");
  });

  it("says 'This is a recurring meeting' for recurring meetings, whatever the start time", () => {
    expect(formatScheduledLabel("2026-10-10T15:00:00Z", now, true)).toBe("This is a recurring meeting");
    expect(formatScheduledLabel(null, now, true)).toBe("This is a recurring meeting");
  });
});
