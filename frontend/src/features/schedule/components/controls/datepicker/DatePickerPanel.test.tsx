// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DatePickerPanel } from "./DatePickerPanel";

/** Wednesday Oct 7 2026, mid-afternoon */
const TODAY = new Date(2026, 9, 7, 15, 30);

const cell = (day: string, selected = false) =>
  screen.getByRole("gridcell", { name: `${day} ${selected ? "selected" : "not selected"}` });

describe("DatePickerPanel day view", () => {
  afterEach(cleanup);

  it("disables past days (previous month included) but keeps today and next-month days selectable", () => {
    const onSelect = vi.fn<(date: Date) => void>();
    render(<DatePickerPanel selected={new Date(2026, 9, 9)} today={TODAY} onSelect={onSelect} />);

    for (const past of ["Sunday,September 27,2026", "Wednesday,September 30,2026", "Tuesday,October 6,2026"]) {
      expect(cell(past).getAttribute("aria-disabled"), past).toBe("true");
    }
    for (const open of ["Wednesday,October 7,2026", "Saturday,October 31,2026", "Monday,November 2,2026"]) {
      expect(cell(open).hasAttribute("aria-disabled"), open).toBe(false);
    }
    expect(cell("Friday,October 9,2026", true).getAttribute("aria-selected")).toBe("true");
    expect(screen.getAllByRole("gridcell", { selected: true })).toHaveLength(1);

    fireEvent.click(cell("Tuesday,October 6,2026"));
    expect(onSelect).not.toHaveBeenCalled();
    fireEvent.click(cell("Wednesday,October 7,2026"));
    fireEvent.click(cell("Monday,November 2,2026"));
    expect(onSelect.mock.calls).toEqual([[new Date(2026, 9, 7)], [new Date(2026, 10, 2)]]);
  });
});
