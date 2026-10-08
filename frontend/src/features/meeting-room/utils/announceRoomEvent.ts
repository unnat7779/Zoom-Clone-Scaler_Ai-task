import type { RoomEvent } from "../realtime/messageHandler";
import { type RoomToasts, TOAST_HOST_MS } from "../hooks/useRoomToasts";

const RECONNECT_KEY = "reconnecting";

/**
 * Room toasts (PRD §8.13) with Zoom's own strings (i18n `wc_audio.*`, `errorcodes_re_connect`,
 * `dialog.network_error`). Zoom shows no joined / left toasts — the roster updates silently.
 */
export function announceRoomEvent({ show, dismiss }: Pick<RoomToasts, "show" | "dismiss">, event: RoomEvent): void {
  switch (event.type) {
    case "hostNow":
      show({ message: "You are host now.", key: "host", duration: TOAST_HOST_MS });
      return;
    case "hostIs":
      show({ message: `${event.name} is the host now.`, key: "host", duration: TOAST_HOST_MS });
      return;
    case "forceMuted":
      show({ message: event.all ? "The host muted everyone" : "The host muted you", key: "muted" });
      return;
    case "unmuteRefused":
      show({ message: "You cannot unmute yourself because the host muted you.", key: "muted" });
      return;
    case "reconnecting":
      show({ message: "Meeting is reconnecting.", key: RECONNECT_KEY, duration: null });
      return;
    case "reconnected":
      dismiss(RECONNECT_KEY);
      return;
    case "endFailed":
      show({ message: "Network error, please try again.", key: "end" });
      return;
  }
}
