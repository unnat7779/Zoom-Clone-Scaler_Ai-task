// @vitest-environment jsdom
import type { ChangeEvent, ClipboardEvent } from "react";
import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useJoinMeetingInput } from "./useJoinMeetingInput";

const change = (value: string) => ({ target: { value } }) as ChangeEvent<HTMLInputElement>;

const paste = (text: string) =>
  ({ preventDefault: vi.fn(), clipboardData: { getData: () => text } }) as unknown as ClipboardEvent<HTMLInputElement>;

describe("useJoinMeetingInput", () => {
  beforeEach(() => vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://app.example.com"));
  afterEach(cleanup);

  it("formats typed digits and becomes ready at 9 digits", () => {
    const { result } = renderHook(() => useJoinMeetingInput());
    act(() => result.current.onChange(change("12345678")));
    expect(result.current).toMatchObject({ value: "123 456 78", target: "12345678", isReady: false });

    act(() => result.current.onChange(change("123 456 789")));
    expect(result.current).toMatchObject({ value: "123 456 789", target: "123456789", isReady: true });
  });

  it("keeps the previous value when a change is rejected", () => {
    const { result } = renderHook(() => useJoinMeetingInput());
    act(() => result.current.onChange(change("john")));
    act(() => result.current.onChange(change("john@")));
    expect(result.current.value).toBe("john");
  });

  it("keeps the pwd of a pasted invite link until the user types again", () => {
    const { result } = renderHook(() => useJoinMeetingInput());
    const event = paste("https://app.example.com/j/81234567890?pwd=aB3dE5");
    act(() => result.current.onPaste(event));

    expect(event.preventDefault).toHaveBeenCalled();
    expect(result.current).toMatchObject({ value: "812 3456 7890", params: { pwd: "aB3dE5" }, isReady: true });

    act(() => result.current.onChange(change("812 3456 789")));
    expect(result.current.params).toEqual({});
  });

  it("fills a history number without params", () => {
    const { result } = renderHook(() => useJoinMeetingInput());
    act(() => result.current.onPaste(paste("https://zoom.us/j/123456789?pwd=x")));
    act(() => result.current.fill("81098765432"));
    expect(result.current).toMatchObject({ value: "810 9876 5432", params: {}, target: "81098765432" });
  });
});
