import { beforeEach, describe, expect, it, vi } from "vitest";
import { SignalingClient, type SignalingStatus } from "./signalingClient";

/** Minimal in-memory WebSocket: tests drive open / message / close by hand. */
class FakeSocket {
  static readonly OPEN = 1;
  static instances: FakeSocket[] = [];

  readyState = 0;
  sent: unknown[] = [];
  closedWith: number | undefined;
  onopen: (() => void) | null = null;
  onmessage: ((event: { data: string }) => void) | null = null;
  onclose: ((event: { code: number }) => void) | null = null;

  constructor(readonly url: string) {
    FakeSocket.instances.push(this);
  }

  send(data: string) {
    this.sent.push(JSON.parse(data));
  }

  close(code?: number) {
    this.closedWith = code;
    this.drop(code ?? 1005);
  }

  accept() {
    this.readyState = FakeSocket.OPEN;
    this.onopen?.();
  }

  receive(data: string) {
    this.onmessage?.({ data });
  }

  drop(code = 1006) {
    this.readyState = 3;
    this.onclose?.({ code });
  }
}

const latest = () => FakeSocket.instances.at(-1)!;

function setup() {
  const statuses: SignalingStatus[] = [];
  const handlers = { onMessage: vi.fn(), onStatus: vi.fn((s: SignalingStatus) => statuses.push(s)), onGiveUp: vi.fn() };
  const client = new SignalingClient("ws://test/ws/meetings/1?token=t", handlers);
  client.connect();
  return { client, handlers, statuses };
}

describe("SignalingClient", () => {
  beforeEach(() => {
    FakeSocket.instances = [];
    vi.stubGlobal("WebSocket", FakeSocket);
    vi.useFakeTimers();
  });

  it("connects and reports the status", () => {
    const { statuses } = setup();
    expect(latest().url).toBe("ws://test/ws/meetings/1?token=t");
    latest().accept();
    expect(statuses).toEqual(["connecting", "open"]);
  });

  it("reconnects after 1, 2, 4, 8 and 8 seconds, then gives up", () => {
    const { handlers, statuses } = setup();
    latest().accept();

    for (const delay of [1000, 2000, 4000, 8000, 8000]) {
      const sockets = FakeSocket.instances.length;
      latest().drop();
      vi.advanceTimersByTime(delay - 1);
      expect(FakeSocket.instances).toHaveLength(sockets);
      vi.advanceTimersByTime(1);
      expect(FakeSocket.instances).toHaveLength(sockets + 1);
    }

    latest().drop();
    vi.advanceTimersByTime(60_000);
    expect(FakeSocket.instances).toHaveLength(6);
    expect(handlers.onGiveUp).toHaveBeenCalledOnce();
    expect(statuses.filter((s) => s === "reconnecting")).toHaveLength(5);
    expect(statuses.at(-1)).toBe("closed");
  });

  it("restarts the backoff after a successful reconnect", () => {
    setup();
    latest().accept();
    latest().drop();
    vi.advanceTimersByTime(1000);
    latest().drop();
    vi.advanceTimersByTime(2000);
    latest().accept();

    latest().drop();
    vi.advanceTimersByTime(1000);
    expect(FakeSocket.instances).toHaveLength(4);
  });

  it.each([4000, 4401, 4403, 4409])("does not reconnect after close code %i", (code) => {
    const { handlers, statuses } = setup();
    latest().accept();
    latest().drop(code);
    vi.advanceTimersByTime(60_000);
    expect(FakeSocket.instances).toHaveLength(1);
    expect(statuses.at(-1)).toBe("closed");
    expect(handlers.onGiveUp).not.toHaveBeenCalled();
  });

  it("pings every 20 seconds while open and stops when the socket drops", () => {
    setup();
    const socket = latest();
    socket.accept();
    vi.advanceTimersByTime(20_000 * 3);
    expect(socket.sent).toEqual([{ type: "ping" }, { type: "ping" }, { type: "ping" }]);

    socket.drop();
    vi.advanceTimersByTime(20_000);
    expect(socket.sent).toHaveLength(3);
  });

  it("sends JSON only while the socket is open", () => {
    const { client } = setup();
    expect(client.send({ type: "media_state", audio_muted: true, video_on: false })).toBe(false);
    latest().accept();
    expect(client.send({ type: "media_state", audio_muted: true, video_on: false })).toBe(true);
    expect(latest().sent).toEqual([{ type: "media_state", audio_muted: true, video_on: false }]);
  });

  it("close(true) sends leave, closes with 1000 and never reconnects", () => {
    const { client, statuses } = setup();
    const socket = latest();
    socket.accept();
    client.close(true);

    expect(socket.sent).toEqual([{ type: "leave" }]);
    expect(socket.closedWith).toBe(1000);
    vi.advanceTimersByTime(60_000);
    expect(FakeSocket.instances).toHaveLength(1);
    expect(statuses.at(-1)).toBe("closed");
  });

  it("cancels a pending reconnect when closed", () => {
    const { client } = setup();
    latest().accept();
    latest().drop();
    client.close();
    vi.advanceTimersByTime(60_000);
    expect(FakeSocket.instances).toHaveLength(1);
  });

  it("parses server messages, ignores malformed frames and frames from a replaced socket", () => {
    const { handlers } = setup();
    const first = latest();
    first.accept();
    first.receive('{"type":"pong"}');
    first.receive("not json");
    expect(handlers.onMessage).toHaveBeenCalledTimes(1);
    expect(handlers.onMessage).toHaveBeenCalledWith({ type: "pong" });

    first.drop();
    vi.advanceTimersByTime(1000);
    first.receive('{"type":"pong"}');
    expect(handlers.onMessage).toHaveBeenCalledTimes(1);
  });
});
