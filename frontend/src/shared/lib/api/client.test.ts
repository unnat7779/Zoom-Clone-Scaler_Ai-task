import { describe, expect, it, vi } from "vitest";
import { env } from "../env";
import { ApiError, apiFetch, buildApiUrl, isApiError } from "./client";

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

const stubFetch = (response: Response | Error) =>
  vi.stubGlobal(
    "fetch",
    vi.fn(() => (response instanceof Error ? Promise.reject(response) : Promise.resolve(response))),
  );

const failure = (promise: Promise<unknown>) =>
  promise.then(
    () => {
      throw new Error("expected the request to fail");
    },
    (error: unknown) => error,
  );

describe("buildApiUrl", () => {
  it("prefixes /api and skips null / undefined query values", () => {
    expect(buildApiUrl("/meetings/upcoming", { from: "2026-10-08T04:00:00.000Z", limit: 5, tz: null, q: undefined })).toBe(
      `${env.apiUrl}/api/meetings/upcoming?from=2026-10-08T04%3A00%3A00.000Z&limit=5`,
    );
  });
});

describe("apiFetch", () => {
  it("returns the JSON body and sends JSON bodies", async () => {
    stubFetch(json(200, { ok: true }));
    await expect(apiFetch("/health", { method: "POST", body: { a: 1 } })).resolves.toEqual({ ok: true });
    const [, init] = vi.mocked(fetch).mock.calls[0] ?? [];
    expect(init).toMatchObject({ method: "POST", body: '{"a":1}' });
    expect(init?.headers).toMatchObject({ "Content-Type": "application/json" });
  });

  it("resolves undefined for 204", async () => {
    stubFetch(new Response(null, { status: 204 }));
    await expect(apiFetch("/meetings/1", { method: "DELETE" })).resolves.toBeUndefined();
  });

  it("maps the backend error envelope to its code", async () => {
    stubFetch(json(403, { error: { code: "WRONG_PASSCODE", message: "Incorrect passcode" } }));
    const error = await failure(apiFetch("/meetings/1/join"));
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 403, code: "WRONG_PASSCODE", message: "Incorrect passcode" });
    expect(isApiError(error, "WRONG_PASSCODE")).toBe(true);
    expect(isApiError(error, "MEETING_FULL")).toBe(false);
  });

  it("maps a FastAPI 422 to VALIDATION_ERROR with the first message", async () => {
    stubFetch(json(422, { detail: [{ msg: "display_name too long" }, { msg: "second" }] }));
    await expect(failure(apiFetch("/x"))).resolves.toMatchObject({
      status: 422,
      code: "VALIDATION_ERROR",
      message: "display_name too long",
    });
  });

  it("maps anything else to UNKNOWN_ERROR", async () => {
    stubFetch(new Response("<html>bad gateway</html>", { status: 502, statusText: "Bad Gateway" }));
    await expect(failure(apiFetch("/x"))).resolves.toMatchObject({ status: 502, code: "UNKNOWN_ERROR", message: "Bad Gateway" });
  });

  it("maps a network failure to NETWORK_ERROR with status 0", async () => {
    stubFetch(new TypeError("Failed to fetch"));
    await expect(failure(apiFetch("/x"))).resolves.toMatchObject({ status: 0, code: "NETWORK_ERROR" });
  });

  it("rethrows aborts untouched", async () => {
    const abort = new DOMException("aborted", "AbortError");
    stubFetch(abort);
    await expect(failure(apiFetch("/x"))).resolves.toBe(abort);
  });

  it("isApiError rejects plain errors", () => {
    expect(isApiError(new Error("x"))).toBe(false);
    expect(isApiError({ code: "WRONG_PASSCODE" })).toBe(false);
  });
});
