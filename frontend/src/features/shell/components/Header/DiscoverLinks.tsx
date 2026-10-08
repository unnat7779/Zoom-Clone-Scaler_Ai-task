"use client";

import { ChevronDownIcon } from "@/shared/icons/generated/ChevronDownIcon";
import { useToast } from "@/shared/ui/Toast";
import styles from "./HeaderItems.module.css";

/** ≥1440px leading slot: "Discover Products ▾" and "Pricing" (static, PRD §11.1). */
export function DiscoverLinks() {
  const toast = useToast();
  return (
    <div className={styles.discover}>
      <button type="button" className={styles.item} onClick={toast.notAvailable}>
        Discover Products
        <ChevronDownIcon width={12} height={12} />
      </button>
      <button type="button" className={styles.item} onClick={toast.notAvailable}>
        Pricing
      </button>
    </div>
  );
}
