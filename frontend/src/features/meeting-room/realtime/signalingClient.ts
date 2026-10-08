/**
 * Typed WebSocket client for `/ws/meetings/{number}` (PRD §9.1): JSON messages,
 * a `ping` every 20 s, and reconnects with 1 / 2 / 4 / 8 / 8 s backoff (5 tries).
 */
import { logger } from "@/shared/lib/logger";
import { type ClientMessage, type ServerMessage, WS_CLOSE } from "@/shared/types/realtime";

export type SignalingStatus = "connecting" | "open" | "reconnecting" | "closed";

export interface SignalingHandlers {
  onMessage: (message: ServerMessage) => void;
  onStatus: (status: SignalingStatus) => void;
  /** every reconnect attempt failed */
  onGiveUp: () => void;
}

const HEARTBEAT_MS = 20_000;
const BACKOFF_MS = [1000, 2000, 4000, 8000, 8000];
/** close codes after which reconnecting is pointless (an idle timeout is retried) */
const TERMINAL_CLOSE_CODES: ReadonlySet<number> = new Set([
  WS_CLOSE.replaced,
  WS_CLOSE.unauthorized,
  WS_CLOSE.removed,
  WS_CLOSE.duplicateSession,
]);

function parseFrame(data: string): ServerMessage | null {
  try {
    return JSON.parse(data) as ServerMessage;
  } catch (error) {
    logger.warn("signalling: dropped a malformed frame", error);
    return null;
  }
}

export class SignalingClient {
  private socket: WebSocket | null = null;
  private heartbeat: ReturnType<typeof setInterval> | null = null;
  private retryTimer: ReturnType<typeof setTimeout> | null = null;
  private attempt = 0;
  private stopped = false;

  constructor(
    private readonly url: string,
    private readonly handlers: SignalingHandlers,
  ) {}

  connect(): void {
    this.stopped = false;
    this.handlers.onStatus("connecting");
    this.open();
  }

  send(message: ClientMessage): boolean {
    if (this.socket?.readyState !== WebSocket.OPEN) return false;
    this.socket.send(JSON.stringify(message));
    return true;
  }

  /** Closes for good (leave, end, removed…): no reconnect. */
  close(sendLeave = false): void {
    if (sendLeave) this.send({ type: "leave" });
    this.stopped = true;
    this.clearTimers();
    const socket = this.socket;
    this.socket = null;
    socket?.close(1000);
    this.handlers.onStatus("closed");
  }

  private open(): void {
    const socket = new WebSocket(this.url);
    this.socket = socket;
    socket.onopen = () => {
      this.attempt = 0;
      this.startHeartbeat();
      this.handlers.onStatus("open");
    };
    socket.onmessage = (event: MessageEvent<string>) => {
      if (socket !== this.socket) return;
      const message = parseFrame(event.data);
      if (!message) return;
      // only parsing is guarded: a failure in the room's handler is a defect, never a "malformed frame"
      try {
        this.handlers.onMessage(message);
      } catch (error) {
        logger.error(`signalling: handling "${message.type}" failed`, error);
      }
    };
    socket.onclose = (event) => {
      if (socket !== this.socket) return;
      this.clearTimers();
      if (this.stopped || TERMINAL_CLOSE_CODES.has(event.code)) {
        this.socket = null;
        this.handlers.onStatus("closed");
        return;
      }
      this.scheduleReconnect();
    };
  }

  private scheduleReconnect(): void {
    const delay = BACKOFF_MS[this.attempt];
    if (delay === undefined) {
      this.stopped = true;
      this.handlers.onStatus("closed");
      this.handlers.onGiveUp();
      return;
    }
    this.attempt += 1;
    this.handlers.onStatus("reconnecting");
    this.retryTimer = setTimeout(() => this.open(), delay);
  }

  private startHeartbeat(): void {
    this.heartbeat = setInterval(() => this.send({ type: "ping" }), HEARTBEAT_MS);
  }

  private clearTimers(): void {
    if (this.heartbeat) clearInterval(this.heartbeat);
    if (this.retryTimer) clearTimeout(this.retryTimer);
    this.heartbeat = null;
    this.retryTimer = null;
  }
}
