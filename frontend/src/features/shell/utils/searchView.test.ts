import { describe, expect, it } from "vitest";
import { searchView } from "./searchView";

describe("searchView", () => {
  it("shows Recent searches with Clear all while the field is empty", () => {
    expect(searchView("")).toEqual({ heading: "Recent searches", showClear: false, showClearAll: true });
  });

  it("shows No results with the inline Clear once text is typed", () => {
    expect(searchView("test")).toEqual({ heading: "No results", showClear: true, showClearAll: false });
  });

  it("treats whitespace as typed text", () => {
    expect(searchView(" ").heading).toBe("No results");
  });
});
