"use client";

import { type ReactNode, useMemo, useRef } from "react";
import clsx from "clsx";
import { type MenuDensity, MenuContext, type MenuTone } from "./MenuContext";
import { useMenuNavigation } from "./useMenuNavigation";
import styles from "./Menu.module.css";

export interface MenuProps {
  /** light: zoom-ui list (padding 12) · dark: meeting-room dropdown list */
  tone?: MenuTone;
  density?: MenuDensity;
  /** focus the first item on mount (keyboard-opened menus) */
  autoFocus?: boolean;
  "aria-label"?: string;
  className?: string;
  children: ReactNode;
}

/**
 * Menu list with roving keyboard focus. Put it inside a `Popover`
 * (variant "floating" for light, "dark" for the room) and fill it with
 * `MenuItem`, `MenuDivider` and `MenuGroupTitle`.
 */
export function Menu({ tone = "light", density = "default", autoFocus = false, className, children, ...aria }: MenuProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const onKeyDown = useMenuNavigation(ref, autoFocus);
  const context = useMemo(() => ({ tone, density }), [tone, density]);
  return (
    <MenuContext.Provider value={context}>
      <div ref={ref} role="menu" className={clsx(styles.menu, styles[tone], className)} onKeyDown={onKeyDown} {...aria}>
        {children}
      </div>
    </MenuContext.Provider>
  );
}
