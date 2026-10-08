import { describe, expect, it } from "vitest";
import type { Meeting } from "@/shared/types/api";
import type { ScheduleFormValues } from "../types";
import {
  createFormValues,
  editFormValues,
  startInstant,
  startLocal,
  toPmiRequest,
  toScheduleRequest,
  toUpdateRequest,
} from "./formValues";
import { randomPasscode } from "./passcode";

const PASSCODE = /^[A-HJ-NP-Za-km-z2-9]{6}$/;

const meeting = (overrides: Partial<Meeting> = {}): Meeting => ({
  id: 5,
  meeting_number: "81234567890",
  type: "scheduled",
  uses_pmi: false,
  topic: "Design review",
  description: null,
  start_time: "2026-10-08T05:30:00Z",
  duration_minutes: 90,
  timezone: "Asia/Kolkata",
  time_label: "Oct 8, 2026 11:00 AM India",
  passcode: "aB3dE5",
  invite_url: "http://localhost:3000/j/81234567890?pwd=x",
  waiting_room: true,
  join_before_host: false,
  mute_upon_entry: true,
  host_video_on: false,
  participant_video_on: true,
  is_recurring: false,
  host_id: 1,
  host_name: "Alex Morgan",
  is_live: false,
  invitees: ["a@example.com"],
  created_at: "2026-10-01T00:00:00Z",
  updated_at: "2026-10-01T00:00:00Z",
  ...overrides,
});

const values = (overrides: Partial<ScheduleFormValues> = {}): ScheduleFormValues => ({
  ...editFormValues(meeting()),
  ...overrides,
});

describe("createFormValues", () => {
  it("defaults to My Meeting at the next half hour, 1 hour, with a passcode", () => {
    const form = createFormValues(new Date(2026, 9, 7, 23, 45), "Asia/Kolkata");
    expect(form).toMatchObject({
      topic: "My Meeting",
      date: "2026-10-08",
      time: "12:00",
      meridiem: "AM",
      durationHours: "1",
      durationMinutes: "0",
      timezone: "Asia/Kolkata",
      passcodeEnabled: true,
      meetingIdMode: "auto",
      joinBeforeHost: true,
      invitees: [],
      customTimes: [],
    });
    expect(form.passcode).toMatch(PASSCODE);
  });
});

describe("editFormValues", () => {
  it("shows the stored start in the meeting's own zone", () => {
    expect(values()).toMatchObject({ date: "2026-10-08", time: "11:00", meridiem: "AM", customTimes: ["11:00"] });

    const tokyo = editFormValues(meeting({ start_time: "2026-10-08T23:40:00Z", timezone: "Asia/Tokyo" }));
    expect(tokyo).toMatchObject({ date: "2026-10-09", time: "08:40", meridiem: "AM", timezone: "Asia/Tokyo" });
  });

  it("prefills every option from the meeting", () => {
    expect(values()).toMatchObject({
      topic: "Design review",
      description: "",
      descriptionOpen: false,
      durationHours: "1",
      durationMinutes: "30",
      passcodeEnabled: true,
      passcode: "aB3dE5",
      waitingRoom: true,
      hostVideo: "off",
      participantVideo: "on",
      joinBeforeHost: false,
      muteUponEntry: true,
      meetingIdMode: "auto",
      invitees: ["a@example.com"],
    });
  });

  it("opens the description when there is one, switches to PMI mode, and keeps a fresh passcode ready", () => {
    const form = editFormValues(meeting({ description: "Agenda", uses_pmi: true, passcode: null }));
    expect(form).toMatchObject({ description: "Agenda", descriptionOpen: true, meetingIdMode: "pmi", passcodeEnabled: false });
    expect(form.passcode).toMatch(PASSCODE);
  });
});

describe("start helpers", () => {
  it("builds the wall-clock start_local and the instant in the chosen zone", () => {
    const form = values({ date: "2026-10-08", time: "9:10", meridiem: "PM", timezone: "America/Los_Angeles" });
    expect(startLocal(form)).toBe("2026-10-08T21:10");
    expect(startInstant(form).toISOString()).toBe("2026-10-09T04:10:00.000Z");
  });
});

describe("toUpdateRequest", () => {
  it("maps the form to the PATCH body", () => {
    expect(toUpdateRequest(values({ topic: "  Weekly sync  ", durationHours: "2", durationMinutes: "45" }))).toEqual({
      topic: "Weekly sync",
      description: null,
      start_local: "2026-10-08T11:00",
      timezone: "Asia/Kolkata",
      duration_minutes: 165,
      is_recurring: false,
      passcode: "aB3dE5",
      waiting_room: true,
      join_before_host: false,
      mute_upon_entry: true,
      host_video_on: false,
      participant_video_on: true,
      invitees: ["a@example.com"],
    });
  });

  it("sends the description only while the field is open and not blank", () => {
    expect(toUpdateRequest(values({ description: "Agenda", descriptionOpen: false })).description).toBeNull();
    expect(toUpdateRequest(values({ description: "   ", descriptionOpen: true })).description).toBeNull();
    expect(toUpdateRequest(values({ description: " Agenda\n", descriptionOpen: true })).description).toBe(" Agenda\n");
  });

  it("sends a null passcode when the passcode is switched off", () => {
    expect(toUpdateRequest(values({ passcodeEnabled: false })).passcode).toBeNull();
  });

  it("always sends the invitee list, changed or not (the API diffs it)", () => {
    expect(toUpdateRequest(values()).invitees).toEqual(["a@example.com"]);
    expect(toUpdateRequest(values({ invitees: ["a@example.com", "b@example.com"] })).invitees).toEqual([
      "a@example.com",
      "b@example.com",
    ]);
    expect(toUpdateRequest(values({ invitees: [] })).invitees).toEqual([]);
  });
});

describe("toPmiRequest", () => {
  it("maps only the settings the PMI form edits", () => {
    expect(toPmiRequest(values({ hostVideo: "on", participantVideo: "off" }))).toEqual({
      passcode: "aB3dE5",
      waiting_room: true,
      join_before_host: false,
      mute_upon_entry: true,
      host_video_on: true,
      participant_video_on: false,
    });
    expect(toPmiRequest(values({ passcodeEnabled: false })).passcode).toBeNull();
  });
});

describe("toScheduleRequest", () => {
  it("adds use_pmi and always sends invitees", () => {
    expect(toScheduleRequest(values({ meetingIdMode: "pmi" }))).toMatchObject({ use_pmi: true, invitees: ["a@example.com"] });
    expect(toScheduleRequest(values()).use_pmi).toBe(false);
  });
});

describe("randomPasscode", () => {
  it("uses 6 unambiguous alphanumerics by default", () => {
    for (let i = 0; i < 200; i += 1) expect(randomPasscode()).toMatch(PASSCODE);
    expect(randomPasscode(10)).toHaveLength(10);
  });
});
