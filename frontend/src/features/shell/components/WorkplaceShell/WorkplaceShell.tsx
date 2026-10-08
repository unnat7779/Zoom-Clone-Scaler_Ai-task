"use client";

import type { ReactNode } from "react";
import clsx from "clsx";
import { ShellProvider } from "../../context/ShellContext";
import { ActivityCenterDock } from "../ActivityCenter/ActivityCenterDock";
import { BottomTabBar } from "../BottomTabBar/BottomTabBar";
import { Header } from "../Header/Header";
import { LeftRail } from "../LeftRail/LeftRail";
import { ShellOverlays } from "../ShellOverlays/ShellOverlays";
import styles from "./WorkplaceShell.module.css";

/**
 * visible: header + rail + card · hidden: full viewport (the wrappers take no box) ·
 * desktop: visible above 767px, full viewport on phones (the in-shell room, PRD §11.5).
 */
export type ShellChrome = "visible" | "hidden" | "desktop";

interface WorkplaceShellProps {
  children: ReactNode;
  chrome?: ShellChrome;
}

/**
 * Workplace chrome (PRD §6.1): 64px header, empty 4px banner slot, 80px left
 * rail and the white content card (`calc(100vw - 86px) × calc(100vh - 74px)`,
 * radius 12, overflow hidden), then the docked Activity Center while the bell
 * is pressed (§6.5). Pages render inside the card. Phones (≤767px) [D] get a 56px header, a
 * full-bleed card and the bottom tab bar instead of the rail; heights use the dynamic viewport.
 *
 * The element tree is the same in every `chrome` mode, so the page inside the card
 * never remounts when the chrome is toggled (e.g. a meeting crossing the phone breakpoint).
 */
export function WorkplaceShell({ children, chrome = "visible" }: WorkplaceShellProps) {
  const withChrome = chrome !== "hidden";
  return (
    <ShellProvider>
      <div className={clsx(styles.shell, styles[chrome])}>
        {withChrome ? <Header /> : null}
        {withChrome ? <div className={styles.bannerSlot} /> : null}
        <div className={styles.mainBody}>
          {withChrome ? <LeftRail /> : null}
          <div role={withChrome ? "main" : undefined} className={styles.contentColumn}>
            <div className={styles.card}>{children}</div>
          </div>
          {withChrome ? <ActivityCenterDock /> : null}
        </div>
        {withChrome ? <BottomTabBar /> : null}
      </div>
      {withChrome ? <ShellOverlays /> : null}
    </ShellProvider>
  );
}
