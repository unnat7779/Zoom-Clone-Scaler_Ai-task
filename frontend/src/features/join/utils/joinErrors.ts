import { isApiError } from "@/shared/lib/api";

/** Messages shown in the pre-join form (14px/18px #E02828, 4px below their element). */
export interface JoinFormErrors {
  passcode?: string;
  name?: string;
  /** under the Join button */
  join?: string;
}

/** What the page does with a failed `POST /join` (PRD §7.10.1 step 4, [D] copy). */
export type JoinFailure =
  | { kind: "form"; errors: JoinFormErrors; showPasscode?: boolean }
  /** MEETING_NOT_STARTED → on hold until the host starts the meeting */
  | { kind: "waiting" }
  /** MEETING_NOT_FOUND → the invalid-link page */
  | { kind: "invalid" };

export const JOIN_ERROR_COPY = {
  /** `apac.preview.incorrect_password` */
  wrongPasscode: "Incorrect Password",
  full: "This meeting is full.",
  removed: "You have been removed from this meeting.",
  name: "Please enter your name.",
  network: "Unable to connect. Please check your network connection and try again.",
  generic: "Unable to join this meeting. Please try again later.",
} as const;

const formFailure = (errors: JoinFormErrors): JoinFailure => ({ kind: "form", errors });

export function toJoinFailure(error: unknown): JoinFailure {
  if (!isApiError(error)) return formFailure({ join: JOIN_ERROR_COPY.generic });
  switch (error.code) {
    case "WRONG_PASSCODE":
      return { kind: "form", errors: { passcode: JOIN_ERROR_COPY.wrongPasscode }, showPasscode: true };
    case "MEETING_FULL":
      return formFailure({ join: JOIN_ERROR_COPY.full });
    case "REMOVED":
      return formFailure({ join: JOIN_ERROR_COPY.removed });
    case "MEETING_NOT_STARTED":
      return { kind: "waiting" };
    case "MEETING_NOT_FOUND":
      return { kind: "invalid" };
    case "VALIDATION_ERROR":
      return formFailure({ name: JOIN_ERROR_COPY.name });
    case "NETWORK_ERROR":
      return formFailure({ join: JOIN_ERROR_COPY.network });
    default:
      return formFailure({ join: JOIN_ERROR_COPY.generic });
  }
}
