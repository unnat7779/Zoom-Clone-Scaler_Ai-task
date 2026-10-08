import type { SearchView } from "../../utils/searchView";
import { SearchTextButton } from "./SearchTextButton";
import styles from "./SearchResults.module.css";

interface SearchResultsProps {
  heading: SearchView["heading"];
  showClearAll: boolean;
  onClearAll: () => void;
}

/** Results list 672×500 (scrolls): only the section header, as Zoom shows with no history or hits. */
export function SearchResults({ heading, showClearAll, onClearAll }: SearchResultsProps) {
  return (
    <div className={styles.results} aria-live="polite">
      <div className={styles.sectionHeader}>
        <p className={styles.title}>{heading}</p>
        {showClearAll ? <SearchTextButton onClick={onClearAll}>Clear all</SearchTextButton> : null}
      </div>
    </div>
  );
}
