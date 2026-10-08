"use client";

import { type ReactNode, useId, useRef } from "react";
import clsx from "clsx";
import { useEscapeKey, useFocusTrap } from "@/shared/hooks";
import styles from "./DarkDialog.module.css";

export interface DialogAction {
  label: string;
  onClick: () => void;
  kind?: "secondary" | "primary" | "danger";
}

interface DarkDialogProps {
  title: string;
  children?: ReactNode;
  actions: DialogAction[];
  /** Escape */
  onDismiss: () => void;
  /** Zoom's "big-dialog": 580 wide instead of 480 (spec 05 §13.1) */
  big?: boolean;
  /** focus the dialog box itself on open instead of its first control (a field would show its focus ring) */
  focusDialog?: boolean;
}

/** Modal confirm dialog scoped to the room (dims only the room, like Zoom's in-iframe modals). */
export function DarkDialog({ title, children, actions, onDismiss, big = false, focusDialog = false }: DarkDialogProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const titleId = useId();
  useFocusTrap(ref, true, { initialFocusRef: focusDialog ? ref : undefined });
  useEscapeKey(onDismiss, true);
  return (
    <div className={styles.overlay}>
      <div ref={ref} className={clsx(styles.dialog, big && styles.big)} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1}>
        <h2 id={titleId} className={styles.title}>
          {title}
        </h2>
        {children ? <div className={styles.body}>{children}</div> : null}
        <div className={styles.footer}>
          {actions.map(({ label, onClick, kind = "secondary" }) => (
            <button key={label} type="button" className={clsx(styles.button, kind !== "secondary" && styles[kind])} onClick={onClick}>
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
