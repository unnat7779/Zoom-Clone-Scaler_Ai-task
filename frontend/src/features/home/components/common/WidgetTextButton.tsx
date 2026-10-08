import type { ReactNode } from "react";
import clsx from "clsx";
import touch from "@/shared/styles/touch.module.css";
import styles from "./WidgetTextButton.module.css";

/** `.no__events--schedule` text button of the calendar widget (DV2 "Next: …", "Try again"). */
export function WidgetTextButton({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button type="button" className={clsx(styles.button, touch.target)} onClick={onClick}>
      {children}
    </button>
  );
}
