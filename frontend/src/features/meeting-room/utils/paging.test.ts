import { describe, expect, it } from "vitest";
import { clampPage, pageCount, pageItems } from "./paging";

const people = ["A", "B", "C", "D", "E", "F", "G"];

describe("pageCount", () => {
  it("counts whole pages, at least one", () => {
    expect(pageCount(0, 4)).toBe(1);
    expect(pageCount(4, 4)).toBe(1);
    expect(pageCount(5, 4)).toBe(2);
    expect(pageCount(8, 4)).toBe(2);
    expect(pageCount(9, 4)).toBe(3);
  });

  it("treats a page size below 1 as 1", () => {
    expect(pageCount(3, 0)).toBe(3);
  });
});

describe("clampPage", () => {
  it("keeps the page inside the existing pages (people leaving removes the last page)", () => {
    expect(clampPage(1, 7, 4)).toBe(1);
    expect(clampPage(1, 4, 4)).toBe(0);
    expect(clampPage(-2, 7, 4)).toBe(0);
    expect(clampPage(5, 7, 4)).toBe(1);
  });
});

describe("pageItems", () => {
  it("returns the 4 tiles of a page, and the rest on the last page", () => {
    expect(pageItems(people, 0, 4)).toEqual(["A", "B", "C", "D"]);
    expect(pageItems(people, 1, 4)).toEqual(["E", "F", "G"]);
  });

  it("falls back to the last page when the requested one no longer exists", () => {
    expect(pageItems(people, 3, 4)).toEqual(["E", "F", "G"]);
    expect(pageItems(people.slice(0, 3), 1, 4)).toEqual(["A", "B", "C"]);
    expect(pageItems([], 0, 4)).toEqual([]);
  });
});
