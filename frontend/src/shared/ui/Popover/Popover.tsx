"use client";

import { type CSSProperties, type ReactNode, type RefObject, useRef } from "react";
import clsx from "clsx";
import { type AnchoredPositionOptions, type Placement, useAnchoredPosition } from "@/shared/hooks/useAnchoredPosition";
import { useClickOutside } from "@/shared/hooks/useClickOutside";
import { useEscapeKey } from "@/shared/hooks/useEscapeKey";
import { useFocusTrap } from "@/shared/hooks/useFocusTrap";
import { Portal } from "../Portal";
import styles from "./Popover.module.css";

export interface PopoverProps {
  open: boolean;
  onClose: () => void;
  /** element the popover is attached to (also counts as "inside" for outside clicks) */
  anchorRef: RefObject<HTMLElement | null>;
  placement?: Placement;
  /** gap to the anchor in px (Prism 8, zoom-ui floating 4) */
  offset?: number;
  flip?: boolean;
  matchAnchorWidth?: boolean;
  /** false: not positioned next to the anchor (CSS places it, e.g. a full-screen sheet) */
  anchored?: boolean;
  /** "horizontal": never pushed up/down to fit the viewport (keeps its gap to the anchor) */
  viewportClamp?: AnchoredPositionOptions["viewportClamp"];
  /**
   * floating: zoom-ui menu (radius 12, #DFE3E8 border, shadow-md, z 2000)
   * prism: Prism popover (radius 10, z 1300) · dark: room dropdown · plain: no chrome
   */
  variant?: "floating" | "prism" | "dark" | "plain";
  /** fade: opacity .3s (Prism) · zoom-in: scaleY .3s (zoom-ui menus) · fade-linear: opacity .3s linear (profile menu) */
  motion?: "none" | "fade" | "zoom-in" | "fade-linear";
  closeOnOutsideClick?: boolean;
  closeOnEscape?: boolean;
  /** move focus into the popover and keep Tab inside */
  trapFocus?: boolean;
  role?: "dialog" | "menu" | "listbox" | "tooltip" | "region";
  "aria-label"?: string;
  "aria-labelledby"?: string;
  id?: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

/** Anchored floating panel (portal, fixed position, flip, outside click, Escape). */
export function Popover({
  open,
  onClose,
  anchorRef,
  placement = "bottom-start",
  offset = 4,
  flip = true,
  matchAnchorWidth = false,
  anchored = true,
  viewportClamp = "both",
  variant = "floating",
  motion = "fade",
  closeOnOutsideClick = true,
  closeOnEscape = true,
  trapFocus = false,
  role = "dialog",
  className,
  style,
  children,
  ...aria
}: PopoverProps) {
  const floatingRef = useRef<HTMLDivElement | null>(null);
  useAnchoredPosition({ anchorRef, floatingRef, open: open && anchored, placement, offset, flip, matchAnchorWidth, viewportClamp });
  useClickOutside([floatingRef, anchorRef], onClose, open && closeOnOutsideClick);
  useEscapeKey(onClose, open && closeOnEscape);
  useFocusTrap(floatingRef, open && trapFocus);

  if (!open) return null;
  return (
    <Portal>
      <div
        ref={floatingRef}
        role={role}
        tabIndex={-1}
        className={clsx(styles.popover, styles[variant], styles[motion], className)}
        style={style}
        {...aria}
      >
        {children}
      </div>
    </Portal>
  );
}
