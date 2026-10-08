"use client";

import { SchUpgradeStarIcon } from "@/shared/icons/generated/SchUpgradeStarIcon";
import { useToast } from "@/shared/ui/Toast";
import styles from "./SideMenu.module.css";

/** "Upgrade to Pro" pill under the side menu (static). */
export function UpgradePill() {
  const toast = useToast();
  return (
    <div className={styles.footer}>
      <button type="button" className={styles.upgradePill} onClick={toast.notAvailable}>
        <SchUpgradeStarIcon width={14} height={14} />
        Upgrade to Pro
      </button>
    </div>
  );
}
