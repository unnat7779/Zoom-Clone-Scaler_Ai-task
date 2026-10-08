"use client";

import { NavSettingsIcon } from "@/shared/icons/generated/NavSettingsIcon";
import { useShellDialog } from "../../hooks/useShellIntegration";
import { useRailSelection } from "../../hooks/useRailSelection";
import { RAIL_ROUTES } from "../../navigation";
import { NavTab, type NavTabClasses } from "../NavTab/NavTab";
import styles from "./LeftRail.module.css";

const TAB_CLASSES: NavTabClasses = { tab: styles.tab, inner: styles.tabInner, icon: styles.icon, label: styles.label };

/**
 * 80px left rail: Home / Chat / Meetings / Contacts + Settings at the bottom (PRD §6.7).
 * A navigation landmark of links; the current page's link has `aria-current="page"`.
 * Phones (≤767px) get the bottom tab bar instead (`BottomTabBar`).
 */
export function LeftRail() {
  const selected = useRailSelection();
  const settings = useShellDialog("settings");
  return (
    <nav className={styles.rail} aria-label="Workplace">
      <ul className={styles.tabs}>
        {RAIL_ROUTES.map(({ id, label, href, Icon }) => (
          <li key={id}>
            <NavTab href={href} label={label} icon={<Icon />} selected={selected === id} classes={TAB_CLASSES} />
          </li>
        ))}
      </ul>
      <div className={styles.endSection}>
        <NavTab label="Settings" icon={<NavSettingsIcon />} classes={TAB_CLASSES} onClick={settings.show} />
      </div>
    </nav>
  );
}
