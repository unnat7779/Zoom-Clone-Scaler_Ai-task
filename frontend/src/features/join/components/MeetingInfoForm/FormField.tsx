import type { InputHTMLAttributes } from "react";
import clsx from "clsx";
import styles from "./MeetingInfoForm.module.css";

interface FormFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  /** extra class on the <input> (the passcode masks its text) */
  inputClassName?: string;
}

/** `.preview-meeting-info__field-title` + dark 392×40 input + 14px/18px error 4px below. */
export function FormField({ id, label, value, onChange, error, className, inputClassName, ...inputProps }: FormFieldProps) {
  const errorId = `${id}-error`;
  return (
    <div className={clsx(styles.field, className)}>
      <label htmlFor={id} className={styles.fieldTitle}>
        {label}
      </label>
      <input
        id={id}
        className={clsx(styles.input, inputClassName, { [styles.inputError ?? ""]: error })}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...inputProps}
      />
      {error ? (
        <p id={errorId} className={styles.fieldError} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
