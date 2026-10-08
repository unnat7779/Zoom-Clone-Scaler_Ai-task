"use client";

import Link from "next/link";
import clsx from "clsx";
import { SchExternalLinkIcon } from "@/shared/icons/generated/SchExternalLinkIcon";
import { Badge } from "@/shared/ui/Badge";
import { useToast } from "@/shared/ui/Toast";
import type { SideMenuLink } from "./menuItems";
import styles from "./SideMenu.module.css";

interface SideMenuItemProps {
  item: SideMenuLink;
  selected: boolean;
}

/** One side-menu row: 32px min, padding 3px 8px, radius 12; selected = #F2F8FF / #0D6BDE. */
export function SideMenuItem({ item, selected }: SideMenuItemProps) {
  const toast = useToast();
  const content = (
    <>
      <span className={styles.leading} />
      <span className={styles.label}>{item.label}</span>
      {item.isNew ? (
        <Badge className={styles.newBadge}>
          New
        </Badge>
      ) : null}
      {item.external ? <SchExternalLinkIcon width={14} height={14} className={styles.externalIcon} /> : null}
    </>
  );
  const className = clsx(styles.item, { [styles.itemSelected ?? ""]: selected, [styles.spaced ?? ""]: item.spaced });

  if (item.href) {
    return (
      <Link href={item.href} className={className} aria-current={selected ? "page" : undefined}>
        {content}
      </Link>
    );
  }
  return (
    <button type="button" className={className} onClick={toast.notAvailable}>
      {content}
    </button>
  );
}
