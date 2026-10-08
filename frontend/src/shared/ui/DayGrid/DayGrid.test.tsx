// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DayGrid, type DayGridProps } from "./DayGrid";
import { useVisibleMonth } from "./useVisibleMonth";
import styles from "./DayGrid.module.css";

/** Wednesday Oct 7 2026, mid-afternoon */
const TODAY = new Date(2026, 9, 7, 15, 30);

const renderGrid = (props: Partial<DayGridProps> = {}) => {
  const onSelect = vi.fn<(day: Date) => void>();
  render(<DayGrid month={new Date(2026, 9, 1)} selected={new Date(2026, 9, 9)} today={TODAY} onSelect={onSelect} {...props} />);
  return onSelect;
};

/** Zoom's cell aria-label: `Friday,October 9,2026 selected` / `… not selected` */
const cell = (day: string, selected = false) =>
  screen.getByRole("gridcell", { name: `${day} ${selected ? "selected" : "not selected"}` });

const hasClass = (element: HTMLElement, name: string | undefined) => Boolean(name) && element.classList.contains(name ?? "");

describe("DayGrid", () => {
  afterEach(cleanup);

  it("renders a Sunday-first weekday row and 6 weeks of 7 days", () => {
    renderGrid();
    expect(screen.getByRole("grid", { name: "October 2026" })).toBeTruthy();
    expect(screen.getAllByRole("columnheader").map((header) => header.getAttribute("aria-label"))).toEqual([
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ]);
    expect(screen.getAllByRole("row")).toHaveLength(7);

    const cells = screen.getAllByRole("gridcell");
    expect(cells).toHaveLength(42);
    expect(cells[0]?.getAttribute("aria-label")).toBe("Sunday,September 27,2026 not selected");
    expect(cells[0]?.textContent).toBe("27");
    expect(cells.at(-1)?.getAttribute("aria-label")).toBe("Saturday,November 7,2026 not selected");
  });

  it("marks only the selected day, which is also the only tab stop", () => {
    renderGrid();
    const selected = cell("Friday,October 9,2026", true);
    expect(selected.getAttribute("aria-selected")).toBe("true");
    expect(hasClass(selected, styles.selected)).toBe(true);

    const cells = screen.getAllByRole("gridcell");
    expect(cells.filter((item) => item.getAttribute("aria-selected") === "true")).toEqual([selected]);
    expect(cells.filter((item) => item.tabIndex === 0)).toEqual([selected]);
  });

  it("styles today, and other-month days as outside", () => {
    renderGrid();
    const today = cell("Wednesday,October 7,2026");
    expect(hasClass(today, styles.today)).toBe(true);
    expect(hasClass(today, styles.outside)).toBe(false);
    expect(hasClass(cell("Monday,November 2,2026"), styles.outside)).toBe(true);
    expect(hasClass(cell("Wednesday,September 30,2026"), styles.outside)).toBe(true);
    expect(hasClass(cell("Thursday,October 8,2026"), styles.outside)).toBe(false);
  });

  it("shows today in the selected style when it is the selected day", () => {
    renderGrid({ selected: TODAY });
    const today = cell("Wednesday,October 7,2026", true);
    expect(hasClass(today, styles.selected)).toBe(true);
    expect(hasClass(today, styles.today)).toBe(false);
  });

  it("does not select a disabled day, and shows it disabled instead of outside", () => {
    const onSelect = renderGrid({ isDisabled: (day) => day.getDay() === 0 || day.getDay() === 6 });
    const sunday = cell("Sunday,September 27,2026");
    expect(sunday.getAttribute("aria-disabled")).toBe("true");
    expect(hasClass(sunday, styles.disabled)).toBe(true);
    expect(hasClass(sunday, styles.outside)).toBe(false);
    fireEvent.click(sunday);
    expect(onSelect).not.toHaveBeenCalled();

    const monday = cell("Monday,September 28,2026");
    expect(monday.hasAttribute("aria-disabled")).toBe(false);
    fireEvent.click(monday);
    expect(onSelect).toHaveBeenCalledExactlyOnceWith(new Date(2026, 8, 28));
  });

  it("puts the tab stop on the first enabled day when the selection is in another month", () => {
    renderGrid({ selected: new Date(2026, 11, 1), isDisabled: (day) => day < new Date(2026, 9, 7) });
    const cells = screen.getAllByRole("gridcell");
    expect(cells.filter((item) => item.tabIndex === 0)).toEqual([cell("Wednesday,October 7,2026")]);
    expect(cells.some((item) => item.getAttribute("aria-selected") === "true")).toBe(false);
  });
});

