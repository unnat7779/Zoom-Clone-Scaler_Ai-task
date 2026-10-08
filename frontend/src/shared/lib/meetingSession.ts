/**
 * Hand-off between the entry routes (pre-join page, host start) and the meeting room.
 *
 * The entry route calls `saveMeetingSession` with the `start`/`join` response and the
 * mic/camera choices; the room reads it with `loadMeetingSession`. It lives in
 * sessionStorage (per browser tab) so a refresh inside the room can reconnect, while a
 * second tab of the same browser can still join as a different participant.
 */
import type { MeetingSession } from "@/shared/types/api";

export interface MeetingEntryPreferences {
  audioMuted: boolean;
  videoOn: boolean;
  audioInputId?: string;
  videoInputId?: string;
  /** speaker chosen on the pre-join page; the room applies it with setSinkId */
  audioOutputId?: string;
}

export interface StoredMeetingSession extends MeetingSession {
  meetingNumber: string;
  preferences: MeetingEntryPreferences;
  savedAt: number;
}

const sessionKey = (meetingNumber: string) => `zc.session.${meetingNumber}`;

function getSessionStorage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.sessionStorage;
  } catch {
    return null;
  }
}

export function saveMeetingSession(
  meetingNumber: string,
  session: MeetingSession,
  preferences: MeetingEntryPreferences,
): void {
  const stored: StoredMeetingSession = { ...session, meetingNumber, preferences, savedAt: Date.now() };
  try {
    getSessionStorage()?.setItem(sessionKey(meetingNumber), JSON.stringify(stored));
  } catch {
    /* storage disabled: the room will send the user back to the entry route */
  }
}

export function loadMeetingSession(meetingNumber: string): StoredMeetingSession | null {
  const raw = getSessionStorage()?.getItem(sessionKey(meetingNumber));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredMeetingSession;
  } catch {
    return null;
  }
}

export function clearMeetingSession(meetingNumber: string): void {
  try {
    getSessionStorage()?.removeItem(sessionKey(meetingNumber));
  } catch {
    /* nothing to clear */
  }
}
