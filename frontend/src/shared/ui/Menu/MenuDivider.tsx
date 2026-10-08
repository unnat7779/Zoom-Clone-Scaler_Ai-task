"use client";

import clsx from "clsx";
import { useMenuContext } from "./MenuContext";
import styles from "./Menu.module.css";

/** Light: 8px + 1px #DFE3E8 + 8px, inset 8 · Dark: 1px rgba(255,255,255,.09), margin 9px 0. */
export function MenuDivider() {
  const { tone } = useMenuContext();
  return <div role="separator" className={clsx(styles.divider, styles[`${tone}Divider`])} />;
}
