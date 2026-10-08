"use client";

import { MEDIA, useMediaQuery } from "@/shared/hooks";

/**
 * A phone in either orientation (DV10, PRD §11.5.3): the room is full viewport with the compact
 * toolbar, phone tile layouts, gallery pages of 4 and menus as bottom sheets. Crossing it (a
 * rotation) only re-renders: the room, its socket, peers and streams stay mounted.
 */
export function usePhoneRoom(): boolean {
  return useMediaQuery(MEDIA.handheld);
}
