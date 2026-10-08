/** Zoom's `SvgLeave` (16×16, currentColor): the door with an arrow of the waiting room's Exit. */
export function ExitIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M10.5 2.5A2.5 2.5 0 0 0 8 0H2.5A2.5 2.5 0 0 0 0 2.5v11A2.5 2.5 0 0 0 2.5 16H8a2.5 2.5 0 0 0 2.5-2.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 1 8 15H2.5A1.5 1.5 0 0 1 1 13.5v-11A1.5 1.5 0 0 1 2.5 1H8a1.5 1.5 0 0 1 1.5 1.5v2a.5.5 0 0 0 1 0z" />
      <path d="M12.146 4.647a.5.5 0 0 1 .707 0l3 3a.5.5 0 0 1 0 .707l-3 3a.5.5 0 0 1-.707-.707L14.293 8.5H5a.5.5 0 0 1 0-1h9.293l-2.147-2.146a.5.5 0 0 1 0-.707" />
    </svg>
  );
}
