// @vitest-environment jsdom
import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import type { ScheduleFormValues } from "../types";
import { createFormValues } from "../utils/formValues";
import { useScheduleValidation } from "./useScheduleValidation";

/** user-facing copy (PRD §7.6.4, 03-schedule.md §5.1) */
const TOPIC_REQUIRED = "Topic is required";
const START_PASSED = "The start time has already passed";

/** 2026-10-08 11:00 AM in Kolkata = 05:30Z */
const START = new Date("2026-10-08T05:30:00Z");
const MINUTE = 60_000;

const form = (overrides: Partial<ScheduleFormValues> = {}): ScheduleFormValues => ({
  ...createFormValues(new Date(2026, 9, 7, 10, 0), "Asia/Kolkata"),
  date: "2026-10-08",
  time: "11:00",
  meridiem: "AM",
  ...overrides,
});

const render = (values: ScheduleFormValues, editedFrom: ScheduleFormValues | null = null) =>
  renderHook(({ v, e }) => useScheduleValidation(v, e), { initialProps: { v: values, e: editedFrom } });

describe("useScheduleValidation", () => {
  afterEach(cleanup);

  it("accepts a start up to 5 minutes in the past and rejects older ones", () => {
    const { result } = render(form());
    let ok = false;
    act(() => {
      ok = result.current.validateAll(new Date(START.getTime() + 5 * MINUTE));
    });
    expect(ok).toBe(true);
    expect(result.current.startError).toBeNull();

    act(() => {
      ok = result.current.validateAll(new Date(START.getTime() + 5 * MINUTE + 1));
    });
    expect(ok).toBe(false);
    expect(result.current.startError).toBe(START_PASSED);
  });

  it("clears the start error as soon as the date, time or zone changes", () => {
    const { result, rerender } = render(form());
    act(() => {
      result.current.validateAll(new Date(START.getTime() + 60 * MINUTE));
    });
    expect(result.current.startError).toBe(START_PASSED);

    rerender({ v: form({ timezone: "America/Los_Angeles" }), e: null });
    expect(result.current.startError).toBeNull();
  });

  it("skips the past-start check when editing without changing the start", () => {
    const original = form();
    const late = new Date(START.getTime() + 24 * 60 * MINUTE);
    const { result, rerender } = render(form({ topic: "Renamed" }), original);
    let ok = false;
    act(() => {
      ok = result.current.validateAll(late);
    });
    expect(ok).toBe(true);

    rerender({ v: form({ time: "11:15" }), e: original });
    act(() => {
      ok = result.current.validateAll(late);
    });
    expect(ok).toBe(false);
    expect(result.current.startError).toBe(START_PASSED);
  });

  it("requires a topic on blur and on save", () => {
    const { result, rerender } = render(form({ topic: "   " }));
    act(() => result.current.checkTopic());
    expect(result.current.topicError).toBe(TOPIC_REQUIRED);

    rerender({ v: form({ topic: "Sync" }), e: null });
    act(() => result.current.checkTopic());
    expect(result.current.topicError).toBeNull();

    rerender({ v: form({ topic: "" }), e: null });
    let ok = true;
    act(() => {
      ok = result.current.validateAll(START);
    });
    expect(ok).toBe(false);
    expect(result.current.topicError).toBe(TOPIC_REQUIRED);
  });

  it("blocks saving an empty passcode only while the passcode is on", () => {
    const { result, rerender } = render(form({ passcode: "" }));
    expect(result.current.passcodeInvalid).toBe(true);
    let ok = true;
    act(() => {
      ok = result.current.validateAll(START);
    });
    expect(ok).toBe(false);

    rerender({ v: form({ passcode: "", passcodeEnabled: false }), e: null });
    expect(result.current.passcodeInvalid).toBe(false);
  });

  it("shows the backend's 'already passed' rejection on the current start", () => {
    const { result } = render(form());
    act(() => result.current.flagStartPassed());
    expect(result.current.startError).toBe(START_PASSED);
  });
});
