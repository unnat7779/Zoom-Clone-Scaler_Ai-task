/** The five filter chips of the Search dialog, in Zoom's order (PRD §6.4). */
export type SearchChipId = "top" | "contacts" | "channels" | "messages" | "files";

export interface SearchView {
  /** section title over the (always empty) results */
  heading: "Recent searches" | "No results";
  /** inline "Clear" in the field */
  showClear: boolean;
  /** "Clear all" next to "Recent searches" */
  showClearAll: boolean;
}

/**
 * What the static results area shows for the typed text [M]: "Recent searches" (+ "Clear all") while
 * the field is empty; "No results" and the inline "Clear" once anything is typed — there is no search
 * index, so nothing ever matches. Whitespace counts as typed text, as in Zoom's field.
 */
export function searchView(query: string): SearchView {
  const typed = query.length > 0;
  return {
    heading: typed ? "No results" : "Recent searches",
    showClear: typed,
    showClearAll: !typed,
  };
}
