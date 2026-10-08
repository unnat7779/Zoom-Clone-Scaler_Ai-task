"use client";

import { type RefObject, useLayoutEffect } from "react";
import { computeAnchoredPosition, type Placement, type ViewportBand } from "./anchoredPosition";

export type { Align, Placement, Side } from "./anchoredPosition";

export interface AnchoredPositionOptions {
  anchorRef: RefObject<HTMLElement | null>;
  floatingRef: RefObject<HTMLElement | null>;
  open: boolean;
  placement?: Placement;
  /** gap between anchor and floating element (px) */
  offset?: number;
  /** flip to the opposite side when there is no room (default true) */
  flip?: boolean;
  /** floating width = anchor width (select menus) */
  matchAnchorWidth?: boolean;
  /** minimum distance to the viewport edges (px) */
  viewportPadding?: number;
  /**
   * both (default): keep the element inside the viewport on both axes · horizontal: only
   * left/right, so a non-flipping element keeps its gap to the anchor and may be clipped at the bottom
   */
  viewportClamp?: "both" | "horizontal";
}

/**
 * The viewport width and the vertical band of the layout viewport the user can see: the visual
 * viewport, so a menu is never placed under a phone's on-screen keyboard (which only shrinks the
 * visual viewport).
 */
function viewportBand(): ViewportBand {
  const viewport = window.visualViewport;
  return viewport
    ? { width: window.innerWidth, top: viewport.offsetTop, bottom: viewport.offsetTop + viewport.height }
    : { width: window.innerWidth, top: 0, bottom: window.innerHeight };
}

/**
 * Positions `floatingRef` (rendered `position: fixed`, usually in a portal)
 * next to `anchorRef`. Writes `top/left` straight to the element and sets
 * `data-side` (`top|bottom|left|right`) so CSS can pick the transform origin, and `data-clamped`
 * while it is pushed up or down to fit the viewport.
 */
export function useAnchoredPosition({
  anchorRef,
  floatingRef,
  open,
  placement = "bottom-start",
  offset = 4,
  flip = true,
  matchAnchorWidth = false,
  viewportPadding = 8,
  viewportClamp = "both",
}: AnchoredPositionOptions): void {
  useLayoutEffect(() => {
    const anchor = anchorRef.current;
    const floating = floatingRef.current;
    if (!open || !anchor || !floating) return;

    const update = () => {
      if (matchAnchorWidth) floating.style.width = `${anchor.getBoundingClientRect().width}px`;
      const position = computeAnchoredPosition({
        anchor: anchor.getBoundingClientRect(),
        // layout size: ignores enter transforms such as scaleY(0)
        floating: { width: floating.offsetWidth, height: floating.offsetHeight },
        viewport: viewportBand(),
        placement,
        offset,
        flip,
        padding: viewportPadding,
        clamp: viewportClamp,
      });
      floating.style.top = `${position.top}px`;
      floating.style.left = `${position.left}px`;
      floating.dataset.side = position.side;
      floating.toggleAttribute("data-clamped", position.clamped);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(anchor);
    observer.observe(floating);
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    window.visualViewport?.addEventListener("resize", update);
    window.visualViewport?.addEventListener("scroll", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
      window.visualViewport?.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("scroll", update);
    };
  }, [anchorRef, floatingRef, open, placement, offset, flip, matchAnchorWidth, viewportPadding, viewportClamp]);
}
