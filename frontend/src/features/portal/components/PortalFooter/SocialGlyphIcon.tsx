import type { SocialGlyph } from "./socialGlyphs";
import styles from "./PortalFooter.module.css";

/** One white brand glyph (see `socialGlyphs.ts`). */
export function SocialGlyphIcon({ glyph }: { glyph: SocialGlyph }) {
  return (
    <svg className={styles.socialGlyph} width={glyph.size} height={glyph.size} viewBox="0 0 24 24" aria-hidden>
      {glyph.paths.map((path) => (
        <path
          key={path.d}
          d={path.d}
          className={path.stroke ? styles.glyphStroke : styles.glyphFill}
          fillRule={path.evenOdd ? "evenodd" : undefined}
        />
      ))}
    </svg>
  );
}
