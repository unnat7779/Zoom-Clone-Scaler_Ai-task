import { useId } from "react";

/**
 * `action-schedule.svg` (36×39 calendar with two binder rings) with the **current day of month**
 * cut out of it instead of Zoom's captured "19" (PRD §7.1.3). The number is a mask hole, so the
 * button colour shows through it in every state, like Zoom's evenodd glyphs.
 */
export function ScheduleDayIcon({ day }: { day: number | null }) {
  const maskId = `schedule-day-${useId().replace(/[^\w-]/g, "")}`;
  return (
    <svg width="28" height="28" viewBox="0 0 36 39" fill="none" aria-hidden focusable="false">
      <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="36" height="39">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          fill="white"
          d="M0.654 6.2761C0 7.5595 0 9.2397 0 12.6V29.4C0 32.7603 0 34.4405 0.654 35.7239C1.2292 36.8529 2.1471 37.7708 3.2761 38.346C4.5595 39 6.2397 39 9.6 39H26.4C29.7603 39 31.4405 39 32.7239 38.346C33.8529 37.7708 34.7708 36.8529 35.346 35.7239C36 34.4405 36 32.7603 36 29.4V12.6C36 9.2397 36 7.5595 35.346 6.2761C34.7708 5.1471 33.8529 4.2292 32.7239 3.65396C31.4405 3 29.7603 3 26.4 3H9.6C6.2397 3 4.5595 3 3.2761 3.65396C2.1471 4.2292 1.2292 5.1471 0.654 6.2761ZM10 12C11.6569 12 13 10.6569 13 9C13 7.3431 11.6569 6 10 6C8.3431 6 7 7.3431 7 9C7 10.6569 8.3431 12 10 12ZM29 9C29 10.6569 27.6569 12 26 12C24.3431 12 23 10.6569 23 9C23 7.3431 24.3431 6 26 6C27.6569 6 29 7.3431 29 9Z"
        />
        {day === null ? null : (
          <text x="18" y="31" fill="black" textAnchor="middle" fontSize="18" fontWeight="600" fontFamily="var(--font-app)">
            {day}
          </text>
        )}
      </mask>
      <rect width="36" height="39" fill="currentColor" mask={`url(#${maskId})`} />
      <path d="M11 1C11 0.4477 10.5523 0 10 0C9.4477 0 9 0.4477 9 1V9C9 9.5523 9.4477 10 10 10C10.5523 10 11 9.5523 11 9V1Z" fill="currentColor" />
      <path d="M27 1C27 0.4477 26.5523 0 26 0C25.4477 0 25 0.4477 25 1V9C25 9.5523 25.4477 10 26 10C26.5523 10 27 9.5523 27 9V1Z" fill="currentColor" />
    </svg>
  );
}
