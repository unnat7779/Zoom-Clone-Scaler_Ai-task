"use client";

import clsx from "clsx";
import styles from "./PhoneGallery.module.css";

interface GalleryPagerProps {
  pager: { page: number; pages: number; canPrevious: boolean; canNext: boolean; previous: () => void; next: () => void };
  /** the gallery area (between header and toolbar) the controls are placed in */
  areaTop: number;
  areaHeight: number;
}

/** 44×44 ‹ › buttons at the area's sides, just below its middle (only where there is a page to go to), and page dots. */
export function GalleryPager({ pager, areaTop, areaHeight }: GalleryPagerProps) {
  const middle = areaTop + areaHeight / 2;
  return (
    <>
      {pager.canPrevious ? (
        <button type="button" className={clsx(styles.arrow, styles.previous)} style={{ top: middle }} aria-label="Previous page" onClick={pager.previous}>
          <span className={styles.chevron} />
        </button>
      ) : null}
      {pager.canNext ? (
        <button type="button" className={clsx(styles.arrow, styles.next)} style={{ top: middle }} aria-label="Next page" onClick={pager.next}>
          <span className={styles.chevron} />
        </button>
      ) : null}
      <div className={styles.dots} style={{ top: areaTop + areaHeight }} role="status" aria-label={`Page ${pager.page + 1} of ${pager.pages}`}>
        {Array.from({ length: pager.pages }, (_, index) => (
          <span key={index} className={clsx(styles.dot, index === pager.page && styles.current)} />
        ))}
      </div>
    </>
  );
}
