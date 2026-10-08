"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";
import { SchCheckmarkIcon } from "@/shared/icons/generated/SchCheckmarkIcon";
import { useMenuContext } from "./MenuContext";
import styles from "./Menu.module.css";

export interface MenuItemProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onSelect" | "type"> {
  /** 16px leading icon (light) */
  icon?: ReactNode;
  /** trailing slot: chevron for submenus, shortcut, external-link icon… */
  trailing?: ReactNode;
  /** show `trailing` only while the row is hovered (profile-menu ↗ icons) */
  trailingOnHover?: boolean;
  /** checked state: light ✓ at the right, dark ✓ at the left (13×12) */
  selected?: boolean;
  danger?: boolean;
  /** row with an open submenu (`.is-active`) */
  active?: boolean;
  onSelect?: () => void;
}

export function MenuItem({
  icon,
  trailing,
  trailingOnHover = false,
  selected,
  danger = false,
  active = false,
  disabled,
  onSelect,
  className,
  children,
  ...rest
}: MenuItemProps) {
  const { tone, density } = useMenuContext();
  const checkable = selected !== undefined;
  return (
    <button
      type="button"
      role={checkable ? "menuitemcheckbox" : "menuitem"}
      aria-checked={checkable ? selected : undefined}
      aria-disabled={disabled || undefined}
      tabIndex={-1}
      className={clsx(
        styles.item,
        styles[`${tone}Item`],
        { [styles.profile ?? ""]: density === "profile", [styles.danger ?? ""]: danger, [styles.active ?? ""]: active },
        className,
      )}
      onClick={disabled ? undefined : onSelect}
      {...rest}
    >
      {tone === "dark" && selected ? <span className={styles.darkCheck} aria-hidden /> : null}
      {icon ? <span className={styles.icon}>{icon}</span> : null}
      <span className={styles.label}>{children}</span>
      {tone === "light" && selected ? <SchCheckmarkIcon className={styles.check} /> : null}
      {trailing ? <span className={clsx(styles.trailing, { [styles.onHover ?? ""]: trailingOnHover })}>{trailing}</span> : null}
    </button>
  );
}
