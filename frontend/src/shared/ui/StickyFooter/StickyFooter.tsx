"use client";

import { type CSSProperties, type ReactNode, useRef } from "react";
import clsx from "clsx";
import { useStickyFooter } from "./useStickyFooter";
import styles from "./StickyFooter.module.css";

export interface StickyFooterProps {
  /** in-flow slot height (Schedule 80, meeting detail 82) */
  height: number;
  /** slot height at ≤767px when the bar is laid out differently on phones */
  phoneHeight?: number;
  /** the bar (background, padding, buttons layout) */
  className?: string;
  /** extra styles only while pinned (e.g. the detail page's top border) */
  fixedClassName?: string;
  children: ReactNode;
}

/** Action bar that stays at the viewport bottom until its natural slot scrolls into view (PRD §7.6.7, §7.8.3). */
export function StickyFooter({ height, phoneHeight = height, className, fixedClassName, children }: StickyFooterProps) {
  const slotRef = useRef<HTMLDivElement | null>(null);
  const sticky = useStickyFooter(slotRef);
  const slotSize = { "--sticky-slot-height": `${height}px`, "--sticky-slot-height-phone": `${phoneHeight}px` } as CSSProperties;
  return (
    <div ref={slotRef} className={styles.slot} style={slotSize}>
      <div
        className={clsx(styles.bar, className, sticky.fixed && [styles.fixed, fixedClassName])}
        style={sticky.fixed ? { left: sticky.left, width: sticky.width } : undefined}
      >
        {children}
      </div>
    </div>
  );
}
