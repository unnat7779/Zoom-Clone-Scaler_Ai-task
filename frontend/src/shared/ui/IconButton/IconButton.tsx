import type { ComponentPropsWithRef, ReactNode } from "react";
import clsx from "clsx";
import styles from "./IconButton.module.css";

export type IconButtonSize = "sm" | "md";

export interface IconButtonProps extends Omit<ComponentPropsWithRef<"button">, "type" | "aria-label"> {
  /** accessible name (Zoom's measured aria-labels, PRD §12) — required */
  label: string;
  icon: ReactNode;
  /** box 24 / 32; glyph 14 / 16 */
  size?: IconButtonSize;
  /** circle (zoom-ui, Prism) or rounded square (radius 6 / 8, header Back/Forward/History) */
  shape?: "circle" | "rounded";
  type?: "button" | "submit";
}

/** Icon-only tertiary button (transparent → #6E76801F hover) with every Zoom state (hover, active, focus-visible, disabled). */
export function IconButton({ label, icon, size = "md", shape = "circle", type = "button", className, title, ...rest }: IconButtonProps) {
  return (
    <button type={type} aria-label={label} title={title} className={clsx(styles.button, styles[size], styles[shape], className)} {...rest}>
      {icon}
    </button>
  );
}
