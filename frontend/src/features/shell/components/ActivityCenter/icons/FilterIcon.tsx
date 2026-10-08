import type { SVGProps } from "react";

/** Activity Center filter glyph (three bars, shorter downwards) — drawn for the clone [D]. */
export function FilterIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width={16} height={16} viewBox="0 0 16 16" fill="none" aria-hidden focusable="false" {...props}>
      <path d="M2 4.4h12M4.4 8h7.2M6.6 11.6h2.8" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
    </svg>
  );
}
