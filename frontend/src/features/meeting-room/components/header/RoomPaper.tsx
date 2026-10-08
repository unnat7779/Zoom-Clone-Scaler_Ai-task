import type { HTMLAttributes, Ref } from "react";
import clsx from "clsx";
import styles from "./RoomPaper.module.css";

interface RoomPaperProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

/** Dark popover surface under the room header (400 wide, 53px from the top). */
export function RoomPaper({ className, ref, ...rest }: RoomPaperProps) {
  return <div ref={ref} role="dialog" className={clsx(styles.paper, className)} {...rest} />;
}
