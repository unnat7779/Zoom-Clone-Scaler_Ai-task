"use client";

import { type ReactNode, createContext, useContext, useId, useMemo } from "react";
import clsx from "clsx";
import styles from "./Radio.module.css";

interface RadioGroupContextValue {
  name: string;
  value: string | null;
  disabled: boolean;
  onChange: (value: string) => void;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export const useRadioGroup = () => useContext(RadioGroupContext);

export interface RadioGroupProps<V extends string> {
  value: V | null;
  onChange: (value: V) => void;
  /** horizontal: 32px between radios (Meeting ID row) · vertical: 8px below each */
  direction?: "horizontal" | "vertical";
  name?: string;
  disabled?: boolean;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  className?: string;
  children: ReactNode;
}

/** Groups `Radio` children: shared name, value and disabled state. */
export function RadioGroup<V extends string>({
  value,
  onChange,
  direction = "horizontal",
  name,
  disabled = false,
  className,
  children,
  ...aria
}: RadioGroupProps<V>) {
  const fallbackName = useId();
  const context = useMemo(
    () => ({ name: name ?? fallbackName, value, disabled, onChange: onChange as (value: string) => void }),
    [disabled, fallbackName, name, onChange, value],
  );
  return (
    <RadioGroupContext.Provider value={context}>
      <div role="radiogroup" className={clsx(styles.group, styles[direction], className)} {...aria}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}
