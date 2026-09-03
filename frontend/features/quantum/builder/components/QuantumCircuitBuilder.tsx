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
 *   - Memoises ``simulate(qubitCount, gates)`` so the math runs at every
 *     change but never spuriously when unrelated state moves.
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

import { BlochSphere3D } from "@/components/quantum/bloch/BlochSphere3D";
import type { TrajectoryPoint } from "@/components/quantum/bloch/BlochSphere3D";
import { CircuitCanvas } from "@/features/quantum/builder/components/CircuitCanvas";
import { EntanglementPanel } from "@/features/quantum/builder/components/EntanglementPanel";
import { GatePalette } from "@/features/quantum/builder/components/GatePalette";
import { SimulationResultPanel } from "@/features/quantum/builder/components/SimulationResultPanel";
import { StepByStepExplanation } from "@/features/quantum/builder/components/StepByStepExplanation";
import {
  createPaletteDropGate,
  makeBuilderGateInstance,
  resolveDropTargetQubit,
  retargetSingleQubitGate,
} from "@/features/quantum/builder/components/gateTargeting";
import type {
  BuilderPreset,
  BuilderPresetGate,
} from "@/features/quantum/builder/data/presets";
import { simulate } from "@/features/quantum/builder/math/quantum-simulator";
import type {
  BuilderGateInstance,
  BuilderQubitCount,
  GateId,
} from "@/features/quantum/builder/types";

function makeInstanceFromPreset(spec: BuilderPresetGate): BuilderGateInstance {
  return makeBuilderGateInstance(spec.gateId, {
    theta: spec.params?.theta,
    targetQubit: spec.targetQubit,
    controlQubit: spec.controlQubit,
    targetQubits: spec.targetQubits,
  });
}

export function QuantumCircuitBuilder() {
  const [qubitCount, setQubitCount] = useState<BuilderQubitCount>(1);
  const [gates, setGates] = useState<BuilderGateInstance[]>([]);
  // Stays around so we can flash the panel if the user clicks "Run" with
  // an empty circuit; not strictly required because the math already runs
  // on every change, but it is part of the requested UX.
  const [lastRunAt, setLastRunAt] = useState<number>(0);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const result = useMemo(() => simulate(qubitCount, gates), [qubitCount, gates]);

  // Path taken by the Bloch vector through the circuit, starting from |0⟩.
  // Each entry carries the gate that produced it plus a step heading so a
  // future hover/click handler on the 3D trajectory can surface tooltips.
  const trajectory = useMemo<TrajectoryPoint[]>(() => {
    const start: TrajectoryPoint = {
      x: 0,
      y: 0,
      z: 1,
      stateLabel: "|0⟩",
      stepLabel: "start",
    };
    if (result.qubitCount !== 1) return [start];
    const stepPoints: TrajectoryPoint[] = result.steps.flatMap((step) => {
      if (!step.blochAfter) return [];
      return [
        {
          x: step.blochAfter.x,
          y: step.blochAfter.y,
          z: step.blochAfter.z,
          gateId: step.gate.gateId,
          stepLabel: `Step ${step.index + 1}`,
        },
      ];
    });
    return [start, ...stepPoints];
  }, [result.qubitCount, result.steps]);

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
      const rawTargetQubit = over.data.current?.targetQubit;
      const targetQubit = resolveDropTargetQubit(rawTargetQubit, over.id);
      if (!gateId) return;
      // Only append when dropped onto the canvas drop zone or another canvas
      // item. Drops anywhere else are ignored.
      if (overSource !== "canvas-drop" && overSource !== "canvas") return;
      setGates((current) => {
        const nextGate = createPaletteDropGate({
          gateId,
          qubitCount,
          targetQubit,
          theta,
        });
        return nextGate ? [...current, nextGate] : current;
      });
      return;
    }

    if (activeSource === "canvas" && overSource === "canvas-drop") {
      const activeUid = active.id as string;
      const targetQubit = resolveDropTargetQubit(
        over.data.current?.targetQubit,
        over.id
      );
      setGates((current) => {
        const activeGate = current.find((g) => g.id === activeUid);
        if (!activeGate) return current;
        const retargeted = retargetSingleQubitGate(
          activeGate,
          qubitCount,
          targetQubit
        );
        if (!retargeted) return current;
        return current.map((gate) =>
          gate.id === activeUid ? retargeted : gate
        );
      });
      return;
    }

    if (activeSource === "canvas" && overSource === "canvas") {
      const activeUid = active.id as string;
      const overUid = over.id as string;
      if (activeUid === overUid) return;
      setGates((current) => {
        const oldIndex = current.findIndex((g) => g.id === activeUid);
        const newIndex = current.findIndex((g) => g.id === overUid);
        if (oldIndex === -1 || newIndex === -1) return current;
        return arrayMove(current, oldIndex, newIndex);
      });
    }
  }, [qubitCount]);

  const handleRemoveGate = useCallback((uid: string) => {
    setGates((current) => current.filter((g) => g.id !== uid));
  }, []);

  const handleClear = useCallback(() => {
    setGates([]);
    setLastRunAt(0);
  }, []);

  const handleApplyPreset = useCallback((preset: BuilderPreset) => {
    setQubitCount(preset.qubitCount);
    setGates(preset.gates.map(makeInstanceFromPreset));
  }, []);

  const handleRunSimulation = useCallback(() => {
    setLastRunAt(Date.now());
  }, []);

  const handleQubitCountChange = useCallback((next: BuilderQubitCount) => {
    setQubitCount((current) => {
      if (current === next) return current;
      if (current === 2 && next === 1) {
        setGates([]);
        setLastRunAt(0);
      }
      return next;
    });
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
          qubitCount={qubitCount}
          onApplyPreset={handleApplyPreset}
          onClear={handleClear}
        />

        <div className="flex flex-col gap-5">
          <CircuitCanvas
            qubitCount={qubitCount}
            gates={gates}
            onRemoveGate={handleRemoveGate}
            onRunSimulation={handleRunSimulation}
            onQubitCountChange={handleQubitCountChange}
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
          {result.qubitCount === 1 && result.finalBloch ? (
            <>
              <header className="flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  Bloch sphere
                </h2>
              </header>
              <BlochSphere3D
                x={result.finalBloch.x}
                y={result.finalBloch.y}
                z={result.finalBloch.z}
                trajectory={trajectory}
                showTrajectory={!isEmpty}
                showLabels
                showControls
                expandable
                viewMode="compact"
                height={520}
                caption={
                  isEmpty
                    ? "|0⟩ sits at the north pole. Drag to rotate; press Expand for a focused view."
                    : "Drag to rotate. The trail shows how each gate moved the state."
                }
              />
            </>
          ) : (
            <>
              <header className="flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  Multi-qubit state
                </h2>
              </header>
              {result.entanglement ? (
                <EntanglementPanel entanglement={result.entanglement} />
              ) : null}
            </>
          )}
        </aside>
      </div>
    </DndContext>
  );
}
