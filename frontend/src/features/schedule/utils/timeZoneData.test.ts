import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { TIME_ZONES } from "./timeZoneData";

/** The backend keeps the same 149 zones (R7 F-m7): this test fails as soon as the two lists drift. */
const BACKEND_LIST = fileURLToPath(new URL("../../../../../backend/app/services/timezone_data.py", import.meta.url));

const parsePython = (source: string): [string, string][] =>
  Array.from(source.matchAll(/^\s*\("([^"]+)",\s*"([^"]+)"\),?$/gm), (match) => [match[1] ?? "", match[2] ?? ""]);

describe("TIME_ZONES", () => {
  it("has Zoom's 149 zones, each IANA id once", () => {
    expect(TIME_ZONES).toHaveLength(149);
    expect(new Set(TIME_ZONES.map(([iana]) => iana)).size).toBe(149);
  });

  it.skipIf(!existsSync(BACKEND_LIST))("equals backend/app/services/timezone_data.py, in menu order", () => {
    expect(parsePython(readFileSync(BACKEND_LIST, "utf8"))).toEqual(TIME_ZONES.map(([iana, label]) => [iana, label]));
  });
});
