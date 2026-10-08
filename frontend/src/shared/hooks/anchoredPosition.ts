export type Side = "top" | "bottom" | "left" | "right";
export type Align = "start" | "center" | "end";
export type Placement = Side | `${Side}-${Exclude<Align, "center">}`;

export interface AnchorRect {
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

export interface FloatingSize {
  width: number;
  height: number;
}

/** The viewport width and the vertical band the user can see (the visual viewport, above a phone keyboard). */
export interface ViewportBand {
  width: number;
  top: number;
  bottom: number;
}

export interface PositionRequest {
  anchor: AnchorRect;
  floating: FloatingSize;
  viewport: ViewportBand;
  placement: Placement;
  offset: number;
  flip: boolean;
  padding: number;
  clamp: "both" | "horizontal";
}

export interface AnchoredPosition {
  top: number;
  left: number;
  side: Side;
  /** pushed up or down off its side to stay on screen (it may cover the anchor; an arrow would point wrong) */
  clamped: boolean;
}

const OPPOSITE: Record<Side, Side> = { top: "bottom", bottom: "top", left: "right", right: "left" };

function place(a: AnchorRect, f: FloatingSize, side: Side, align: Align, offset: number) {
  const along = (start: number, size: number, length: number) =>
    align === "start" ? start : align === "end" ? start + size - length : start + size / 2 - length / 2;
  if (side === "top" || side === "bottom") {
    const top = side === "bottom" ? a.bottom + offset : a.top - offset - f.height;
    return { top, left: along(a.left, a.width, f.width) };
  }
  const left = side === "right" ? a.right + offset : a.left - offset - f.width;
  return { top: along(a.top, a.height, f.height), left };
}

function fits(pos: { top: number; left: number }, f: FloatingSize, side: Side, v: ViewportBand, pad: number) {
  if (side === "bottom") return pos.top + f.height <= v.bottom - pad;
  if (side === "top") return pos.top >= v.top + pad;
  if (side === "right") return pos.left + f.width <= v.width - pad;
  return pos.left >= pad;
}

const clampTo = (value: number, min: number, max: number) => Math.max(min, Math.min(value, Math.max(min, max)));

/**
 * Where a `position: fixed` element goes next to its anchor: on the placement's side, flipped to
 * the opposite side when only that one fits (`flip`), then kept inside the viewport horizontally
 * and — with `clamp: "both"` — vertically as well.
 */
export function computeAnchoredPosition(request: PositionRequest): AnchoredPosition {
  const { anchor, floating, viewport, placement, offset, flip, padding, clamp } = request;
  const [side, alignPart] = placement.split("-") as [Side, Exclude<Align, "center"> | undefined];
  const align: Align = alignPart ?? "center";
  let finalSide = side;
  let pos = place(anchor, floating, side, align, offset);
  if (flip && !fits(pos, floating, side, viewport, padding)) {
    const flipped = place(anchor, floating, OPPOSITE[side], align, offset);
    if (fits(flipped, floating, OPPOSITE[side], viewport, padding)) {
      pos = flipped;
      finalSide = OPPOSITE[side];
    }
  }
  const top = clamp === "both" ? clampTo(pos.top, viewport.top + padding, viewport.bottom - floating.height - padding) : pos.top;
  const left = clampTo(pos.left, padding, viewport.width - floating.width - padding);
  return { top, left, side: finalSide, clamped: top !== pos.top };
}
