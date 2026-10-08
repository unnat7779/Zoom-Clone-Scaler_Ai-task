"use client";

import type { RefObject } from "react";
import { useClickOutside, useEscapeKey } from "@/shared/hooks";

/**
 * Closes a room popover on Escape or a pointerdown outside it and its trigger
 * (PRD §8.4.2: "clicking the trigger again, clicking outside or Escape closes them").
 */
export function usePopoverDismiss(refs: RefObject<Element | null>[], open: boolean, onClose: () => void): void {
  useClickOutside(refs, onClose, open);
  useEscapeKey(onClose, open);
}
