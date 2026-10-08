import type { MeetingValidation } from "@/shared/types/api";

/**
 * loading: validate in flight · invalid: unknown number ("This meeting link is invalid (3,001)") ·
 * unreachable: the backend could not be reached · form: "Enter Meeting Info" (also while the
 * meeting waits for its host: Zoom asks for the name first and holds the guest after Join).
 */
export type PreJoinStage = "loading" | "invalid" | "unreachable" | "form";

/** Not started and no join-before-host: Join puts the guest on hold until the host starts. */
export const isWaitingForHost = (validation: MeetingValidation): boolean =>
  validation.exists && !validation.is_live && !validation.join_before_host;

export function getPreJoinStage(validation: MeetingValidation | undefined, failed: boolean): PreJoinStage {
  if (validation) return validation.exists ? "form" : "invalid";
  return failed ? "unreachable" : "loading";
}

/** The passcode row shows only when the meeting has one and the link's `pwd` did not unlock it. */
export const needsPasscode = (validation: MeetingValidation): boolean =>
  validation.requires_passcode && !validation.passcode_ok;
