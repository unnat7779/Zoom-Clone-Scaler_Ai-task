"use client";

import clsx from "clsx";
import { HomeCalMoreIcon } from "@/shared/icons/generated/HomeCalMoreIcon";
import { HomeSearchCloseIcon } from "@/shared/icons/generated/HomeSearchCloseIcon";
import touch from "@/shared/styles/touch.module.css";
import { IconButton } from "@/shared/ui/IconButton";
import { useToast } from "@/shared/ui/Toast";
import styles from "./ActivityCenterHeader.module.css";

/** Header row (48 tall [D]): "…" (static) · centred "Activity Center" · ✕ closes the panel. */
export function ActivityCenterHeader({ onClose }: { onClose: () => void }) {
  const toast = useToast();
  return (
    <div className={styles.header}>
      <IconButton label="More options" size="sm" icon={<HomeCalMoreIcon />} className={clsx(styles.icon, touch.target)} onClick={toast.notAvailable} />
      <h2 className={styles.title}>Activity Center</h2>
      <IconButton label="Close Activity Center" size="sm" icon={<HomeSearchCloseIcon />} className={clsx(styles.icon, touch.target)} onClick={onClose} />
    </div>
  );
}
