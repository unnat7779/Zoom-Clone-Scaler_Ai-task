"use client";

import { useMoreAction } from "../../hooks/useMoreAction";
import type { ExtraItem } from "../../utils/toolbarOverflow";
import { EXTRA_TILES } from "./moreMenuItems";
import { ToolbarButton } from "./ToolbarButton";
import styles from "./PromotedButton.module.css";

const noop = () => undefined;

/**
 * The More item picked last, as a temporary toolbar button after a 1px divider
 * (`#footer-temporary-icon-divider`, spec 05 §5.3 [M]); it does what its tile does.
 * Show Captions keeps its caret (room-19), which is Static UI.
 */
export function PromotedButton({ item }: { item: ExtraItem }) {
  const perform = useMoreAction();
  const { label, Icon, action } = EXTRA_TILES[item];
  return (
    <>
      <span className={styles.divider} aria-hidden />
      <ToolbarButton
        label={label}
        ariaLabel={label}
        icon={<Icon size={24} />}
        onClick={() => perform(action)}
        className={styles[item]}
        caret={item === "captions" ? { ariaLabel: "More caption controls", open: false, onClick: noop } : undefined}
      />
    </>
  );
}
