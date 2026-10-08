"use client";

import { useRef, useState } from "react";
import { type SearchChipId, searchView } from "../utils/searchView";

/**
 * State of the static Search dialog (PRD §6.4): the typed text, the selected filter chip and what
 * the results area shows. No search runs; typing only switches "Recent searches" to "No results".
 */
export function useSearchPanel() {
  const [query, setQuery] = useState("");
  const [chip, setChip] = useState<SearchChipId>("top");
  const inputRef = useRef<HTMLInputElement | null>(null);

  /** inline "Clear": empties the field and keeps typing there */
  const clear = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  return { query, setQuery, clear, chip, setChip, inputRef, view: searchView(query) };
}
