"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/** PRD §8.13 lifetimes [M]: default 5000 ms, host change 3000 ms; null = until closed. */
export const TOAST_DEFAULT_MS = 5000;
export const TOAST_HOST_MS = 3000;
const MAX_VISIBLE = 3;

export interface RoomToast {
  id: number;
  message: string;
  /** a toast with the same key replaces the previous one */
  key?: string;
  closable: boolean;
}

export interface RoomToastOptions {
  message: string;
  key?: string;
  /** ms; null keeps it until dismissed */
  duration?: number | null;
  closable?: boolean;
}

export interface RoomToasts {
  toasts: RoomToast[];
  show: (options: RoomToastOptions) => number;
  dismiss: (idOrKey: number | string) => void;
}

/** Dark notification stack of the meeting room (`.notification-manager`). */
export function useRoomToasts(): RoomToasts {
  const [toasts, setToasts] = useState<RoomToast[]>([]);
  const nextId = useRef(1);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const clearTimer = useCallback((id: number) => {
    clearTimeout(timers.current.get(id));
    timers.current.delete(id);
  }, []);

  /** by id (also stops its timer) or by key (keyed toasts such as "Reconnecting" have no timer) */
  const dismiss = useCallback(
    (idOrKey: number | string) => {
      if (typeof idOrKey === "number") clearTimer(idOrKey);
      setToasts((current) => current.filter((toast) => toast.id !== idOrKey && toast.key !== idOrKey));
    },
    [clearTimer],
  );

  const show = useCallback(
    ({ message, key, duration = TOAST_DEFAULT_MS, closable = false }: RoomToastOptions) => {
      const id = nextId.current++;
      setToasts((current) => [...current.filter((toast) => !key || toast.key !== key), { id, message, key, closable }].slice(-MAX_VISIBLE));
      // the fired timer leaves the map through dismiss → clearTimer
      if (duration !== null) timers.current.set(id, setTimeout(() => dismiss(id), duration));
      return id;
    },
    [dismiss],
  );

  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach((timer) => clearTimeout(timer));
      pending.clear();
    };
  }, []);

  return useMemo(() => ({ toasts, show, dismiss }), [toasts, show, dismiss]);
}
