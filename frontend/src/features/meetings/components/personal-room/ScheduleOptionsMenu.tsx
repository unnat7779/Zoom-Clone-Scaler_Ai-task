"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { MtgPortalSchedGoogleIcon } from "@/shared/icons/generated/MtgPortalSchedGoogleIcon";
import { MtgPortalSchedMicrosoftIcon } from "@/shared/icons/generated/MtgPortalSchedMicrosoftIcon";
import { MtgPortalSchedZoomIcon } from "@/shared/icons/generated/MtgPortalSchedZoomIcon";
import { SchCalendarIcon } from "@/shared/icons/generated/SchCalendarIcon";
import { SchExternalLinkIcon } from "@/shared/icons/generated/SchExternalLinkIcon";
import type { IconProps } from "@/shared/icons/types";
import { routes } from "@/shared/lib/routes";
import { useToast } from "@/shared/ui/Toast";
import styles from "./ScheduleOptionsMenu.module.css";

/** Items 2–4 open calendar add-ins on other sites in Zoom: static here (demo toast). */
const CALENDAR_APPS: { label: string; Icon: ComponentType<IconProps> }[] = [
  { label: "Schedule from Zoom", Icon: MtgPortalSchedZoomIcon },
  { label: "Schedule from Google", Icon: MtgPortalSchedGoogleIcon },
  { label: "Schedule from Microsoft", Icon: MtgPortalSchedMicrosoftIcon },
];

/**
 * `ul.zm-dropdown-menu` of the "+ Schedule a Meeting" caret (02-meetings.md §B.2, `mtg-20`): "Schedule a
 * Meeting" (same as the main button) above a rule, then the three calendar apps with ↗.
 */
export function ScheduleOptionsMenu({ onClose }: { onClose: () => void }) {
  const toast = useToast();
  return (
    <ul className={styles.menu} role="menu" aria-label="Schedule a meeting">
      <li role="none" className={styles.first}>
        <Link href={routes.schedule()} role="menuitem" className={styles.item} onClick={onClose}>
          <SchCalendarIcon className={styles.icon} />
          <span className={styles.label}>Schedule a Meeting</span>
        </Link>
      </li>
      {CALENDAR_APPS.map(({ label, Icon }) => (
        <li key={label} role="none">
          <button
            type="button"
            role="menuitem"
            className={styles.item}
            onClick={() => {
              onClose();
              toast.notAvailable();
            }}
          >
            <Icon className={styles.icon} size={16} />
            <span className={styles.label}>{label}</span>
            <SchExternalLinkIcon className={styles.external} />
          </button>
        </li>
      ))}
    </ul>
  );
}
