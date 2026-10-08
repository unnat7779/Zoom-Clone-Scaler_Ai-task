import type { KeyboardEventHandler, ReactNode, Ref } from "react";
import clsx from "clsx";
import styles from "./BottomSheet.module.css";

interface BottomSheetProps {
  ref?: Ref<HTMLDivElement>;
  /** "menu" when the sheet itself is the menu (More, row menus); none when it wraps a `Menu` */
  role?: "menu" | "dialog";
  "aria-label"?: string;
  /** content layout (e.g. the More grid) */
  className?: string;
  onKeyDown?: KeyboardEventHandler<HTMLDivElement>;
  children: ReactNode;
}

/**
 * Phone presentation of a room menu [D] (DV10): a dimmed backdrop and a sheet sliding up from the
 * bottom edge, full width, above the home indicator, with 48px rows. The caller keeps its own
 * dismissal (a tap on the backdrop is an outside click, Escape) and keyboard navigation.
 */
export function BottomSheet({ ref, role, className, onKeyDown, children, ...aria }: BottomSheetProps) {
  return (
    <>
      <div className={styles.backdrop} aria-hidden />
      <div ref={ref} role={role} className={clsx(styles.sheet, className)} onKeyDown={onKeyDown} data-room-sheet {...aria}>
        <span className={styles.handle} aria-hidden />
        {children}
      </div>
    </>
  );
}
