import type { ComponentType, ReactNode } from "react";
import clsx from "clsx";
import type { IconProps } from "@/shared/icons/types";
import { HomeCalInfoIcon } from "@/shared/icons/generated/HomeCalInfoIcon";
import { SchBannerSuccessIcon } from "@/shared/icons/generated/SchBannerSuccessIcon";
import { SchCloseIcon } from "@/shared/icons/generated/SchCloseIcon";
import { SchErrorCircleIcon } from "@/shared/icons/generated/SchErrorCircleIcon";
import { SchWarningIcon } from "@/shared/icons/generated/SchWarningIcon";
import { IconButton } from "../IconButton";
import styles from "./Banner.module.css";

export type BannerKind = "info" | "success" | "warning" | "danger";

const ICONS: Record<BannerKind, ComponentType<IconProps>> = {
  info: HomeCalInfoIcon,
  success: SchBannerSuccessIcon,
  warning: SchWarningIcon,
  danger: SchErrorCircleIcon,
};

export interface BannerProps {
  kind?: BannerKind;
  title?: ReactNode;
  children?: ReactNode;
  /** false hides the 20px status icon (profile-menu upgrade banner) */
  icon?: ReactNode | false;
  /** right-side (or bottom, with `actionsBelow`) actions */
  actions?: ReactNode;
  actionsBelow?: boolean;
  /** shows the 24px × at top 13 / right 13 */
  onClose?: () => void;
  /** full-bleed: no radius, bottom border only */
  bleed?: boolean;
  className?: string;
}

/** zoom-ui banner (PRD §5.8.12): info / success / warning / danger with the white transparency layer. */
export function Banner({ kind = "info", title, children, icon, actions, actionsBelow = false, onClose, bleed = false, className }: BannerProps) {
  const Icon = ICONS[kind];
  return (
    <div
      role={kind === "danger" || kind === "warning" ? "alert" : "status"}
      className={clsx(styles.banner, styles[kind], { [styles.closable ?? ""]: onClose, [styles.bleed ?? ""]: bleed }, className)}
    >
      {icon === false ? null : <span className={styles.icon}>{icon ?? <Icon width={20} height={20} />}</span>}
      <div className={styles.body}>
        {title ? <div className={styles.title}>{title}</div> : null}
        {children ? <div className={styles.content}>{children}</div> : null}
        {actions && actionsBelow ? <div className={styles.actionsBelow}>{actions}</div> : null}
      </div>
      {actions && !actionsBelow ? <div className={styles.actions}>{actions}</div> : null}
      {onClose ? (
        <IconButton label="Dismiss banner message" size="sm" icon={<SchCloseIcon />} className={styles.close} onClick={onClose} />
      ) : null}
    </div>
  );
}
