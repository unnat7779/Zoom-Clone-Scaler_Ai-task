"use client";

import { useId, useState } from "react";
import clsx from "clsx";
import { MEETINGS_ITEM_LABEL, SIDE_MENU } from "./menuItems";
import { CollapsedMenuBar } from "./CollapsedMenuBar";
import { SideMenuGroupItem } from "./SideMenuGroupItem";
import { SideMenuItem } from "./SideMenuItem";
import { UpgradePill } from "./UpgradePill";
import styles from "./SideMenu.module.css";

/**
 * Portal side menu (PRD §7.5.3): 300px column, Meetings selected. At ≤1023px
 * it collapses into a 38px "Meetings ⌄" bar that expands the list inline.
 */
export function SideMenu() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuId = useId();
  return (
    <aside className={styles.column}>
      <CollapsedMenuBar label={MEETINGS_ITEM_LABEL} open={mobileOpen} menuId={menuId} onToggle={() => setMobileOpen((open) => !open)} />
      <div id={menuId} className={clsx(styles.menu, { [styles.menuOpen ?? ""]: mobileOpen })}>
        <nav aria-label="Account menu" className={styles.nav}>
          <ul className={styles.list}>
            {SIDE_MENU.map((entry) => {
              if (entry.kind === "title") {
                return (
                  <li key={entry.label} className={styles.title}>
                    {entry.label}
                  </li>
                );
              }
              if (entry.kind === "group") return <SideMenuGroupItem key={entry.label} group={entry} />;
              return (
                <li key={entry.label}>
                  <SideMenuItem item={entry} selected={entry.label === MEETINGS_ITEM_LABEL} />
                </li>
              );
            })}
          </ul>
        </nav>
        <UpgradePill />
      </div>
    </aside>
  );
}
