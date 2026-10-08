import styles from "./PreviewCard.module.css";

/**
 * Camera off: Zoom's SvgPreviewDefaultAvatar at 200×200 (`.preview-video__default-avatar svg`),
 * a `rgba(255,255,255,.15)` squircle (175×150) with the person cut out, so the card colour
 * shows through the head (Ø53) and shoulders.
 */
export function AvatarPlaceholder() {
  return (
    <svg className={styles.placeholder} viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.218 3.092C1 3.52 1 4.08 1 5.2v5.6c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874C2.52 14 3.08 14 4.2 14h7.6c1.12 0 1.68 0 2.108-.218a2 2 0 0 0 .874-.874C15 12.48 15 11.92 15 10.8V5.2c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C13.48 2 12.92 2 11.8 2H4.2c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874M8 8.933a2.133 2.133 0 1 0 0-4.266 2.133 2.133 0 0 0 0 4.266M8 10c-2.4 0-4 1.075-4 2.4 0 .212.041.415.116.6h7.768c.075-.185.116-.388.116-.6 0-.509-.236-.98-.662-1.37C10.653 10.409 9.478 10 8 10"
      />
    </svg>
  );
}
