"use client";

import { useEffect, useRef } from "react";

/**
 * Layered Escape handling: only the most recently enabled handler runs, so a
 * menu inside a modal closes before the modal does.
 */
type Entry = { current: (event: KeyboardEvent) => void };

const stack: Entry[] = [];

function onKeyDown(event: KeyboardEvent) {
  if (event.key !== "Escape" || event.defaultPrevented) return;
  const top = stack[stack.length - 1];
  if (!top) return;
  event.preventDefault();
  top.current(event);
}

export function useEscapeKey(handler: (event: KeyboardEvent) => void, enabled = true): void {
  const entryRef = useRef<Entry>({ current: handler });

  useEffect(() => {
    entryRef.current.current = handler;
  });

  useEffect(() => {
    if (!enabled) return;
    const entry = entryRef.current;
    if (stack.length === 0) document.addEventListener("keydown", onKeyDown);
    stack.push(entry);
    return () => {
      const index = stack.lastIndexOf(entry);
      if (index >= 0) stack.splice(index, 1);
      if (stack.length === 0) document.removeEventListener("keydown", onKeyDown);
    };
  }, [enabled]);
}
