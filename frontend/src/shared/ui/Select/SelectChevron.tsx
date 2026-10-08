import clsx from "clsx";
import { SchSelectChevronIcon } from "@/shared/icons/generated/SchSelectChevronIcon";
import styles from "./Select.module.css";

/** 12px select chevron, 12px from the right edge (sm 5 / lg 13); turns 180° (.3s linear) while open. */
export function SelectChevron({ open }: { open: boolean }) {
  return <SchSelectChevronIcon aria-hidden className={clsx(styles.chevron, { [styles.chevronOpen ?? ""]: open })} />;
}
