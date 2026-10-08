"use client";

import type { RefObject } from "react";
import clsx from "clsx";
import { HeaderSearchIcon } from "@/shared/icons/generated/HeaderSearchIcon";
import { HomeSearchCloseIcon } from "@/shared/icons/generated/HomeSearchCloseIcon";
import touch from "@/shared/styles/touch.module.css";
import { IconButton } from "@/shared/ui/IconButton";
import { SearchTextButton } from "./SearchTextButton";
import styles from "./SearchInputRow.module.css";

interface SearchInputRowProps {
  inputRef: RefObject<HTMLInputElement | null>;
  query: string;
  showClear: boolean;
  onQueryChange: (query: string) => void;
  onClear: () => void;
  onClose: () => void;
}

/**
 * `._searchInput` 672×36: 12px magnifier + borderless field (autofocused by the dialog), the inline
 * "Clear" once text is typed, and the ✕ that closes the dialog.
 */
export function SearchInputRow({ inputRef, query, showClear, onQueryChange, onClear, onClose }: SearchInputRowProps) {
  return (
    <div className={styles.row}>
      <div className={styles.group}>
        <HeaderSearchIcon width={12} height={12} className={styles.magnifier} />
        <div className={styles.inputWrapper}>
          <input
            ref={inputRef}
            type="text"
            className={styles.input}
            placeholder="Search"
            aria-label="Search"
            autoComplete="off"
            spellCheck={false}
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
          />
          {showClear ? (
            <SearchTextButton className={styles.clear} onClick={onClear}>
              Clear
            </SearchTextButton>
          ) : null}
        </div>
      </div>
      <IconButton label="Close" size="sm" icon={<HomeSearchCloseIcon />} className={clsx(styles.close, touch.target)} onClick={onClose} />
    </div>
  );
}
