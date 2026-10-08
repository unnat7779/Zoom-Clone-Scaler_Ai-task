/**
 * Public runtime configuration (PRD §13). `NEXT_PUBLIC_*` variables are
 * inlined at build time, so each one is referenced literally below.
 */

const trimSlash = (url: string) => url.replace(/\/+$/, "");

const apiUrl = trimSlash(process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000");

export type ZoomPlan = "pro" | "basic";

export const env = {
  /** Backend origin; the API client appends `/api`. */
  apiUrl,
  /** WebSocket origin for `/ws/meetings/{number}`; defaults to the API origin. */
  wsUrl: trimSlash(process.env.NEXT_PUBLIC_WS_URL || apiUrl.replace(/^http/, "ws")),
  /** Plan imitated by the Schedule page (PRD §7.6.4). */
  /** Synthetic camera + microphone for browsers without devices (development/testing). */
  fakeMedia: process.env.NEXT_PUBLIC_FAKE_MEDIA === "1",
  plan: (process.env.NEXT_PUBLIC_PLAN === "basic" ? "basic" : "pro") as ZoomPlan,
  turn: {
    url: process.env.NEXT_PUBLIC_TURN_URL || null,
    username: process.env.NEXT_PUBLIC_TURN_USERNAME || null,
    credential: process.env.NEXT_PUBLIC_TURN_CREDENTIAL || null,
  },
} as const;

/** Public origin of the frontend, used for invite links. */
export function getAppUrl(): string {
  const configured = process.env.NEXT_PUBLIC_APP_URL;
  if (configured) return trimSlash(configured);
  if (typeof window !== "undefined") return window.location.origin;
  return "http://localhost:3000";
}
