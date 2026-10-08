"use client";

import { useRef } from "react";
import { MtgMoreIcon } from "@/shared/icons/generated/MtgMoreIcon";
import { useRoomUi } from "../../state/useRoomUi";
import type { ExtraItem, MidItem } from "../../utils/toolbarOverflow";
import { MoreMenu } from "./MoreMenu";
import { ToolbarButton } from "./ToolbarButton";

interface MoreButtonProps {
  /** toolbar buttons that did not fit */
  overflow: MidItem[];
  /** the extra currently promoted to the toolbar */
  promoted: ExtraItem | null;
  /** compact bar: More also offers the Audio / Video device menus */
  compact: boolean;
}

/** More (PRD §8.6.7); receives the buttons that overflowed the toolbar. */
export function MoreButton({ overflow, promoted, compact }: MoreButtonProps) {
  const { menu, toggleMenu, closeMenu } = useRoomUi();
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  return (
    <ToolbarButton label="More" ariaLabel="More meeting control" icon={<MtgMoreIcon />} onClick={() => toggleMenu("more")} wrapperRef={wrapperRef}>
      {menu === "more" ? <MoreMenu anchorRef={wrapperRef} overflow={overflow} promoted={promoted} deviceTiles={compact} onClose={closeMenu} /> : null}
    </ToolbarButton>
  );
}
