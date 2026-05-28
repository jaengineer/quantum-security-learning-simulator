"use client";

/**
 * Right-side drawer listing every glossary entry alongside a deep link to
 * the matching Theory Lab concept (when one exists). The drawer is built on
 * Radix' modal Dialog primitive, so accessibility (focus trap, ESC to close,
 * scroll lock, ``aria-modal``) is handled by the library.
 *
 * Search is local: a single substring match against ``term`` and ``summary``,
 * case-insensitive. The list is rendered in the order declared in
 * ``entries.ts`` (gates first, then notation/operators, then visualisation
 * primitives) so the FAB doubles as a tour for newcomers.
 */

import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import { useMemo, useState } from "react";

import { QuantumFormula } from "@/components/quantum/QuantumFormula";
import {
  GLOSSARY_ENTRIES,
  getTheoryRouteForEntry,
} from "@/features/overlays/glossary/entries";

interface GlossaryDrawerProps {
  open: boolean;
  onOpenChange(open: boolean): void;
}

export function GlossaryDrawer({ open, onOpenChange }: GlossaryDrawerProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (needle.length === 0) return GLOSSARY_ENTRIES;
    return GLOSSARY_ENTRIES.filter((entry) =>
      `${entry.term} ${entry.summary}`.toLowerCase().includes(needle)
    );
  }, [query]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className={[
            "fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm",
            "motion-safe:transition motion-safe:duration-150 motion-safe:ease-out",
            "data-[state=closed]:motion-safe:opacity-0",
            "data-[state=open]:motion-safe:opacity-100",
          ].join(" ")}
        />
        <Dialog.Content
          className={[
            "fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col gap-4 border-l border-slate-200 bg-white p-5 shadow-2xl",
            "motion-safe:transition motion-safe:duration-200 motion-safe:ease-out",
            "data-[state=closed]:motion-safe:translate-x-full",
            "data-[state=open]:motion-safe:translate-x-0",
            "dark:border-slate-700 dark:bg-slate-900",
          ].join(" ")}
        >
          <header className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-1">
              <Dialog.Title className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                Quantum glossary
              </Dialog.Title>
              <Dialog.Description
                className="text-xs text-slate-500 dark:text-slate-400"
              >
                Short definitions for every gate, operator and visual primitive
                used in this simulator. Each entry can deep-link into the
                Theory Lab for the full treatment.
              </Dialog.Description>
            </div>
            <Dialog.Close
              className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-600 transition hover:border-slate-400 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:text-slate-100"
              aria-label="Close glossary"
            >
              Close
            </Dialog.Close>
          </header>

          <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Search
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="hermitian, density, T-dagger…"
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-normal text-slate-800 shadow-sm transition placeholder:text-slate-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-200 dark:border-slate-600 dark:bg-slate-900/60 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
          </label>

          <div className="flex-1 overflow-y-auto pr-1">
            {filtered.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 p-4 text-center text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-900/40">
                No entries match the current search.
              </p>
            ) : (
              <ul className="flex flex-col gap-2">
                {filtered.map((entry) => {
                  const route = getTheoryRouteForEntry(entry);
                  return (
                    <li
                      key={entry.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50/60 p-3 dark:border-slate-700 dark:bg-slate-800/40"
                    >
                      <p className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                        {entry.term}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                        {entry.summary}
                      </p>
                      {entry.latex ? (
                        <div className="mt-2 rounded-lg bg-white px-2 py-1 dark:bg-slate-900/70">
                          <QuantumFormula
                            expression={entry.latex}
                            displayMode="block"
                            size="sm"
                            compact
                          />
                        </div>
                      ) : null}
                      {route ? (
                        <Link
                          href={route}
                          prefetch
                          onClick={() => onOpenChange(false)}
                          className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-violet-600 underline-offset-2 hover:underline dark:text-violet-300"
                        >
                          Open in Theory Lab
                          <span aria-hidden>→</span>
                        </Link>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
