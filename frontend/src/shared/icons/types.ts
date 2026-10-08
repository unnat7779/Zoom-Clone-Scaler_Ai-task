import type { SVGProps } from "react";

/**
 * Props of every generated icon component.
 * - `size` sets the rendered size (both sides for square icons; the height for
 *   non-square ones, the width follows the aspect ratio). Without it the icon
 *   keeps the size from Zoom's SVG (`1em` for most glyphs, so CSS `font-size`
 *   or `width/height` on the svg also work).
 * - `title` makes the icon meaningful to screen readers; otherwise it is
 *   `aria-hidden`.
 * - Single-colour icons use `currentColor`: set the colour with CSS `color`.
 */
export type IconProps = Omit<SVGProps<SVGSVGElement>, "ref"> & {
  size?: number | string;
  title?: string;
};
