import type {
  TheoryCategory,
  TheoryLevel,
  TheoryNotation,
} from "@/features/theory/types";

export interface TheoryFilterState {
  search: string;
  category: TheoryCategory | "all";
  level: TheoryLevel | "all";
  notation: TheoryNotation | "all";
  tags: string[];
}

export const INITIAL_FILTER_STATE: TheoryFilterState = {
  search: "",
  category: "all",
  level: "all",
  notation: "all",
  tags: [],
};

export const VISIBLE_TAG_LIMIT = 8;

export function getAdvancedFilterCount(state: TheoryFilterState): number {
  return [
    state.category !== "all",
    state.level !== "all",
    state.notation !== "all",
  ].filter(Boolean).length + state.tags.length;
}

export function hasAdvancedFilters(state: TheoryFilterState): boolean {
  return getAdvancedFilterCount(state) > 0;
}

export function hasAnyFilter(state: TheoryFilterState): boolean {
  return state.search.trim().length > 0 || hasAdvancedFilters(state);
}

export function clearAdvancedFilters(
  state: TheoryFilterState
): TheoryFilterState {
  return {
    ...INITIAL_FILTER_STATE,
    search: state.search,
  };
}

export function getVisibleTagOptions({
  availableTags,
  selectedTags,
  showAllTags,
  limit = VISIBLE_TAG_LIMIT,
}: {
  availableTags: string[];
  selectedTags: string[];
  showAllTags: boolean;
  limit?: number;
}): string[] {
  if (showAllTags) return availableTags;

  const visible = new Set(availableTags.slice(0, limit));
  for (const tag of selectedTags) {
    if (availableTags.includes(tag)) visible.add(tag);
  }
  return Array.from(visible);
}
