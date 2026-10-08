import { SETTINGS_GLYPHS, type SettingsGlyphName } from "./settingsGlyphs";

/** A filled Settings nav glyph in `currentColor` (14px for General / Audio / Video, 12px otherwise). */
export function SettingsGlyph({ name, size }: { name: SettingsGlyphName; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable="false">
      <path d={SETTINGS_GLYPHS[name]} />
    </svg>
  );
}
