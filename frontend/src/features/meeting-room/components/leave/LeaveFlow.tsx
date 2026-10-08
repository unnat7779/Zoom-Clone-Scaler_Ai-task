"use client";

import { useRef } from "react";
import { useLeaveFocus } from "../../hooks/useLeaveFocus";
import { LeaveBar } from "./LeaveBar";
import { LeavePopover } from "./LeavePopover";

/** End / Leave flow (PRD §8.14): the bar that replaces the toolbar and the options popover above it. */
export function LeaveFlow() {
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const cancel = useLeaveFocus(popoverRef);
  return (
    <>
      <LeaveBar onCancel={cancel} />
      <LeavePopover ref={popoverRef} />
    </>
  );
}
