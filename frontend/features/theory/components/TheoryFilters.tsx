"use client";

import { useId, useState } from "react";

import {
  clearAdvancedFilters,
  getAdvancedFilterCount,
  getVisibleTagOptions,
  hasAdvancedFilters,
  INITIAL_FILTER_STATE,
  type TheoryFilterState,
} from "@/features/theory/filterUtils";
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

interface TheoryFiltersProps {
  state: TheoryFilterState;
  onChange: (state: TheoryFilterState) => void;
  availableTags: string[];
}

export { INITIAL_FILTER_STATE, type TheoryFilterState };

export function TheoryFilters({
  state,
  onChange,
  availableTags,
}: TheoryFiltersProps) {
  const t = useT();
  const advancedFiltersId = useId();
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);

  const update = (patch: Partial<TheoryFilterState>) => {
    onChange({ ...state, ...patch });
  };

  const toggleTag = (tag: string) => {
    const exists = state.tags.includes(tag);
    update({
      tags: exists
        ? state.tags.filter((value) => value !== tag)
        : [...state.tags, tag],
    });
  };

  const advancedCount = getAdvancedFilterCount(state);
  const visibleTags = getVisibleTagOptions({
    availableTags,
    selectedTags: state.tags,
    showAllTags,
  });

  return (
    <section
      aria-label={t("filters_heading")}
      className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/40"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
        <label className="flex flex-1 flex-col gap-1.5 text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
          {t("search_label")}
          <input
            type="search"
            value={state.search}
            onChange={(event) => update({ search: event.target.value })}
            placeholder={t("search_placeholder")}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-normal text-slate-800 shadow-sm transition placeholder:text-slate-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-200 dark:border-slate-600 dark:bg-slate-900/60 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
        </label>

        <button
          type="button"
          aria-expanded={advancedOpen}
          aria-controls={advancedFiltersId}
          onClick={() => setAdvancedOpen((open) => !open)}
          className="inline-flex min-h-11 items-center justify-center gap-1 rounded-xl border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 dark:border-slate-600 dark:bg-slate-800/60 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          {t("filters_toggle")}
          {advancedCount > 0 ? ` (${advancedCount})` : ""}
          <span aria-hidden>{advancedOpen ? "▴" : "▾"}</span>
        </button>
      </div>

      {hasAdvancedFilters(state) ? (
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              {t("active_filters")}
            </p>
            <button
              type="button"
              onClick={() => onChange(clearAdvancedFilters(state))}
              className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-slate-400 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 dark:border-slate-600 dark:text-slate-300 dark:hover:text-white"
            >
              {t("clear_all")}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {state.category !== "all" ? (
              <ActiveFilterChip
                label={t(CATEGORY_KEY[state.category])}
                onRemove={() => update({ category: "all" })}
              />
            ) : null}
            {state.level !== "all" ? (
              <ActiveFilterChip
                label={t(LEVEL_KEY[state.level])}
                onRemove={() => update({ level: "all" })}
              />
            ) : null}
            {state.notation !== "all" ? (
              <ActiveFilterChip
                label={t(NOTATION_KEY[state.notation])}
                onRemove={() => update({ notation: "all" })}
              />
            ) : null}
            {state.tags.map((tag) => (
              <ActiveFilterChip
                key={tag}
                label={`#${tag}`}
                onRemove={() =>
                  update({ tags: state.tags.filter((value) => value !== tag) })
                }
              />
            ))}
          </div>
        </div>
      ) : null}

      <div
        id={advancedFiltersId}
        hidden={!advancedOpen}
        className="border-t border-slate-200 pt-4 dark:border-slate-700/60"
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <FilterRow
            label={t("filter_category")}
            options={[
              { id: "all", label: t("filter_all") },
              ...CATEGORY_ORDER.map((value) => ({
                id: value,
                label: t(CATEGORY_KEY[value]),
              })),
            ]}
            active={state.category}
            onSelect={(value) =>
              update({ category: value as TheoryCategory | "all" })
            }
          />

          <FilterRow
            label={t("filter_level")}
            options={[
              { id: "all", label: t("filter_all") },
              ...LEVEL_ORDER.map((value) => ({
                id: value,
                label: t(LEVEL_KEY[value]),
              })),
            ]}
            active={state.level}
            onSelect={(value) => update({ level: value as TheoryLevel | "all" })}
          />

          <FilterRow
            label={t("filter_notation")}
            options={[
              { id: "all", label: t("filter_all") },
              ...NOTATION_ORDER.map((value) => ({
                id: value,
                label: t(NOTATION_KEY[value]),
              })),
            ]}
            active={state.notation}
            onSelect={(value) =>
              update({ notation: value as TheoryNotation | "all" })
            }
          />

          {availableTags.length > 0 ? (
            <div className="flex flex-col gap-2 lg:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                {t("filter_tags")}
              </span>
              <div className="flex flex-wrap gap-2">
                {visibleTags.map((tag) => {
                  const active = state.tags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      aria-pressed={active}
                      className={[
                        "min-h-9 rounded-full border px-3 py-1 text-xs font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400",
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
              {availableTags.length > visibleTags.length || showAllTags ? (
                <button
                  type="button"
                  onClick={() => setShowAllTags((current) => !current)}
                  className="self-start rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-slate-400 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 dark:border-slate-600 dark:text-slate-300 dark:hover:text-white"
                >
                  {showAllTags ? t("show_fewer_tags") : t("show_all_tags")}{" "}
                  <span aria-hidden>{showAllTags ? "▴" : "▾"}</span>
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

interface ActiveFilterChipProps {
  label: string;
  onRemove: () => void;
}

function ActiveFilterChip({ label, onRemove }: ActiveFilterChipProps) {
  const t = useT();

  return (
    <button
      type="button"
      onClick={onRemove}
      aria-label={`${t("remove_filter")} ${label}`}
      className="inline-flex min-h-8 items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 transition hover:border-violet-300 hover:bg-violet-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 dark:border-violet-500/40 dark:bg-violet-500/10 dark:text-violet-200"
    >
      {label}
      <span aria-hidden>×</span>
    </button>
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
                "min-h-9 rounded-full border px-3 py-1 text-xs font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400",
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
