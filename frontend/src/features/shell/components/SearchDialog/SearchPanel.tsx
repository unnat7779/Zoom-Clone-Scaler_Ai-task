"use client";

import { useToast } from "@/shared/ui/Toast";
import { useSearchPanel } from "../../hooks/useSearchPanel";
import { SearchChips } from "./SearchChips";
import { SearchInputRow } from "./SearchInputRow";
import { SearchResults } from "./SearchResults";

/** Dialog content (672×580): input row 36 · chips row 44 · results 500. */
export function SearchPanel({ onClose }: { onClose: () => void }) {
  const toast = useToast();
  const search = useSearchPanel();
  return (
    <>
      <SearchInputRow
        inputRef={search.inputRef}
        query={search.query}
        showClear={search.view.showClear}
        onQueryChange={search.setQuery}
        onClear={search.clear}
        onClose={onClose}
      />
      <SearchChips selected={search.chip} onSelect={search.setChip} />
      <SearchResults heading={search.view.heading} showClearAll={search.view.showClearAll} onClearAll={toast.notAvailable} />
    </>
  );
}
