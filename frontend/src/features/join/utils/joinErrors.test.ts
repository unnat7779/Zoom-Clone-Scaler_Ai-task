import { describe, expect, it } from "vitest";
import { ApiError } from "@/shared/lib/api";
import type { ApiErrorCode } from "@/shared/types/api";
import { JOIN_ERROR_COPY, toJoinFailure } from "./joinErrors";

const apiError = (code: ApiErrorCode, status = 400) => new ApiError(status, code, "server message");

describe("toJoinFailure", () => {
  it("shows the passcode row with an error for a wrong passcode", () => {
    expect(toJoinFailure(apiError("WRONG_PASSCODE", 403))).toEqual({
      kind: "form",
      errors: { passcode: "Incorrect Password" },
      showPasscode: true,
    });
  });

  it.each([
    ["MEETING_FULL", { join: JOIN_ERROR_COPY.full }],
    ["REMOVED", { join: JOIN_ERROR_COPY.removed }],
    ["VALIDATION_ERROR", { name: JOIN_ERROR_COPY.name }],
    ["NETWORK_ERROR", { join: JOIN_ERROR_COPY.network }],
  ] as const)("%s → form error %o", (code, errors) => {
    expect(toJoinFailure(apiError(code))).toEqual({ kind: "form", errors });
  });

  it("goes back to waiting when the meeting has not started", () => {
    expect(toJoinFailure(apiError("MEETING_NOT_STARTED", 409))).toEqual({ kind: "waiting" });
  });

  it("shows the invalid-link page for an unknown meeting", () => {
    expect(toJoinFailure(apiError("MEETING_NOT_FOUND", 404))).toEqual({ kind: "invalid" });
  });

  it.each<ApiErrorCode>(["INTERNAL_ERROR", "UNKNOWN_ERROR", "UNAUTHORIZED", "MEETING_LIVE"])(
    "falls back to the generic message for %s",
    (code) => {
      expect(toJoinFailure(apiError(code, 500))).toEqual({ kind: "form", errors: { join: JOIN_ERROR_COPY.generic } });
    },
  );

  it.each([new Error("boom"), "string", null, { code: "WRONG_PASSCODE" }])("treats non-API errors (%o) as generic", (error) => {
    expect(toJoinFailure(error)).toEqual({ kind: "form", errors: { join: JOIN_ERROR_COPY.generic } });
  });

  it("never shows the raw server message", () => {
    const failure = toJoinFailure(apiError("MEETING_FULL"));
    expect(JSON.stringify(failure)).not.toContain("server message");
  });
});
