"use client";

import { useT } from "@/features/theory/i18n/LocaleContext";
import type {
  TheoryCategory,
  TheoryLevel,
  TheoryNotation,
} from "@/features/theory/types";

const CATEGORY_ORDER: TheoryCategory[] = [
  "linear-algebra",
  "quantum-mechanics",
  "quantum-computing",
  "quantum-information",
];
const LEVEL_ORDER: TheoryLevel[] = ["basic", "intermediate", "advanced"];
const NOTATION_ORDER: TheoryNotation[] = ["bra-ket", "matrix", "abstract", "mixed"];

const CATEGORY_KEY = {
  "linear-algebra": "category_linear_algebra",
  "quantum-mechanics": "category_quantum_mechanics",
  "quantum-computing": "category_quantum_computing",
  "quantum-information": "category_quantum_information",
} as const;

const LEVEL_KEY = {
  basic: "level_basic",
  intermediate: "level_intermediate",
  advanced: "level_advanced",
} as const;

const NOTATION_KEY = {
  "bra-ket": "notation_bra_ket",
  matrix: "notation_matrix",
  abstract: "notation_abstract",
  mixed: "notation_mixed",
} as const;

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

interface TheoryFiltersProps {
  state: TheoryFilterState;
  onChange: (state: TheoryFilterState) => void;
  availableTags: string[];
}

export function TheoryFilters({
  state,
  onChange,
  availableTags,
}: TheoryFiltersProps) {
  const t = useT();

  const update = (patch: Partial<TheoryFilterState>) => onChange({ ...state, ...patch });

  const toggleTag = (tag: string) => {
    const exists = state.tags.includes(tag);
    update({
      tags: exists ? state.tags.filter((value) => value !== tag) : [...state.tags, tag],
    });
  };

  const reset = () => onChange(INITIAL_FILTER_STATE);

  const hasActiveFilters =
    state.search.trim().length > 0 ||
    state.category !== "all" ||
    state.level !== "all" ||
    state.notation !== "all" ||
    state.tags.length > 0;

  return (
    <section
      aria-label={t("filters_heading")}
      className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/40"
    >
      <header className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold tracking-tight text-slate-700 dark:text-slate-200">
          {t("filters_heading")}
        </h2>
        {hasActiveFilters ? (
          <button
            type="button"
            onClick={reset}
            className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-slate-400 hover:text-slate-900 dark:border-slate-600 dark:text-slate-300 dark:hover:text-white"
          >
            {t("filter_reset")}
          </button>
        ) : null}
      </header>

      <label className="flex flex-col gap-1.5 text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
        {t("search_label")}
        <input
          type="search"
          value={state.search}
          onChange={(event) => update({ search: event.target.value })}
          placeholder={t("search_placeholder")}
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-normal text-slate-800 shadow-sm transition placeholder:text-slate-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-200 dark:border-slate-600 dark:bg-slate-900/60 dark:text-slate-100 dark:placeholder:text-slate-500"
        />
      </label>

      <FilterRow
        label={t("filter_category")}
        options={[
          { id: "all", label: t("filter_all") },
          ...CATEGORY_ORDER.map((value) => ({ id: value, label: t(CATEGORY_KEY[value]) })),
        ]}
        active={state.category}
        onSelect={(value) => update({ category: value as TheoryCategory | "all" })}
      />

      <FilterRow
        label={t("filter_level")}
        options={[
          { id: "all", label: t("filter_all") },
          ...LEVEL_ORDER.map((value) => ({ id: value, label: t(LEVEL_KEY[value]) })),
        ]}
        active={state.level}
        onSelect={(value) => update({ level: value as TheoryLevel | "all" })}
      />

      <FilterRow
        label={t("filter_notation")}
        options={[
          { id: "all", label: t("filter_all") },
          ...NOTATION_ORDER.map((value) => ({ id: value, label: t(NOTATION_KEY[value]) })),
        ]}
        active={state.notation}
        onSelect={(value) => update({ notation: value as TheoryNotation | "all" })}
      />

      {availableTags.length > 0 ? (
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            {t("filter_tags")}
          </span>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => {
              const active = state.tags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  aria-pressed={active}
                  className={[
                    "rounded-full border px-3 py-1 text-xs font-medium transition",
                    active
                      ? "border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900"
                      : "border-slate-300 bg-slate-50 text-slate-700 hover:border-slate-400 dark:border-slate-600 dark:bg-slate-800/60 dark:text-slate-200",
                  ].join(" ")}
                >
                  #{tag}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </section>
  );
}

interface FilterRowProps {
  label: string;
  options: { id: string; label: string }[];
  active: string;
  onSelect: (value: string) => void;
}

function FilterRow({ label, options, active, onSelect }: FilterRowProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isActive = option.id === active;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelect(option.id)}
              aria-pressed={isActive}
              className={[
                "rounded-full border px-3 py-1 text-xs font-medium transition",
                isActive
                  ? "border-violet-500 bg-violet-500 text-white shadow dark:border-violet-400 dark:bg-violet-500"
                  : "border-slate-300 bg-slate-50 text-slate-700 hover:border-slate-400 dark:border-slate-600 dark:bg-slate-800/60 dark:text-slate-200",
              ].join(" ")}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
