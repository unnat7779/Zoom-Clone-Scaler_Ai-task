import type { ReactNode } from "react";
import { StaticButton } from "@/shared/ui/StaticButton";
import { FOOTER_COLUMNS, FOOTER_LEGAL_LINKS, FOOTER_SELECTS, PRIVACY_CHOICES_LINK } from "./footerLinks";
import { PrivacyChoicesIcon } from "./PrivacyChoicesIcon";
import { SocialGlyphIcon } from "./SocialGlyphIcon";
import { SOCIAL_GLYPHS } from "./socialGlyphs";
import styles from "./PortalFooter.module.css";

/**
 * zoom.us `#footer_container` (03-schedule.md §3.5, 04-join.md §5): 500px `#39394D`, five link
 * columns, language / currency toggles, social icons and the copyright row. Static UI only.
 */
export function PortalFooter() {
  const link = (label: string, icon?: ReactNode) => (
    <StaticButton className={styles.link}>
      {icon}
      {label}
    </StaticButton>
  );

  return (
    <footer className={styles.footer}>
      <div className={styles.columns}>
        {FOOTER_COLUMNS.map((column) => (
          <div key={column.title} className={styles.column}>
            <h3 className={styles.heading}>{column.title}</h3>
            <ul className={styles.list}>
              {column.links.map((label) => (
                <li key={label}>{link(label)}</li>
              ))}
            </ul>
          </div>
        ))}
        <div className={styles.column}>
          {FOOTER_SELECTS.map((select) => (
            <div key={select.title} className={styles.selectGroup}>
              <h3 className={styles.heading}>{select.title}</h3>
              <StaticButton className={styles.select}>
                {select.value} <span className={styles.caret} aria-hidden />
              </StaticButton>
            </div>
          ))}
          <div className={styles.social}>
            {SOCIAL_GLYPHS.map((glyph) => (
              <StaticButton key={glyph.label} className={styles.socialIcon} aria-label={glyph.label}>
                <SocialGlyphIcon glyph={glyph} />
              </StaticButton>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.info}>
        <span className={styles.copyright}>Copyright ©{new Date().getFullYear()} Zoom Communications, Inc. All rights reserved.</span>
        {FOOTER_LEGAL_LINKS.map((label) => (
          <span key={label} className={styles.legal}>
            {link(label, label === PRIVACY_CHOICES_LINK ? <PrivacyChoicesIcon /> : undefined)}
          </span>
        ))}
      </div>
    </footer>
  );
}
