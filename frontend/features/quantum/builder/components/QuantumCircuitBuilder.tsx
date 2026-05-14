"use client";

/**
 * Top-level orchestrator of the Quantum Circuit Builder.
 *
 * Responsibilities:
 *   - Owns the canonical list of placed gates (``GateInstance[]``).
 *   - Wraps the whole UI in a single ``<DndContext>``. The drag source is
 *     identified by ``active.data.current.source`` ("palette" vs "canvas")
 *     so a single ``onDragEnd`` handler can route both "add new gate" and
 *     "reorder existing gate".
 *   - Memoises ``simulate(KET_0, gates)`` so the math runs at every change
 *     but never spuriously when unrelated state moves.
 *   - Passes derived state down by props; child components have no
 *     awareness of how the simulation is produced.
 *
 * The result is recomputed on every gate change automatically; the
 * ``Run simulation`` button is therefore an explicit confirmation rather
 * than a fetch trigger. We keep it because it matches the user's mental
 * model and the brief, even though the data is already there.
 */

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { useCallback, useMemo, useState } from "react";

import { BlochSphereViewer } from "@/features/quantum/builder/components/BlochSphereViewer";
import { CircuitCanvas } from "@/features/quantum/builder/components/CircuitCanvas";
import { GatePalette } from "@/features/quantum/builder/components/GatePalette";
import { SimulationResultPanel } from "@/features/quantum/builder/components/SimulationResultPanel";
import { StepByStepExplanation } from "@/features/quantum/builder/components/StepByStepExplanation";
import type { BuilderPreset } from "@/features/quantum/builder/data/presets";
import { getGate } from "@/features/quantum/builder/math/quantum-gates";
import { simulate } from "@/features/quantum/builder/math/quantum-simulator";
import { KET_0 } from "@/features/quantum/builder/math/quantum-state";
import type { GateId, GateInstance } from "@/features/quantum/builder/types";

function newUid(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  return `gate-${Math.random().toString(36).slice(2)}-${Date.now()}`;
}

function makeInstance(id: GateId, theta?: number): GateInstance {
  const def = getGate(id);
  return {
    uid: newUid(),
    id,
    params: def.parametric ? { theta: theta ?? Math.PI / 2 } : undefined,
  };
}

export function QuantumCircuitBuilder() {
  const [gates, setGates] = useState<GateInstance[]>([]);
  // Stays around so we can flash the panel if the user clicks "Run" with
  // an empty circuit; not strictly required because the math already runs
  // on every change, but it is part of the requested UX.
  const [lastRunAt, setLastRunAt] = useState<number>(0);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const result = useMemo(() => simulate(KET_0, gates), [gates]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeSource = active.data.current?.source as
      | "palette"
      | "canvas"
      | undefined;
    const overSource = over.data.current?.source as
      | "canvas-drop"
      | "canvas"
      | undefined;

    if (activeSource === "palette") {
      const gateId = active.data.current?.gateId as GateId | undefined;
      const theta = active.data.current?.theta as number | undefined;
      if (!gateId) return;
      // Only append when dropped onto the canvas drop zone or another canvas
      // item. Drops anywhere else are ignored.
      if (overSource !== "canvas-drop" && overSource !== "canvas") return;
      setGates((current) => [...current, makeInstance(gateId, theta)]);
      return;
    }

    if (activeSource === "canvas" && overSource === "canvas") {
      const activeUid = active.id as string;
      const overUid = over.id as string;
      if (activeUid === overUid) return;
      setGates((current) => {
        const oldIndex = current.findIndex((g) => g.uid === activeUid);
        const newIndex = current.findIndex((g) => g.uid === overUid);
        if (oldIndex === -1 || newIndex === -1) return current;
        return arrayMove(current, oldIndex, newIndex);
      });
    }
  }, []);

  const handleRemoveGate = useCallback((uid: string) => {
    setGates((current) => current.filter((g) => g.uid !== uid));
  }, []);

  const handleClear = useCallback(() => {
    setGates([]);
    setLastRunAt(0);
  }, []);

  const handleApplyPreset = useCallback((preset: BuilderPreset) => {
    setGates(preset.gates.map((id) => makeInstance(id)));
  }, []);

  const handleRunSimulation = useCallback(() => {
    setLastRunAt(Date.now());
  }, []);

  const isEmpty = gates.length === 0;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)_320px]">
        <GatePalette
          onApplyPreset={handleApplyPreset}
          onClear={handleClear}
        />

        <div className="flex flex-col gap-5">
          <CircuitCanvas
            gates={gates}
            onRemoveGate={handleRemoveGate}
            onRunSimulation={handleRunSimulation}
            isEmpty={isEmpty}
          />

          <section className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/85 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/55">
            <header className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                Simulation results
              </h2>
              {lastRunAt > 0 ? (
                <span className="text-[10px] text-slate-400 dark:text-slate-500">
                  Updated {new Date(lastRunAt).toLocaleTimeString()}
                </span>
              ) : null}
            </header>
            <SimulationResultPanel result={result} />
          </section>

          <section className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/85 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/55">
            <header className="flex flex-col gap-1">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                Step-by-step explanation
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Every gate is applied in order; the panel below traces the
                state transformation gate by gate.
              </p>
            </header>
            <StepByStepExplanation result={result} />
          </section>
        </div>

        <aside className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/85 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/55 lg:sticky lg:top-6 lg:self-start">
          <header className="flex flex-col gap-1">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              Bloch sphere
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Geometric view of the current single-qubit state.
            </p>
          </header>
          <BlochSphereViewer
            bloch={result.finalBloch}
            caption={
              isEmpty
                ? "|0⟩ sits at the north pole."
                : "Vector animates as you add or reorder gates."
            }
          />
        </aside>
      </div>
    </DndContext>
  );
}
