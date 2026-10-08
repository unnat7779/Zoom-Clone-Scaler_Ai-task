"use client";

import { type FocusEvent, type MouseEvent, type PointerEvent, type ReactElement, type ReactNode, type Ref, cloneElement, useId, useRef, useState } from "react";
import clsx from "clsx";
import type { Placement } from "@/shared/hooks/useAnchoredPosition";
import { useMergedRef } from "@/shared/lib/mergeRefs";
import { Popover } from "../Popover";
import { useHoverIntent } from "./useHoverIntent";
import styles from "./HoverPopover.module.css";

type TriggerProps = {
  ref?: Ref<HTMLElement>;
  "aria-describedby"?: string;
  onPointerEnter?: (event: never) => void;
  onPointerLeave?: (event: never) => void;
  onClick?: (event: never) => void;
  onFocus?: (event: never) => void;
  onBlur?: (event: never) => void;
};

export interface HoverPopoverProps {
  content: ReactNode;
  /** a single element that accepts a ref */
  children: ReactElement<TriggerProps>;
  /**
   * prism: Prism popover with a 16px arrow ("Add a calendar", radius 10, padding 12, centred #2A2B2D text)
   * info: zoom-ui info popover with a 14px arrow (Schedule ⓘ buttons, passcode rules; padding 16)
   * portal: zoom.us light tooltip with a 6px arrow ("Copy the Link"; 14/24 #6E7680)
   */
  variant?: "prism" | "info" | "portal";
  placement?: Placement;
  /** gap between trigger and popover box (px) */
  offset?: number;
  /** keep open regardless of hover (e.g. passcode rules while the input is focused) */
  forceOpen?: boolean;
  /** touch: a tap on the trigger toggles the popover (ⓘ buttons); an outside tap closes it */
  toggleOnTap?: boolean;
  /** popover box class (width, z-index) */
  className?: string;
}

const isTouch = (event: PointerEvent) => event.pointerType === "touch";

/** clicks are PointerEvents (Chrome, Firefox, Safari 17+); older engines: a device without hover */
const isTouchClick = (event: MouseEvent) => {
  const { pointerType } = event.nativeEvent as globalThis.PointerEvent;
  return pointerType === "touch" || (pointerType === undefined && window.matchMedia("(hover: none)").matches);
};

/**
 * Popover that opens while the pointer is over its trigger or over itself, or while the trigger has
 * keyboard focus (PRD §5.8.9, §5.8.10); the trigger is described by it while it is open. Touch has
 * no hover: touch pointers never open it (a tap would only flash it), `toggleOnTap` opens it on tap.
 */
export function HoverPopover({
  content,
  children,
  variant = "prism",
  placement = "top",
  offset = 8,
  forceOpen = false,
  toggleOnTap = false,
  className,
}: HoverPopoverProps) {
  const id = useId();
  const anchorRef = useRef<HTMLElement | null>(null);
  const hover = useHoverIntent();
  const [tapped, setTapped] = useState(false);
  const open = forceOpen || hover.open || tapped;
  const ref = useMergedRef(anchorRef, children.props.ref);
  const close = () => {
    hover.close();
    setTapped(false);
  };
  const trigger = cloneElement(children, {
    ref,
    "aria-describedby": open ? id : children.props["aria-describedby"],
    onPointerEnter: chain(children.props.onPointerEnter, (event: PointerEvent) => !isTouch(event) && hover.enter()),
    onPointerLeave: chain(children.props.onPointerLeave, (event: PointerEvent) => !isTouch(event) && hover.leave()),
    onClick: chain(children.props.onClick, (event: MouseEvent) => {
      if (toggleOnTap && isTouchClick(event)) setTapped((current) => !current);
    }),
    onFocus: chain(children.props.onFocus, (event: FocusEvent<HTMLElement>) => {
      if (event.target.matches(":focus-visible")) hover.enter();
    }),
    onBlur: chain(children.props.onBlur, hover.leave),
  } as TriggerProps);

  return (
    <>
      {trigger}
      <Popover
        id={id}
        open={open}
        onClose={close}
        anchorRef={anchorRef}
        placement={placement}
        offset={offset}
        variant="plain"
        motion="none"
        closeOnOutsideClick={tapped}
        role="tooltip"
        className={clsx(styles.popover, styles[variant], className)}
      >
        <div className={styles.body} onPointerEnter={hover.enter} onPointerLeave={hover.leave}>
          {content}
        </div>
      </Popover>
    </>
  );
}

function chain<E>(first: ((event: E) => void) | undefined, second: (event: E) => void) {
  return (event: E) => {
    first?.(event);
    second(event);
  };
}
