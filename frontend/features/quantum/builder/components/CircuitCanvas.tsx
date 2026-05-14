"use client";

/**
 * Central canvas of the Builder. Renders the single-qubit wire as a
 * horizontal line with the initial state on the left and a drop target on
 * the right of every existing block. Gates placed on the canvas are wrapped
 * inside ``<SortableContext>`` so the user can reorder them by dragging
 * (``horizontalListSortingStrategy``).
 *
 * Empty state: shows a discrete "Drag quantum gates here" hint when no gate
 * has been placed yet, so the affordance is immediately obvious.
 */

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";

import { QuantumGateBlock } from "@/features/quantum/builder/components/QuantumGateBlock";
import type { GateInstance } from "@/features/quantum/builder/types";

interface CircuitCanvasProps {
  gates: GateInstance[];
  onRemoveGate(uid: string): void;
  onRunSimulation(): void;
  /** Whether the orchestrator wants to highlight the empty state (no gates). */
  isEmpty: boolean;
}

export function CircuitCanvas({
  gates,
  onRemoveGate,
  onRunSimulation,
  isEmpty,
}: CircuitCanvasProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: "builder-canvas",
    data: { source: "canvas-drop" },
  });

  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white/85 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/55">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Circuit
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {"Time flows left \u2192 right. Drag gates from the palette and drop them on the wire."}
          </p>
        </div>
        <button
          type="button"
          onClick={onRunSimulation}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-violet-600 dark:hover:bg-violet-500"
          disabled={isEmpty}
        >
          Run simulation
        </button>
      </header>

      <div
        ref={setNodeRef}
        className={[
          "relative flex min-h-[112px] items-center overflow-x-auto rounded-xl border border-dashed px-4 py-6 transition quantum-thin-scroll",
          isOver
            ? "border-violet-500 bg-violet-500/5"
            : "border-slate-300 dark:border-slate-700",
        ].join(" ")}
        aria-label="Quantum circuit wire"
      >
        <div className="flex items-center gap-3">
          <span className="select-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-mono font-semibold text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
            |ψ₀⟩ = |0⟩
          </span>

          <span className="h-px w-6 bg-slate-300 dark:bg-slate-700" aria-hidden />

          <SortableContext
            items={gates.map((g) => g.uid)}
            strategy={horizontalListSortingStrategy}
          >
            <div className="flex items-center gap-3">
              {gates.map((gate) => (
                <div key={gate.uid} className="flex items-center gap-3">
                  <QuantumGateBlock
                    mode="canvas"
                    gate={gate}
                    onRemove={onRemoveGate}
                  />
                  <span
                    className="h-px w-6 bg-slate-300 dark:bg-slate-700"
                    aria-hidden
                  />
                </div>
              ))}
            </div>
          </SortableContext>

          {isEmpty ? (
            <span className="select-none whitespace-nowrap px-2 text-xs italic text-slate-400 dark:text-slate-500">
              Drag quantum gates here
            </span>
          ) : (
            <span className="select-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-mono font-semibold text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
              |ψ⟩
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
