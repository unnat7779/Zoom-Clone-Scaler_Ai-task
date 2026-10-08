"use client";

import { type RefObject, useLayoutEffect } from "react";

export interface AutosizeRows {
  minRows?: number;
  maxRows?: number;
}

function resize(el: HTMLTextAreaElement, minRows: number, maxRows: number) {
  const style = window.getComputedStyle(el);
  const lineHeight = parseFloat(style.lineHeight);
  const borders = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
  const chrome = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom) + borders;
  const min = minRows * lineHeight + chrome;
  const max = maxRows * lineHeight + chrome;
  el.style.height = "auto";
  const needed = el.scrollHeight + borders;
  el.style.height = `${Math.min(Math.max(needed, min), max)}px`;
  el.style.overflowY = needed > max ? "auto" : "hidden";
}

/**
 * Grows a textarea with its content between `minRows` and `maxRows`, then
 * scrolls (Schedule description: 2 rows = 50px → 4 rows = 86px).
 * Works for controlled (`value`) and uncontrolled textareas.
 */
export function useAutosize(ref: RefObject<HTMLTextAreaElement | null>, value: unknown, rows: AutosizeRows | undefined) {
  const enabled = rows !== undefined;
  const minRows = rows?.minRows ?? 2;
  const maxRows = rows?.maxRows ?? 4;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!enabled || !el) return;
    const onInput = () => resize(el, minRows, maxRows);
    onInput();
    el.addEventListener("input", onInput);
    return () => el.removeEventListener("input", onInput);
  }, [enabled, maxRows, minRows, ref, value]);
}
