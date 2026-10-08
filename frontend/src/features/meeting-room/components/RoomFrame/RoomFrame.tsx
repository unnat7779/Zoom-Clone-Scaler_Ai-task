import type { ReactNode, Ref } from "react";
import clsx from "clsx";
import { Spinner } from "@/shared/ui";
import styles from "./RoomFrame.module.css";

interface RoomFrameProps {
  inShell: boolean;
  ref?: Ref<HTMLDivElement>;
  /** nothing → a centred spinner (starting / loading the room) */
  children?: ReactNode;
}

/** Dark room container: the Workplace content card in-shell, the whole viewport otherwise. */
export function RoomFrame({ inShell, ref, children }: RoomFrameProps) {
  return (
    <div ref={ref} className={clsx(styles.frame, !inShell && styles.fullViewport)} data-room-frame>
      {children ?? (
        <div className={styles.loading}>
          <Spinner size={32} tone="light" label="Loading meeting" />
        </div>
      )}
    </div>
  );
}
