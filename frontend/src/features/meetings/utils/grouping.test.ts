import { describe, expect, it } from "vitest";
import type { InstanceListItem, MeetingListItem } from "@/shared/types/api";
import { groupPrevious, groupUpcoming, upcomingKey } from "./grouping";

/** Oct 7 2026, 10 PM in New York (02:00Z on Oct 8) */
const NOW = new Date(2026, 9, 7, 22, 0);

const upcoming = (id: number, start: string): MeetingListItem => ({
  id,
  meeting_number: `8123456789${id}`,
  type: "scheduled",
  uses_pmi: false,
  topic: `Meeting ${id}`,
  start_time: start,
  duration_minutes: 30,
  timezone: "America/New_York",
  host_name: "Alex Morgan",
  is_live: false,
  has_instance: false,
  has_host: false,
});

const previous = (uuid: string, startedAt: string): InstanceListItem => ({
  uuid,
  meeting_id: 1,
  meeting_number: "81234567890",
  type: "scheduled",
  uses_pmi: false,
  topic: uuid,
  host_name: "Alex Morgan",
  started_at: startedAt,
  ended_at: startedAt,
  duration_minutes: 1,
  participant_count: 1,
  meeting_exists: true,
});

describe("groupUpcoming", () => {
  it("sorts oldest first and groups by local day, not UTC day", () => {
    const groups = groupUpcoming(
      [
        upcoming(3, "2026-10-14T13:00:00Z"),
        upcoming(2, "2026-10-08T03:30:00Z"), // 11:30 PM on Oct 7 in New York
        upcoming(1, "2026-10-08T02:30:00Z"), // 10:30 PM on Oct 7
        upcoming(4, "2026-10-08T15:00:00Z"),
        upcoming(5, "2027-01-04T15:00:00Z"),
      ],
      NOW,
    );
    expect(groups.map((g) => [g.key, g.label, g.items.map((i) => i.id)])).toEqual([
      ["2026-10-07", "Today", [1, 2]],
      ["2026-10-08", "Tomorrow", [4]],
      ["2026-10-14", "Wed, Oct 14", [3]],
      ["2027-01-04", "Mon, Jan 4, 2027", [5]],
    ]);
  });

  it("dates a meeting from yesterday (still live) instead of saying Yesterday", () => {
    expect(groupUpcoming([upcoming(1, "2026-10-06T15:00:00Z")], NOW).map((g) => g.label)).toEqual(["Tue, Oct 6"]);
  });

  it("does not mutate the input", () => {
    const items = [upcoming(2, "2026-10-09T15:00:00Z"), upcoming(1, "2026-10-08T15:00:00Z")];
    groupUpcoming(items, NOW);
    expect(items.map((i) => i.id)).toEqual([2, 1]);
  });
});

describe("groupPrevious", () => {
  it("sorts newest first with Today / Yesterday labels", () => {
    const groups = groupPrevious(
      [
        previous("old", "2025-12-30T15:00:00Z"),
        previous("yesterday", "2026-10-06T15:00:00Z"),
        previous("today-early", "2026-10-07T13:00:00Z"),
        previous("today-late", "2026-10-08T01:00:00Z"), // 9 PM on Oct 7
        previous("week", "2026-10-02T15:00:00Z"),
      ],
      NOW,
    );
    expect(groups.map((g) => [g.label, g.items.map((i) => i.uuid)])).toEqual([
      ["Today", ["today-late", "today-early"]],
      ["Yesterday", ["yesterday"]],
      ["Fri, Oct 2", ["week"]],
      ["Tue, Dec 30, 2025", ["old"]],
    ]);
  });

  it("labels yesterday across a year boundary", () => {
    const groups = groupPrevious(
      [
        previous("new-year's-eve", "2027-01-01T04:00:00Z"), // 11 PM on Dec 31 in New York
        previous("day-before", "2026-12-30T15:00:00Z"),
      ],
      new Date(2027, 0, 1, 0, 30),
    );
    expect(groups.map((g) => [g.key, g.label])).toEqual([
      ["2026-12-31", "Yesterday"],
      ["2026-12-30", "Wed, Dec 30, 2026"],
    ]);
  });
});

describe("upcomingKey", () => {
  it("is the number, plus the id for calendar entries on the PMI", () => {
    expect(upcomingKey({ id: 4, meeting_number: "81234567890", uses_pmi: false })).toBe("81234567890");
    expect(upcomingKey({ id: 4, meeting_number: "81234567890", uses_pmi: true })).toBe("81234567890-4");
  });
});
