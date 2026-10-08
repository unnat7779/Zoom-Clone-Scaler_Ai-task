"use client";

import { type RefObject, useLayoutEffect } from "react";

export type RoomPlacement = "bottom-start" | "bottom-end" | "top-end" | "top-start";

/** The room root (`#wc-content`): anchored layers stay inside its box. */
export const ROOM_FRAME_SELECTOR = "[data-room-frame]";

interface RoomAnchorOptions {
  anchorRef: RefObject<HTMLElement | null>;
  floatingRef: RefObject<HTMLElement | null>;
  open: boolean;
  placement: RoomPlacement;
  /** gap to the trigger (px) */
  offset: number;
  /** extra horizontal shift (px; negative = left), e.g. to centre an arrow on the trigger */
  shift?: number;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), Math.max(min, max));

function place(anchor: HTMLElement, floating: HTMLElement, placement: RoomPlacement, offset: number, shift: number): void {
  floating.style.top = "0px";
  floating.style.left = "0px";
  const origin = floating.getBoundingClientRect();
  const frame =
    floating.closest(ROOM_FRAME_SELECTOR)?.getBoundingClientRect() ?? new DOMRect(0, 0, window.innerWidth, window.innerHeight);
  const a = anchor.getBoundingClientRect();
  const { width, height } = origin;
  const below = a.bottom + offset;
  const above = a.top - offset - height;
  const wantsTop = placement.startsWith("top");
  const top = wantsTop ? (above >= frame.top ? above : below) : below + height <= frame.bottom ? below : above;
  const left = clamp((placement.endsWith("end") ? a.right - width : a.left) + shift, frame.left, frame.right - width);
  floating.style.top = `${top - origin.top}px`;
  floating.style.left = `${left - origin.left}px`;
}

/**
 * Places a `position: fixed` layer next to its trigger, flipping vertically and
 * shifting horizontally so it stays inside the room (re-placed on window resize).
 * Fixed escapes the panels' overflow clipping. Coordinates are measured against the
 * layer's own containing block (the viewport in-shell and full-viewport, or any
 * transformed ancestor), so the room's position inside the Workplace card never
 * shifts the menu.
 */
export function useRoomAnchor({ anchorRef, floatingRef, open, placement, offset, shift = 0 }: RoomAnchorOptions): void {
  useLayoutEffect(() => {
    if (!open) return;
    const update = () => {
      if (anchorRef.current && floatingRef.current) place(anchorRef.current, floatingRef.current, placement, offset, shift);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [anchorRef, floatingRef, open, placement, offset, shift]);
}
