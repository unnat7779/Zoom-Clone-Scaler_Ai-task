/**
 * 16px white glyphs of the Settings tab chips that have no exported Zoom SVG
 * (Audio headphones, Background portrait, Statistics bars) — drawn from room-16.
 */
const PATHS = {
  audio:
    "M8 2.5a5.5 5.5 0 0 0-5.5 5.5v3.25A1.75 1.75 0 0 0 4.25 13H5a.75.75 0 0 0 .75-.75v-3A.75.75 0 0 0 5 8.5H4a4 4 0 0 1 8 0h-1a.75.75 0 0 0-.75.75v3c0 .41.34.75.75.75h.75a1.75 1.75 0 0 0 1.75-1.75V8A5.5 5.5 0 0 0 8 2.5Z",
  background:
    "M3.5 2h9A1.5 1.5 0 0 1 14 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 12.5v-9A1.5 1.5 0 0 1 3.5 2ZM8 4.25a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-3.5 8.25h7c0-1.66-1.57-3-3.5-3s-3.5 1.34-3.5 3Z",
  statistics: "M3 7h2.5v6H3V7Zm3.75-4h2.5v10h-2.5V3Zm3.75 6H13v4h-2.5V9Z",
} as const;

export type SettingsGlyphName = keyof typeof PATHS;

export function SettingsGlyph({ name }: { name: SettingsGlyphName }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden focusable="false">
      <path d={PATHS[name]} fill="currentColor" fillRule="evenodd" />
    </svg>
  );
}
