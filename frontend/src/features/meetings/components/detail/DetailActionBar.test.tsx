// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Meeting } from "@/shared/types/api";
import { ToastProvider } from "@/shared/ui/Toast";
import type { useDetailActions } from "../../hooks/useDetailActions";
import { DetailActionBar } from "./DetailActionBar";

const MEETING = {
  id: 5,
  meeting_number: "81824655222",
  type: "scheduled",
  uses_pmi: false,
  topic: "1:1 with Priya",
  is_live: false,
} as Meeting;

const renderBar = () => {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
  const start = vi.fn();
  const actions = {
    start,
    end: vi.fn(),
    edit: vi.fn(),
    copy: { open: false, text: undefined, show: vi.fn(), close: vi.fn() },
    remove: { openModal: vi.fn() },
  } as unknown as ReturnType<typeof useDetailActions>;
  render(
    <ToastProvider>
      <DetailActionBar meeting={MEETING} actions={actions} />
    </ToastProvider>,
  );
  return start;
};

describe("DetailActionBar Start", () => {
  afterEach(cleanup);

  it("starts on a single click and on keyboard activation (detail 0)", () => {
    const start = renderBar();
    fireEvent.click(screen.getByRole("button", { name: "Start" }), { detail: 1 });
    fireEvent.click(screen.getByRole("button", { name: "Start" }), { detail: 0 });
    expect(start).toHaveBeenCalledTimes(2);
  });

  it("ignores the second click of a double-click that began on Save (R3 F2)", () => {
    const start = renderBar();
    fireEvent.click(screen.getByRole("button", { name: "Start" }), { detail: 2 });
    fireEvent.click(screen.getByRole("button", { name: "Start" }), { detail: 3 });
    expect(start).not.toHaveBeenCalled();
  });
});
