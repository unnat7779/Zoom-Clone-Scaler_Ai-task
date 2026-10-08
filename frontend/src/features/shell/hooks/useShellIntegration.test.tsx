// @vitest-environment jsdom
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ShellProvider } from "../context/ShellContext";
import { useShellDialog, useShellMenu } from "./useShellIntegration";

function useHeader() {
  return { profile: useShellMenu("profile"), history: useShellMenu("history"), search: useShellDialog("search") };
}

const render = () => renderHook(useHeader, { wrapper: ShellProvider });

describe("shell header popovers", () => {
  it("keeps one popover open at a time", () => {
    const { result } = render();
    act(() => result.current.profile.toggle());
    expect(result.current.profile.open).toBe(true);
    act(() => result.current.history.toggle());
    expect(result.current.profile.open).toBe(false);
    expect(result.current.history.open).toBe(true);
    act(() => result.current.history.toggle());
    expect(result.current.history.open).toBe(false);
  });

  it("closes the open popover when a dialog opens (⌘K over the profile menu) and keeps it closed", () => {
    const { result } = render();
    act(() => result.current.profile.toggle());
    act(() => result.current.search.show());
    expect(result.current.search.open).toBe(true);
    expect(result.current.profile.open).toBe(false);
    act(() => result.current.search.close());
    expect(result.current.profile.open).toBe(false);
  });
});
