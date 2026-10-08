"use client";

import { type RefObject, useEffect, useRef } from "react";

type ElementRef = RefObject<Element | null>;

/**
 * Calls `handler` on a pointerdown outside every element in `refs`
 * (e.g. the popover and its trigger). Inactive while `enabled` is false.
 */
export function useClickOutside(
  refs: ElementRef | ElementRef[],
  handler: (event: PointerEvent) => void,
  enabled = true,
): void {
  const handlerRef = useRef(handler);
  const refsRef = useRef(refs);

  useEffect(() => {
    handlerRef.current = handler;
    refsRef.current = refs;
  });

  useEffect(() => {
    if (!enabled) return;
    const onPointerDown = (event: PointerEvent) => {
      const list = Array.isArray(refsRef.current) ? refsRef.current : [refsRef.current];
      const target = event.target as Node | null;
      const inside = list.some((ref) => ref.current && target && ref.current.contains(target));
      if (!inside) handlerRef.current(event);
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, [enabled]);
}
