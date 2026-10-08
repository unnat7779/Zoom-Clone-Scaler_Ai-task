"use client";

import type { ReactNode, Ref } from "react";
import clsx from "clsx";
import { CaretUpIcon } from "@/shared/icons/generated/CaretUpIcon";
import styles from "./ToolbarButton.module.css";

export interface ToolbarCaret {
  ariaLabel: string;
  open: boolean;
  onClick: () => void;
}

interface ToolbarButtonProps {
  label: string;
  ariaLabel: string;
  icon: ReactNode;
  onClick: () => void;
  caret?: ToolbarCaret;
  /** the caret button (outside-click anchor of its menu) */
  caretRef?: Ref<HTMLButtonElement>;
  /** min-width 90 (Audio, Video) instead of 86 */
  wide?: boolean;
  /** extra class on the button (e.g. a promoted button's measured min-width) */
  className?: string;
  pressed?: boolean;
  /** Zoom's `--disabled` state: opacity .5, `aria-disabled`, clicks ignored by the caller */
  disabled?: boolean;
  wrapperRef?: Ref<HTMLDivElement>;
  /** menus / tooltips anchored to the button (absolutely positioned in the wrapper) */
  children?: ReactNode;
}

/** One toolbar control: icon over label, optional ^ caret at its top-right (PRD §8.5.2). */
export function ToolbarButton({ label, ariaLabel, icon, onClick, caret, caretRef, wide, className, pressed, disabled, wrapperRef, children }: ToolbarButtonProps) {
  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <button
        type="button"
        className={clsx(styles.button, wide && styles.wide, disabled && styles.disabled, className)}
        aria-label={ariaLabel}
        aria-pressed={pressed}
        aria-disabled={disabled || undefined}
        onClick={onClick}
      >
        <span className={styles.iconLayer}>{icon}</span>
        <span className={styles.label}>{label}</span>
      </button>
      {caret ? (
        <button
          ref={caretRef}
          type="button"
          className={styles.caret}
          aria-label={caret.ariaLabel}
          aria-haspopup="menu"
          aria-expanded={caret.open}
          onClick={caret.onClick}
        >
          <CaretUpIcon />
        </button>
      ) : null}
      {children}
    </div>
  );
}
