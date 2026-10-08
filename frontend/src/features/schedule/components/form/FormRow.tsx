import type { ReactNode } from "react";
import clsx from "clsx";
import styles from "./FormRow.module.css";

interface FormRowProps {
  label?: ReactNode;
  /** red `*` before the label (Topic) */
  required?: boolean;
  /** ⓘ button after the label (Whiteboard) */
  labelSuffix?: ReactNode;
  /** id of the label text, for `aria-labelledby` on the controls */
  labelId?: string;
  className?: string;
  children: ReactNode;
}

/** `.zoom-form-item__row`: 160px label column + 10px gap + controls; 25px below every row (PRD §7.6.2). */
export function FormRow({ label, required = false, labelSuffix, labelId, className, children }: FormRowProps) {
  return (
    <div className={clsx(styles.row, className)}>
      <div className={styles.labelWrapper}>
        {label ? (
          <span id={labelId} className={clsx(styles.label, { [styles.requiredLabel ?? ""]: required })}>
            {required ? <span className={styles.asterisk}>*</span> : null}
            {required ? " " : null}
            {label}
          </span>
        ) : null}
        {labelSuffix ? <span className={styles.labelSuffix}>{labelSuffix}</span> : null}
      </div>
      <div className={styles.widgets}>{children}</div>
    </div>
  );
}
