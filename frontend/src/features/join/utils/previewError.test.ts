import { describe, expect, it } from "vitest";
import { NO_PREVIEW_FAILURES, nextPreviewFailures, previewErrorFor } from "./previewError";

describe("previewErrorFor", () => {
  it("maps refused devices to Zoom's forbidden messages", () => {
    expect(previewErrorFor("video", "denied")).toBe("videoForbidden");
    expect(previewErrorFor("audio", "denied")).toBe("audioForbidden");
  });

  it("maps a missing or busy camera, and nothing for the microphone", () => {
    expect(previewErrorFor("video", "notFound")).toBe("cameraNotFound");
    expect(previewErrorFor("video", "busy")).toBe("cameraBusy");
    expect(previewErrorFor("audio", "busy")).toBeNull();
    expect(previewErrorFor("audio", "notFound")).toBeNull();
  });

  it("shows nothing for a request that never answered or no failure", () => {
    expect(previewErrorFor("video", "timeout")).toBeNull();
    expect(previewErrorFor("video", null)).toBeNull();
  });
});

describe("nextPreviewFailures", () => {
  it("keeps the same object when nothing changed", () => {
    expect(nextPreviewFailures(NO_PREVIEW_FAILURES, null, null)).toBe(NO_PREVIEW_FAILURES);
  });

  it("shows the failure set last", () => {
    const camera = nextPreviewFailures(NO_PREVIEW_FAILURES, null, "denied");
    expect(camera.error).toBe("videoForbidden");
    const mic = nextPreviewFailures(camera, "denied", "denied");
    expect(mic.error).toBe("audioForbidden");
  });

  it("prefers the camera when both fail at once", () => {
    expect(nextPreviewFailures(NO_PREVIEW_FAILURES, "denied", "denied").error).toBe("videoForbidden");
  });

  it("falls back to the other device's error when one recovers, and clears when both do", () => {
    const both = nextPreviewFailures(nextPreviewFailures(NO_PREVIEW_FAILURES, null, "busy"), "denied", "busy");
    expect(both.error).toBe("audioForbidden");
    const micBack = nextPreviewFailures(both, null, "busy");
    expect(micBack.error).toBe("cameraBusy");
    expect(nextPreviewFailures(micBack, null, null).error).toBeNull();
  });

  it("keeps the banner when an unrelated device changes", () => {
    const camera = nextPreviewFailures(NO_PREVIEW_FAILURES, null, "notFound");
    expect(nextPreviewFailures(camera, "timeout", "notFound").error).toBe("cameraNotFound");
  });
});
