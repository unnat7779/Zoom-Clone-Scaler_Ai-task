"use client";

import { useState } from "react";
import clsx from "clsx";
import { SchSubmenuChevronIcon } from "@/shared/icons/generated/SchSubmenuChevronIcon";
import type { SideMenuGroup } from "./menuItems";
import { SideMenuItem } from "./SideMenuItem";
import styles from "./SideMenu.module.css";

/** Collapsible group (My Account / Admin / Support): chevron rotates −90° → 0 in .3s; sub-list indents 24px. */
export function SideMenuGroupItem({ group }: { group: SideMenuGroup }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <li>
      <button type="button" className={styles.item} aria-expanded={expanded} onClick={() => setExpanded((value) => !value)}>
        <span className={styles.leading}>
          <SchSubmenuChevronIcon width={10} height={10} className={clsx(styles.groupChevron, { [styles.groupChevronOpen ?? ""]: expanded })} />
        </span>
        <span className={styles.label}>{group.label}</span>
      </button>
      {expanded ? (
        <ul className={styles.subList}>
          {group.children.map((child) =>
            child.kind === "group" ? (
              <SideMenuGroupItem key={child.label} group={child} />
            ) : (
              <li key={child.label}>
                <SideMenuItem item={child} selected={false} />
              </li>
            ),
          )}
        </ul>
      ) : null}
    </li>
  );
}
