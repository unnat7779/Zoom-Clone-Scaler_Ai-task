import type { ReactNode } from "react";
import clsx from "clsx";
import styles from "./Badge.module.css";

export type BadgeColor = "red" | "blue" | "gray" | "green" | "orange" | "yellow" | "purple" | "cyan";

export interface BadgeProps {
  /** palette colour (default blue) */
  color?: BadgeColor;
  /** md 10/16 500 (default) · sm 8/12 600 */
  size?: "sm" | "md";
  children?: ReactNode;
  className?: string;
}

/** zoom-ui label badge (06-design-system.md §6.2): a bordered chip, e.g. the portal "New" `<Badge>New</Badge>`. */
export function Badge({ color = "blue", size = "md", children, className }: BadgeProps) {
  return <span className={clsx(styles.badge, styles[color], styles[size], className)}>{children}</span>;
}
