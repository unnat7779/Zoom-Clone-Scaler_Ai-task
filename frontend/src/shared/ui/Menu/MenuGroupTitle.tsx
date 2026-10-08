"use client";

import type { ReactNode } from "react";
import clsx from "clsx";
import { useMenuContext } from "./MenuContext";
import styles from "./Menu.module.css";

/** Section caption: light 12/16 #686F79 ("Filter by") · dark 12/18 700 #F5F5F5 ("Select a Microphone"). */
export function MenuGroupTitle({ children }: { children: ReactNode }) {
  const { tone } = useMenuContext();
  return (
    <div role="presentation" className={clsx(styles.groupTitle, styles[`${tone}GroupTitle`])}>
      {children}
    </div>
  );
}
