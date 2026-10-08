"use client";

import { type MouseEvent, type ReactNode, type RefObject, useId, useRef } from "react";
import clsx from "clsx";
import { useEscapeKey } from "@/shared/hooks/useEscapeKey";
import { useFocusTrap } from "@/shared/hooks/useFocusTrap";
import { useLingering } from "@/shared/hooks/useLingering";
import { useScrollLock } from "@/shared/hooks/useScrollLock";
import { SchCloseIcon } from "@/shared/icons/generated/SchCloseIcon";
import { IconButton } from "../IconButton";
import { Portal } from "../Portal";
import { ConfirmHeader } from "./ConfirmHeader";
import styles from "./Modal.module.css";

export type ModalVariant = "zoom" | "join" | "confirm" | "portal" | "bare";

/**
 * Leave animations, kept mounted this long after `open` turns false: zoom-ui `fade-in-linear-out .3s`
 * (dialog + overlay), Element `dialog-fade-out .2s` + `v-modal-out .2s`. The others close at once.
 */
const EXIT_MS: Record<ModalVariant, number> = { zoom: 300, portal: 200, join: 0, confirm: 0, bare: 0 };

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  /**
   * zoom: zoom-dialog (radius 32, fade-in-linear .3s, × button) · join: Join-modal frame (no animation)
   * confirm: PWA confirm (white .75 overlay, 560, radius 8) · portal: zoom.us dialog (700, radius 8)
   * bare: overlay + focus handling only, style the box yourself
   */
  variant?: ModalVariant;
  /** zoom: sm 448 / md 684 / lg 920 · portal: sm 560 */
  size?: "sm" | "md" | "lg";
  title?: ReactNode;
  footer?: ReactNode;
  /** × in the top-right corner (default: only for the zoom variant) */
  showClose?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  initialFocusRef?: RefObject<HTMLElement | null>;
  "aria-label"?: string;
  className?: string;
  overlayClassName?: string;
  children?: ReactNode;
}

/** Modal dialog: portal, overlay, focus trap, layered Escape, scroll lock, leave animation. */
export function Modal({
  open,
  onClose,
  variant = "zoom",
  size = "md",
  title,
  footer,
  showClose = variant === "zoom",
  closeOnOverlayClick = false,
  closeOnEscape = true,
  initialFocusRef,
  className,
  overlayClassName,
  children,
  ...aria
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const titleId = useId();
  const leaving = useLingering(open, EXIT_MS[variant]);
  // Element (zoom.us) dialogs focus their box, not a footer button: Enter right after opening the
  // Delete dialog must not delete, and the Copy Invitation textarea opens without its ring (C4-6/16)
  useFocusTrap(dialogRef, open, { initialFocusRef: initialFocusRef ?? (variant === "portal" ? dialogRef : undefined) });
  useEscapeKey(onClose, open && closeOnEscape);
  // like Element's `lock-scroll`, the page stays locked until the leave animation is over
  useScrollLock(open || leaving);

  if (!open && !leaving) return null;
  const onOverlayMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) onClose();
  };

  return (
    <Portal>
      <div
        className={clsx(styles.overlay, styles[`${variant}Overlay`], { [styles.leaving ?? ""]: leaving }, overlayClassName)}
        onMouseDown={onOverlayMouseDown}
      >
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
          tabIndex={-1}
          className={clsx(styles.dialog, styles[variant], styles[`${variant}-${size}`], className)}
          {...aria}
        >
          {variant === "confirm" ? <ConfirmHeader onClose={onClose} /> : null}
          {title ? (
            <h2 id={titleId} className={styles.title}>
              {title}
            </h2>
          ) : null}
          {showClose ? (
            <IconButton label="Close" icon={<SchCloseIcon />} className={styles.close} onClick={onClose} />
          ) : null}
          {children ? <div className={styles.body}>{children}</div> : null}
          {footer ? <div className={styles.footer}>{footer}</div> : null}
        </div>
      </div>
    </Portal>
  );
}
