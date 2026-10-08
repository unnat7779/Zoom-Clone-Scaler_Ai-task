"use client";

import type { ReactNode } from "react";
import clsx from "clsx";
import { SchInfoIcon } from "@/shared/icons/generated/SchInfoIcon";
import { HoverPopover } from "@/shared/ui/HoverPopover";
import styles from "./InfoButton.module.css";

interface InfoButtonProps {
  /** accessible name, e.g. "Learn more about Whiteboard" */
  label: string;
  content: ReactNode;
  /**
   * label: 16×16 `#8E9194` after a row label (Whiteboard) · suffix: 20×20 `#686F79` after a radio /
   * checkbox label · description: 24×24 tertiary icon button after an option description (Zoom AI summary)
   */
  kind?: "label" | "suffix" | "description";
}

/** ⓘ button with Zoom's info popover on hover or keyboard focus (PRD §5.8.9). */
export function InfoButton({ label, content, kind = "label" }: InfoButtonProps) {
  return (
    <HoverPopover content={content} variant="info" placement="top" offset={10} toggleOnTap className={styles.popover}>
      <button
        type="button"
        aria-label={label}
        className={clsx(styles.button, {
          [styles.suffix ?? ""]: kind === "suffix",
          [styles.description ?? ""]: kind === "description",
        })}
      >
        <SchInfoIcon />
      </button>
    </HoverPopover>
  );
}
