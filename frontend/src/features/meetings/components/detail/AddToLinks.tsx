"use client";

import clsx from "clsx";
import { MtgPortalAddGoogleIcon } from "@/shared/icons/generated/MtgPortalAddGoogleIcon";
import { MtgPortalAddOutlookIcon } from "@/shared/icons/generated/MtgPortalAddOutlookIcon";
import { MtgPortalAddYahooIcon } from "@/shared/icons/generated/MtgPortalAddYahooIcon";
import { useToast } from "@/shared/ui/Toast";
import styles from "./AddToLinks.module.css";

const CALENDARS = [
  { label: "Google Calendar", Icon: MtgPortalAddGoogleIcon, className: styles.google },
  { label: "Outlook Calendar (.ics)", Icon: MtgPortalAddOutlookIcon, className: styles.outlook },
  { label: "Yahoo Calendar", Icon: MtgPortalAddYahooIcon, className: styles.yahoo },
];

/** "Add to" Google / Outlook (.ics) / Yahoo with Zoom's 20px brand sprites — static (PRD §2.2). */
export function AddToLinks() {
  const toast = useToast();
  return (
    <p className={styles.addTo}>
      {CALENDARS.map(({ label, Icon, className }) => (
        <button key={label} type="button" className={clsx(styles.link, className)} onClick={toast.notAvailable}>
          <Icon className={styles.icon} />
          {label}
        </button>
      ))}
    </p>
  );
}
