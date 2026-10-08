"use client";

import { type ComponentPropsWithRef, useRef } from "react";
import clsx from "clsx";
import { useMergedRef } from "@/shared/lib/mergeRefs";
import { type AutosizeRows, useAutosize } from "./useAutosize";
import styles from "./TextArea.module.css";

export interface TextAreaProps extends ComponentPropsWithRef<"textarea"> {
  /** sm 48 / md 60 / lg 72 tall (fixed-height mode) */
  size?: "sm" | "md" | "lg";
  error?: boolean;
  /** grow with the content between minRows and maxRows (padding becomes 6px 12px) */
  autoResize?: AutosizeRows;
}

/** zoom-ui textarea (PRD §5.8.4): same states as Input, `resize: vertical`, thin scrollbar. */
export function TextArea({ size = "md", error = false, autoResize, className, ref, value, ...rest }: TextAreaProps) {
  const innerRef = useRef<HTMLTextAreaElement | null>(null);
  const mergedRef = useMergedRef(innerRef, ref);
  useAutosize(innerRef, value, autoResize);
  return (
    <textarea
      ref={mergedRef}
      value={value}
      aria-invalid={error || undefined}
      className={clsx(
        styles.textarea,
        styles[size],
        { [styles.error ?? ""]: error, [styles.autoResize ?? ""]: autoResize },
        className,
      )}
      {...rest}
    />
  );
}
