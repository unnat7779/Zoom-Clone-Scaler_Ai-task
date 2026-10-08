import { env } from "@/shared/lib/env";

/** STUN (Google) plus the optional TURN server from `NEXT_PUBLIC_TURN_*` (PRD §9.1). */
export function getIceServers(): RTCIceServer[] {
  const servers: RTCIceServer[] = [{ urls: "stun:stun.l.google.com:19302" }];
  if (env.turn.url) {
    servers.push({
      urls: env.turn.url,
      username: env.turn.username ?? undefined,
      credential: env.turn.credential ?? undefined,
    });
  }
  return servers;
}
