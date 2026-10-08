"use client";

import { useCallback, useRef, useSyncExternalStore } from "react";
import { readStorage, subscribeStorage, writeStorage } from "../lib/storage";

/**
 * JSON value in localStorage, kept in sync across components and tabs.
 * Returns `initialValue` during server rendering and when the key is unset.
 * `setValue(null)` removes the key.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const initialRef = useRef(initialValue);
  const cache = useRef<{ raw: string | null; value: T } | null>(null);

  const getSnapshot = useCallback((): T => {
    let raw: string | null = null;
    try {
      raw = window.localStorage.getItem(key);
    } catch {
      raw = null;
    }
    if (cache.current && cache.current.raw === raw) return cache.current.value;
    const value = raw === null ? initialRef.current : readStorage<T>(key, initialRef.current);
    cache.current = { raw, value };
    return value;
  }, [key]);

  const subscribe = useCallback((onChange: () => void) => subscribeStorage(key, onChange), [key]);
  const value = useSyncExternalStore(subscribe, getSnapshot, () => initialRef.current);

  const setValue = useCallback(
    (next: T | null | ((previous: T) => T | null)) => {
      const resolved = typeof next === "function" ? (next as (previous: T) => T | null)(getSnapshot()) : next;
      writeStorage(key, resolved);
    },
    [getSnapshot, key],
  );

  return [value, setValue] as const;
}
