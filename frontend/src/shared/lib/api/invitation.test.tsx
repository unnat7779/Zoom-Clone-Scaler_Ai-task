// @vitest-environment jsdom
import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { copyText } from "@/shared/hooks/useClipboard";
import { useInvitationActions, useMeetingInvitation } from "./invitation";
import { getMeetingInvitation } from "./meetings";

vi.mock("./meetings", () => ({ getMeetingInvitation: vi.fn() }));
vi.mock("@/shared/hooks/useClipboard", () => ({ copyText: vi.fn() }));

const fetchInvitation = vi.mocked(getMeetingInvitation);
const writeClipboard = vi.mocked(copyText);

const wrapperWith = (client: QueryClient) =>
  function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };

const newClient = () => new QueryClient({ defaultOptions: { queries: { retry: false } } });

describe("shared invitation query", () => {
  beforeEach(() => {
    fetchInvitation.mockReset();
    writeClipboard.mockReset();
  });

  it("copies the text and reuses the cache entry the list/detail views read", async () => {
    fetchInvitation.mockResolvedValue({ text: "Join Zoom Meeting\r\n" });
    writeClipboard.mockResolvedValue(true);
    const client = newClient();
    const wrapper = wrapperWith(client);
    const actions = renderHook(() => useInvitationActions(), { wrapper }).result.current;

    await expect(actions.copy({ number: "5123456789", id: 7 })).resolves.toBe(true);
    await expect(actions.copy({ number: "5123456789", id: 7 })).resolves.toBe(true);
    expect(fetchInvitation).toHaveBeenCalledTimes(1);
    expect(fetchInvitation.mock.calls[0]?.[0]).toEqual({ number: "5123456789", id: 7 });
    expect(writeClipboard).toHaveBeenCalledWith("Join Zoom Meeting\r\n");

    const view = renderHook(() => useMeetingInvitation({ number: "5123456789", id: 7 }), { wrapper });
    expect(view.result.current.data?.text).toBe("Join Zoom Meeting\r\n");
    expect(fetchInvitation).toHaveBeenCalledTimes(1);
  });

  it("resolves false when the request fails", async () => {
    fetchInvitation.mockRejectedValue(new Error("offline"));
    const { result } = renderHook(() => useInvitationActions(), { wrapper: wrapperWith(newClient()) });
    await expect(result.current.copy({ number: "123456789" })).resolves.toBe(false);
    expect(writeClipboard).not.toHaveBeenCalled();
  });

  it("waits for `enabled` before requesting", async () => {
    fetchInvitation.mockResolvedValue({ text: "x" });
    const { result, rerender } = renderHook(({ enabled }) => useMeetingInvitation({ number: "123456789" }, { enabled }), {
      wrapper: wrapperWith(newClient()),
      initialProps: { enabled: false },
    });
    expect(fetchInvitation).not.toHaveBeenCalled();
    rerender({ enabled: true });
    await waitFor(() => expect(result.current.data?.text).toBe("x"));
    expect(fetchInvitation).toHaveBeenCalledTimes(1);
  });
});
