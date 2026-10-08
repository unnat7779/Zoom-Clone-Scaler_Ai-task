import type { ScheduleFormValues } from "../types";

/** Zoom-like default passcode: 6 mixed-case alphanumerics without the ambiguous `0OoIl1` (PRD §10.2). */
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";

export function randomPasscode(length = 6): string {
  const bytes = new Uint32Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (value) => ALPHABET[value % ALPHABET.length]).join("");
}

/** "Passcode must include: At least 1 characters" — an enabled, empty passcode blocks Save (PRD §7.6.4). */
export const isPasscodeInvalid = (values: Pick<ScheduleFormValues, "passcodeEnabled" | "passcode">): boolean =>
  values.passcodeEnabled && values.passcode.length === 0;
