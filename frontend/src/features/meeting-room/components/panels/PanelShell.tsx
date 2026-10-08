import type { ReactNode } from "react";
import clsx from "clsx";
import styles from "./PanelShell.module.css";

export type PanelMode = "full" | "half" | "mini";

interface PanelShellProps {
  mode: PanelMode;
  /** the chat container has no border of its own */
  bordered?: boolean;
  "aria-label": string;
  children: ReactNode;
}

/** Rounded dark panel in the right container; "half" when stacked, "mini" = 44px title bar. */
export function PanelShell({ mode, bordered = true, children, ...aria }: PanelShellProps) {
  return (
    <section className={clsx(styles.shell, mode !== "full" && styles[mode], !bordered && styles.borderless)} {...aria}>
      {children}
    </section>
  );
}
