"use client";

import { useRef } from "react";
import { MtgReactIcon } from "@/shared/icons/generated/MtgReactIcon";
import { useRoomUi } from "../../state/useRoomUi";
import { ReactPicker } from "./ReactPicker";
import { ToolbarButton } from "./ToolbarButton";

/** Opens the (static) reaction picker above the button. */
export function ReactButton() {
  const { menu, toggleMenu, closeMenu } = useRoomUi();
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  return (
    <ToolbarButton label="React" ariaLabel="React" icon={<MtgReactIcon size={26} />} onClick={() => toggleMenu("react")} wrapperRef={wrapperRef}>
      {menu === "react" ? <ReactPicker anchorRef={wrapperRef} onClose={closeMenu} /> : null}
    </ToolbarButton>
  );
}
