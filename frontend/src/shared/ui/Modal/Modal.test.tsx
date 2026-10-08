// @vitest-environment jsdom
import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Modal, type ModalVariant } from "./Modal";
import styles from "./Modal.module.css";

const renderModal = (variant: ModalVariant, open: boolean) =>
  render(
    <Modal open={open} onClose={() => undefined} variant={variant} title="Dialog">
      <button type="button">Inside</button>
    </Modal>,
  );

const overlayOf = (dialog: HTMLElement) => dialog.parentElement as HTMLElement;

describe("Modal leave animation", () => {
  afterEach(cleanup);

  it.each([
    ["portal", 200],
    ["zoom", 300],
  ] as const)("keeps the %s dialog mounted for its %ims leave animation", (variant, exitMs) => {
    vi.useFakeTimers();
    const { rerender } = renderModal(variant, true);
    const dialog = screen.getByRole("dialog");
    expect(overlayOf(dialog).classList.contains(styles.leaving ?? "")).toBe(false);

    rerender(
      <Modal open={false} onClose={() => undefined} variant={variant} title="Dialog">
        <button type="button">Inside</button>
      </Modal>,
    );
    expect(overlayOf(screen.getByRole("dialog")).classList.contains(styles.leaving ?? "")).toBe(true);
    expect(document.body.style.overflow).toBe("hidden");

    act(() => vi.advanceTimersByTime(exitMs));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.body.style.overflow).toBe("");
  });

  it("closes the PWA confirm and the Join frame at once (no leave animation in Zoom)", () => {
    for (const variant of ["confirm", "join"] as const) {
      const { rerender, unmount } = renderModal(variant, true);
      rerender(
        <Modal open={false} onClose={() => undefined} variant={variant} title="Dialog">
          <button type="button">Inside</button>
        </Modal>,
      );
      expect(screen.queryByRole("dialog")).toBeNull();
      unmount();
    }
  });
});

describe("Modal initial focus", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });
  // jsdom lays nothing out: make every element count as visible for the focus trap
  beforeEach(() => {
    vi.spyOn(HTMLElement.prototype, "getClientRects").mockReturnValue([new DOMRect()] as unknown as DOMRectList);
  });

  it("focuses the portal dialog box, not its first button (Enter must not confirm a Delete)", () => {
    renderModal("portal", true);
    expect(document.activeElement).toBe(screen.getByRole("dialog"));
  });

  it("focuses the first control of the other frames", () => {
    renderModal("join", true);
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Inside" }));
  });
});
