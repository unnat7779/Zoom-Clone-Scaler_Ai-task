"use client";

import type { ReactNode } from "react";
import { MEDIA, useMediaQuery } from "@/shared/hooks";
import { CaretUpIcon } from "@/shared/icons/generated/CaretUpIcon";
import { usePreviewMenu } from "../../hooks/usePreviewMenu";
import { type DeviceMenuSection, DeviceMenu } from "./DeviceMenu";
import styles from "./PreviewControls.module.css";

interface ControlButtonProps {
  /** visible label, also the button's aria-label ("Mute", "Start Video"…) */
  label: string;
  icon: ReactNode;
  onToggle: () => void;
  /** "More audio controls" / "More video controls" */
  caretLabel: string;
  /** Zoom shows the caret only while the device is live (muted / unmuted, video on / off) */
  showCaret: boolean;
  menuSections: DeviceMenuSection[];
}

/**
 * `.preview-video__control-button-container`: the 88×52 button, its caret (`.preview__toggle`) and
 * device menu (a bottom sheet on phones [D]).
 */
export function ControlButton({ label, icon, onToggle, caretLabel, showCaret, menuSections }: ControlButtonProps) {
  const phone = useMediaQuery(MEDIA.handheld);
  const { open, toggle, close, toggleRef, menuRef, onMenuKeyDown } = usePreviewMenu(phone);
  return (
    <div className={styles.control}>
      <button type="button" className={styles.button} aria-label={label} onClick={onToggle}>
        <span className={styles.icon}>{icon}</span>
        <span className={styles.label} aria-hidden>
          {label}
        </span>
      </button>
      {showCaret ? (
        <>
          <button
            ref={toggleRef}
            type="button"
            className={styles.caret}
            aria-label={caretLabel}
            aria-haspopup="menu"
            aria-expanded={open}
            onClick={toggle}
          >
            <CaretUpIcon size={16} />
          </button>
          {open ? <DeviceMenu menuRef={menuRef} label={caretLabel} sections={menuSections} onClose={close} onTab={onMenuKeyDown} sheet={phone} /> : null}
        </>
      ) : null}
    </div>
  );
}
