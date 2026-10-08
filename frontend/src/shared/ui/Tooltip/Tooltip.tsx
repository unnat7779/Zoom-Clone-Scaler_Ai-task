"use client";

import { type ReactElement, type ReactNode, type Ref, cloneElement, useId, useRef } from "react";
import clsx from "clsx";
import { type Placement, useAnchoredPosition } from "@/shared/hooks/useAnchoredPosition";
import { useLingering } from "@/shared/hooks/useLingering";
import { useMergedRef } from "@/shared/lib/mergeRefs";
import { Portal } from "../Portal";
import { useTooltip } from "./useTooltip";

/** Prism white tooltips fade out too (`opacity 300ms`, R2-F10); the dark ones close at once. */
const EXIT_MS = { light: 300, dark: 0, "mui-dark": 0 } as const;
import styles from "./Tooltip.module.css";

type TriggerProps = {
  ref?: Ref<HTMLElement>;
  "aria-describedby"?: string;
  onPointerEnter?: (event: never) => void;
  onPointerLeave?: (event: never) => void;
  onFocus?: (event: never) => void;
  onBlur?: (event: never) => void;
};

export interface TooltipProps {
  content: ReactNode;
  /** a single element that accepts a ref (button, IconButton, span…) */
  children: ReactElement<TriggerProps>;
  /**
   * light: Prism white (#FFF, 1px #DFE3E8, #2A2B2D text) — Activity bell, "Copied!"
   * dark: zoom-ui (#000000A3 + blur) — truncated options, date-picker headers
   * mui-dark: header History (#222325, .5px #313235, #F7F9FA)
   */
  variant?: "light" | "dark" | "mui-dark";
  placement?: Placement;
  /** px between trigger and tooltip (light 8, mui-dark 4) */
  offset?: number;
  /** controlled visibility (e.g. "Copied!" after a click) */
  open?: boolean;
  disabled?: boolean;
  className?: string;
}

/** Tooltip anchored to its child; opens on hover / keyboard focus (no delay; mui-dark 100 ms). */
export function Tooltip({ content, children, variant = "light", placement = "bottom", offset, open, disabled, className }: TooltipProps) {
  const id = useId();
  const anchorRef = useRef<HTMLElement | null>(null);
  const floatingRef = useRef<HTMLDivElement | null>(null);
  const tooltip = useTooltip({ controlledOpen: open, disabled, enterDelay: variant === "mui-dark" ? 100 : 0 });
  const gap = offset ?? (variant === "mui-dark" ? 4 : 8);
  const leaving = useLingering(tooltip.open, EXIT_MS[variant]);
  const shown = tooltip.open || leaving;
  useAnchoredPosition({ anchorRef, floatingRef, open: shown, placement, offset: gap });

  const childProps = children.props;
  const handlers = tooltip.triggerHandlers;
  const ref = useMergedRef(anchorRef, childProps.ref);
  const trigger = cloneElement(children, {
    ref,
    "aria-describedby": tooltip.open ? id : childProps["aria-describedby"],
    onPointerEnter: chain(childProps.onPointerEnter, handlers.onPointerEnter),
    onPointerLeave: chain(childProps.onPointerLeave, handlers.onPointerLeave),
    onFocus: chain(childProps.onFocus, handlers.onFocus),
    onBlur: chain(childProps.onBlur, handlers.onBlur),
  } as TriggerProps);

  return (
    <>
      {trigger}
      {shown ? (
        <Portal>
          <div ref={floatingRef} id={id} role="tooltip" className={clsx(styles.tooltip, styles[variant], { [styles.leaving ?? ""]: leaving }, className)}>
            {content}
          </div>
        </Portal>
      ) : null}
    </>
  );
}

function chain<E>(first: ((event: E) => void) | undefined, second: (event: E) => void) {
  return (event: E) => {
    first?.(event);
    second(event);
  };
}
