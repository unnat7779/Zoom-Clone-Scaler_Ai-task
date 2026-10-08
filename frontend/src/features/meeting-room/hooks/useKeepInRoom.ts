"use client";

import { type RefObject, useLayoutEffect } from "react";
import { ROOM_FRAME_SELECTOR } from "./useRoomAnchor";

/** The stage (`#wc-container-left`): it clips its layers, so toolbar menus must stay inside it. */
const ROOM_STAGE_SELECTOR = "[data-room-stage]";

/**
 * Shifts an absolutely positioned toolbar layer sideways so it never leaves the stage
 * (e.g. More on a 390px phone, where its 247px menu would run off the right edge, or next to
 * an open panel with a promoted button pushing More towards the panel).
 * Only `left` is touched, so the layer keeps moving with the toolbar's slide animation.
 */
export function useKeepInRoom(layerRef: RefObject<HTMLElement | null>, enabled = true): void {
  useLayoutEffect(() => {
    if (!enabled) return;
    const layer = layerRef.current;
    const bounds = (layer?.closest(ROOM_STAGE_SELECTOR) ?? layer?.closest(ROOM_FRAME_SELECTOR))?.getBoundingClientRect();
    if (!layer || !bounds) return;
    layer.style.left = "";
    const rect = layer.getBoundingClientRect();
    const shift = rect.right > bounds.right ? bounds.right - rect.right : rect.left < bounds.left ? bounds.left - rect.left : 0;
    if (shift !== 0) layer.style.left = `${layer.offsetLeft + shift}px`;
  }, [layerRef, enabled]);
}
