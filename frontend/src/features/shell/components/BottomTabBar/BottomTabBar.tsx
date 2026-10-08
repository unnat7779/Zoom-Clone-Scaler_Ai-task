"use client";

import { NavSettingsIcon } from "@/shared/icons/generated/NavSettingsIcon";
import { useShellDialog } from "../../hooks/useShellIntegration";
import { useRailSelection } from "../../hooks/useRailSelection";
import { TAB_BAR_ROUTES } from "../../navigation";
import { NavTab, type NavTabClasses } from "../NavTab/NavTab";
import styles from "./BottomTabBar.module.css";

const TAB_CLASSES: NavTabClasses = { tab: styles.tab, inner: styles.inner, icon: styles.icon, label: styles.label };

/**
 * Phone navigation (≤767px) [D] — replaces the 80px rail, whose layout leaves a 304px card on a
 * phone: a 56px white bar with a #DFE3E8 top rule, Home · Meetings · Chat · Contacts · Settings,
 * the current page in Zoom blue, above the home indicator (safe area). Hidden from 768px up.
 */
export function BottomTabBar() {
  const selected = useRailSelection();
  const settings = useShellDialog("settings");
  return (
    <nav className={styles.bar} aria-label="Workplace">
      <ul className={styles.tabs}>
        {TAB_BAR_ROUTES.map(({ id, label, href, Icon }) => (
          <li key={id} className={styles.item}>
            <NavTab href={href} label={label} icon={<Icon />} selected={selected === id} classes={TAB_CLASSES} />
          </li>
        ))}
        <li className={styles.item}>
          <NavTab label="Settings" icon={<NavSettingsIcon />} classes={TAB_CLASSES} onClick={settings.show} />
        </li>
      </ul>
    </nav>
  );
}