/** The Home day picker's wiring: the view follows the keyboard. */
function PagedGrid({ selected }: { selected: Date }) {
  const view = useVisibleMonth(selected);
  return <DayGrid month={view.month} selected={selected} today={TODAY} onSelect={() => undefined} onMonthChange={view.showMonth} />;
}

const focusedLabel = () => document.activeElement?.getAttribute("aria-label")?.replace(/ (not )?selected$/, "");
const press = (key: string) => fireEvent.keyDown(document.activeElement ?? document.body, { key });

describe("DayGrid keyboard", () => {
  afterEach(cleanup);

  it("moves a single tab stop by day, week and to the week's ends", () => {
    renderGrid();
    cell("Friday,October 9,2026", true).focus();
    press("ArrowRight");
    expect(focusedLabel()).toBe("Saturday,October 10,2026");
    press("ArrowDown");
    expect(focusedLabel()).toBe("Saturday,October 17,2026");
    press("Home");
    expect(focusedLabel()).toBe("Sunday,October 11,2026");
    press("End");
    expect(focusedLabel()).toBe("Saturday,October 17,2026");
    press("ArrowUp");
    press("ArrowLeft");
    expect(focusedLabel()).toBe("Friday,October 9,2026");
    const stops = screen.getAllByRole("gridcell").filter((item) => item.tabIndex === 0);
    expect(stops).toEqual([document.activeElement]);
  });

  it("stops at the grid's edges and ignores Page Up / Down without onMonthChange", () => {
    renderGrid({ selected: new Date(2026, 10, 7) });
    cell("Saturday,November 7,2026", true).focus();
    press("ArrowRight");
    press("ArrowDown");
    press("PageDown");
    expect(focusedLabel()).toBe("Saturday,November 7,2026");
    expect(screen.getByRole("grid").getAttribute("aria-label")).toBe("October 2026");
  });

  it("follows the focus into other months with onMonthChange", () => {
    render(<PagedGrid selected={new Date(2026, 9, 27)} />);
    cell("Tuesday,October 27,2026", true).focus();
    press("ArrowDown");
    expect(focusedLabel()).toBe("Tuesday,November 3,2026");
    expect(screen.getByRole("grid").getAttribute("aria-label")).toBe("October 2026");
    press("ArrowDown");
    expect(focusedLabel()).toBe("Tuesday,November 10,2026");
    expect(screen.getByRole("grid").getAttribute("aria-label")).toBe("November 2026");
    press("PageUp");
    press("PageUp");
    expect(focusedLabel()).toBe("Thursday,September 10,2026");
    expect(screen.getByRole("grid").getAttribute("aria-label")).toBe("September 2026");
    // Oct 10 is still on the September grid (Aug 30 – Oct 10): the view stays
    press("PageDown");
    expect(focusedLabel()).toBe("Saturday,October 10,2026");
    expect(screen.getByRole("grid").getAttribute("aria-label")).toBe("September 2026");
    press("ArrowRight");
    expect(focusedLabel()).toBe("Sunday,October 11,2026");
    expect(screen.getByRole("grid").getAttribute("aria-label")).toBe("October 2026");
  });
});
