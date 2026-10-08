// @vitest-environment jsdom
import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { useFocusReturn } from "./useFocusReturn";

const button = () => {
  const el = document.createElement("button");
  document.body.append(el);
  return el;
};

describe("useFocusReturn", () => {
  afterEach(() => document.body.replaceChildren());

  it("refocuses the trigger when the popover closes with focus lost to <body>", () => {
    const trigger = button();
    const { rerender } = renderHook(({ open }) => useFocusReturn(open, { current: trigger }), { initialProps: { open: true } });
    (document.activeElement as HTMLElement | null)?.blur();
    rerender({ open: false });
    expect(document.activeElement).toBe(trigger);
  });

  it("leaves focus alone when it already moved elsewhere", () => {
    const trigger = button();
    const other = button();
    const { rerender } = renderHook(({ open }) => useFocusReturn(open, { current: trigger }), { initialProps: { open: true } });
    other.focus();
    rerender({ open: false });
    expect(document.activeElement).toBe(other);
  });

  it("does nothing on the first render or while closed", () => {
    const trigger = button();
    renderHook(() => useFocusReturn(false, { current: trigger }));
    expect(document.activeElement).toBe(document.body);
  });
});
