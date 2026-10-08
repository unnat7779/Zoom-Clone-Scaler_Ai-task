/** Why a full-viewport participant lands on `/wc/{n}/left` (PRD §7.11). */
export type LeftReason = "left" | "ended" | "removed";

const REASONS: readonly LeftReason[] = ["left", "ended", "removed"];

export const parseLeftReason = (value: string | null): LeftReason =>
  REASONS.find((reason) => reason === value) ?? "left";

/** `pwd` of an invite URL, so "Rejoin" can skip the passcode prompt. */
export function invitePwd(inviteUrl: string | undefined): string | null {
  if (!inviteUrl) return null;
  try {
    return new URL(inviteUrl).searchParams.get("pwd");
  } catch {
    return null;
  }
}
