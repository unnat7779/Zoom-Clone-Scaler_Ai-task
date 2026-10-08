"use client";

import { type ComponentType, useEffect } from "react";
import clsx from "clsx";
import type { IconProps } from "@/shared/icons/types";
import touch from "@/shared/styles/touch.module.css";
import { HomeCalInfoIcon } from "@/shared/icons/generated/HomeCalInfoIcon";
import { SchBannerSuccessIcon } from "@/shared/icons/generated/SchBannerSuccessIcon";
import { SchCloseIcon } from "@/shared/icons/generated/SchCloseIcon";
import { SchErrorCircleIcon } from "@/shared/icons/generated/SchErrorCircleIcon";
import { SchWarningIcon } from "@/shared/icons/generated/SchWarningIcon";
import type { ToastKind, ToastRecord } from "./toastTypes";
import styles from "./Toast.module.css";

const ICONS: Record<ToastKind, ComponentType<IconProps>> = {
  success: SchBannerSuccessIcon,
  info: HomeCalInfoIcon,
  warning: SchWarningIcon,
  error: SchErrorCircleIcon,
};

/** One toast; dismisses itself after `duration` ms. */
export function ToastItem({ toast, onDismiss }: { toast: ToastRecord; onDismiss: (id: number) => void }) {
  const { id, duration, kind, surface, title, message } = toast;

  useEffect(() => {
    if (duration === null) return;
    const timer = setTimeout(() => onDismiss(id), duration);
    return () => clearTimeout(timer);
  }, [duration, id, onDismiss]);

  const Icon = ICONS[kind];
  return (
    <div role={kind === "error" ? "alert" : "status"} className={clsx(styles.toast, styles[surface], styles[kind])}>
      <span className={styles.icon}>
        <Icon width={surface === "portal" ? 20 : 24} height={surface === "portal" ? 20 : 24} />
      </span>
      <div className={styles.text}>
        {title ? <div className={styles.title}>{title}</div> : null}
        <div className={styles.message}>{message}</div>
      </div>
      {surface === "workplace" ? (
        <button type="button" aria-label="Close" className={clsx(styles.close, touch.target)} onClick={() => onDismiss(id)}>
          <SchCloseIcon width={14} height={14} />
        </button>
      ) : null}
    </div>
  );
}
