/**
 * White brand glyphs for the zoom.us footer's 36px social circles (Zoom draws them from the
 * `social_icons_footer.png` sprite, which is not in our assets). 24-unit paths, drawn at
 * `size` px, filled unless `stroke` is set.
 */
export interface SocialGlyph {
  label: string;
  /** rendered width/height in px (the sprite glyphs are 15–22px tall) */
  size: number;
  paths: { d: string; stroke?: boolean; evenOdd?: boolean }[];
}

export const SOCIAL_GLYPHS: SocialGlyph[] = [
  {
    label: "WordPress",
    size: 20,
    paths: [
      { d: "M12 1.6a10.4 10.4 0 1 1 0 20.8 10.4 10.4 0 0 1 0-20.8z", stroke: true },
      { d: "M4.9 8.1h3.2M7 8.1l3.2 9.6 2.2-6.3M10.7 8.1h3M12.6 8.1l3.4 9.6 2.6-7.4c.5-1.5.2-2.2-.6-2.2", stroke: true },
    ],
  },
  {
    label: "LinkedIn",
    size: 19,
    paths: [
      {
        d: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452z",
      },
    ],
  },
  {
    label: "X",
    size: 15,
    paths: [
      {
        d: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932zM17.61 20.644h2.039L6.486 3.24H4.298z",
      },
    ],
  },
  {
    label: "YouTube",
    size: 18,
    paths: [
      {
        evenOdd: true,
        d: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
      },
    ],
  },
  {
    label: "Facebook",
    size: 20,
    paths: [
      {
        d: "M15.12 5.32H17V2.14A26.11 26.11 0 0 0 14.26 2c-2.72 0-4.58 1.66-4.58 4.7v2.62H6.61v3.56h3.07V22h3.68v-9.12h3.06l.46-3.56h-3.52V7.05c0-1.03.28-1.73 1.76-1.73z",
      },
    ],
  },
  {
    label: "Instagram",
    size: 20,
    paths: [
      { d: "M7.5 2.5h9a5 5 0 0 1 5 5v9a5 5 0 0 1-5 5h-9a5 5 0 0 1-5-5v-9a5 5 0 0 1 5-5z", stroke: true },
      { d: "M12 7.6a4.4 4.4 0 1 1 0 8.8 4.4 4.4 0 0 1 0-8.8z", stroke: true },
      { d: "M17.5 5.2a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6z" },
    ],
  },
];
