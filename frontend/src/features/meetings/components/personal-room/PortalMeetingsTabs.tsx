"use client";

import { useRef } from "react";
import Link from "next/link";
import clsx from "clsx";
import { HomeMenuChevronRightIcon } from "@/shared/icons/generated/HomeMenuChevronRightIcon";
import { routes } from "@/shared/lib/routes";
import { useToast } from "@/shared/ui/Toast";
import { useTabScroll } from "../../hooks/useTabScroll";
import styles from "./PortalMeetingsTabs.module.css";

/** The six `zm-tabs` of zoom.us/meeting (02-meetings.md §B.4); Upcoming / Previous map to the Meetings tab. */
const TABS: { label: string; href?: string }[] = [
  { label: "Upcoming", href: routes.meetings() },
  { label: "Previous", href: routes.meetings({ tab: "previous" }) },
  { label: "Attachments" },
  { label: "Personal Room" },
  { label: "Meeting Templates" },
  { label: "Meeting Agendas" },
];

const ACTIVE = "Personal Room";

/** 987×52 tab bar with its scroll arrows and the 2px `#DFE3E8` rule; "Personal Room" active (scrolled into view). */
export function PortalMeetingsTabs() {
  const toast = useToast();
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const activeRef = useRef<HTMLDivElement | null>(null);
  const scroll = useTabScroll(scrollerRef, activeRef);
  return (
    <div className={styles.header}>
      <div className={styles.navWrap}>
        <button
          type="button"
          className={clsx(styles.arrow, styles.prev)}
          aria-label="Scroll left"
          aria-disabled={scroll.atStart || undefined}
          onClick={scroll.prev}
        >
          <HomeMenuChevronRightIcon className={styles.flipped} />
        </button>
        <button type="button" className={clsx(styles.arrow, styles.next)} aria-label="Scroll right" aria-disabled={scroll.atEnd || undefined} onClick={scroll.next}>
          <HomeMenuChevronRightIcon />
        </button>
        <div ref={scrollerRef} className={styles.navScroll}>
          <div role="tablist" aria-label="Tabs of meeting" className={styles.nav}>
            {TABS.map(({ label, href }) => {
              const active = label === ACTIVE;
              return (
                <div
                  key={label}
                  ref={active ? activeRef : undefined}
                  role="tab"
                  aria-selected={active}
                  className={clsx(styles.tab, { [styles.active ?? ""]: active })}
                >
                  <h2 className={styles.label}>
                    {href ? (
                      <Link href={href} className={styles.link}>
                        {label}
                      </Link>
                    ) : (
                      <button type="button" className={styles.link} onClick={active ? undefined : toast.notAvailable}>
                        {label}
                      </button>
                    )}
                  </h2>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
