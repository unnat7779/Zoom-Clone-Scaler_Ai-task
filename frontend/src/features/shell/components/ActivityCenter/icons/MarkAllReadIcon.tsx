import type { SVGProps } from "react";

/** Activity Center "mark all as read" glyph (double check mark) — drawn for the clone [D]. */
export function MarkAllReadIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width={16} height={16} viewBox="0 0 16 16" fill="none" aria-hidden focusable="false" {...props}>
      <path
        d="M1.5 8.6l2.9 2.9L10 5.6M7.6 11.1l.4.4L14.5 5"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
