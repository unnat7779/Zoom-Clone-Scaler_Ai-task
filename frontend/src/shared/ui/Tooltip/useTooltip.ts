"use client";

import { type FocusEvent, useCallback, useEffect, useRef, useState } from "react";
import { useEscapeKey } from "@/shared/hooks/useEscapeKey";

/** Hover / keyboard-focus open state for a tooltip, with an optional enter delay. */
export function useTooltip({ controlledOpen, disabled, enterDelay }: { controlledOpen?: boolean; disabled?: boolean; enterDelay: number }) {
  const [hoverOpen, setHoverOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };

  const show = useCallback(() => {
    clearTimer();
    if (enterDelay > 0) timer.current = setTimeout(() => setHoverOpen(true), enterDelay);
    else setHoverOpen(true);
  }, [enterDelay]);

  const hide = useCallback(() => {
    clearTimer();
    setHoverOpen(false);
  }, []);

  useEffect(() => clearTimer, []);

  const open = !disabled && (controlledOpen ?? hoverOpen);
  useEscapeKey(hide, open && controlledOpen === undefined);

  const triggerHandlers = {
    onPointerEnter: show,
    onPointerLeave: hide,
    onFocus: (event: FocusEvent<HTMLElement>) => {
      if (event.currentTarget.matches(":focus-visible")) show();
    },
    onBlur: hide,
  };

  return { open, triggerHandlers };
}
