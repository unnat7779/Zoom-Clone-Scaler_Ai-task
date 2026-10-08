"use client";

import { useState } from "react";
import clsx from "clsx";
import { SchCheckmarkIcon } from "@/shared/icons/generated/SchCheckmarkIcon";
import { SchXSmallIcon } from "@/shared/icons/generated/SchXSmallIcon";
import { HoverPopover } from "@/shared/ui/HoverPopover";
import { Input } from "@/shared/ui/Input";
import controls from "./controls.module.css";
import styles from "./PasscodeInput.module.css";

interface PasscodeInputProps {
  value: string;
  onChange: (value: string) => void;
  invalid: boolean;
}

/** 200×32 passcode (max 10, any characters) with the "Passcode must include:" rules popover on hover / focus. */
export function PasscodeInput({ value, onChange, invalid }: PasscodeInputProps) {
  const [focused, setFocused] = useState(false);
  const Icon = invalid ? SchXSmallIcon : SchCheckmarkIcon;
  const rules = (
    <div className={styles.rules}>
      <div className={styles.title}>Passcode must include:</div>
      <div className={clsx(styles.rule, invalid ? styles.failed : styles.passed)}>
        <Icon className={styles.ruleIcon} />
        <span className={styles.ruleText}>At least 1 characters</span>
      </div>
    </div>
  );

  return (
    <HoverPopover content={rules} variant="info" placement="bottom" offset={10} forceOpen={focused} className={styles.popover}>
      <span className={controls.passcode}>
        <Input
          value={value}
          aria-label="Passcode"
          maxLength={10}
          autoComplete="off"
          error={invalid}
          onChange={(event) => onChange(event.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </span>
    </HoverPopover>
  );
}
