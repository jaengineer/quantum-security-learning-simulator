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
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { GATE_PALETTE_STYLES } from "@/features/quantum/builder/components/gatePaletteStyles";
import { getGate } from "@/features/quantum/builder/math/quantum-gates";
import type { GateInstance, QubitCount } from "@/features/quantum/builder/types";

const COLUMN_WIDTH = 88;
const STATE_LABEL_WIDTH = 76;
const OUTPUT_LABEL_WIDTH = 116;
const TIME_LABEL_HEIGHT = 28;
const SINGLE_WIRE_HEIGHT = 76;
const TWO_WIRE_HEIGHT = 132;
const Q0_CENTER_SINGLE = 38;
const Q0_CENTER_TWO = 32;
const WIRE_GAP = 68;
const GATE_SIZE = 48;
const CONTROL_DOT_SIZE = 20;
const TWO_QUBIT_SYMBOL_SIZE = 36;

interface CircuitCanvasProps {
  qubitCount: QubitCount;
  gates: GateInstance[];
  onRemoveGate(uid: string): void;
  onRunSimulation(): void;
  onQubitCountChange(count: QubitCount): void;
  /** Whether the orchestrator wants to highlight the empty state (no gates). */
  isEmpty: boolean;
}

function wireCentersFor(qubitCount: QubitCount): { q0: number; q1?: number } {
  if (qubitCount === 1) return { q0: Q0_CENTER_SINGLE };
  return { q0: Q0_CENTER_TWO, q1: Q0_CENTER_TWO + WIRE_GAP };
}

function gateThetaLabel(gate: GateInstance): string | null {
  if (!gate.params) return null;
  return `${((gate.params.theta * 180) / Math.PI).toFixed(0)}°`;
}

function ControlDot() {
  return (
    <span
      className="block rounded-full bg-slate-900 shadow-sm dark:bg-violet-300"
      style={{ height: CONTROL_DOT_SIZE, width: CONTROL_DOT_SIZE }}
    />
  );
}

function TargetSymbol({
  label,
  variant = "circle",
}: {
  label: string;
  variant?: "circle" | "square" | "swap";
}) {
  if (variant === "swap") {
    return (
      <span className="font-mono text-3xl font-semibold leading-none text-fuchsia-700 dark:text-fuchsia-100">
        ×
      </span>
    );
  }

  return (
    <span
      className={[
        "flex items-center justify-center border-2 bg-white font-mono text-lg font-semibold shadow-sm dark:bg-slate-900",
        variant === "circle"
          ? "rounded-full border-slate-800 text-slate-800 dark:border-violet-300 dark:text-violet-100"
          : "rounded-xl border-fuchsia-400 text-fuchsia-700 dark:text-fuchsia-100",
      ].join(" ")}
      style={{ height: TWO_QUBIT_SYMBOL_SIZE, width: TWO_QUBIT_SYMBOL_SIZE }}
    >
      {label}
    </span>
  );
}

function CanvasGateColumn({
  gate,
  qubitCount,
  wireHeight,
  q0Center,
  q1Center,
  onRemove,
}: {
  gate: GateInstance;
  qubitCount: QubitCount;
  wireHeight: number;
  q0Center: number;
  q1Center?: number;
  onRemove(uid: string): void;
}) {
  const def = getGate(gate.gateId);
  const style = GATE_PALETTE_STYLES[def.palette];
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: gate.id,
    data: { source: "canvas", uid: gate.id },
  });

  const inlineStyle = {
    width: COLUMN_WIDTH,
    height: wireHeight,
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const thetaLabel = gateThetaLabel(gate);
  const singleGateFace = (
    <span
      className={[
        "absolute flex flex-col items-center justify-center rounded-xl border text-base font-semibold shadow-sm",
        style.block,
        style.label,
      ].join(" ")}
      style={{
        height: GATE_SIZE,
        width: GATE_SIZE,
        left: (COLUMN_WIDTH - GATE_SIZE) / 2,
        top: q0Center - GATE_SIZE / 2,
      }}
    >
      {def.label}
      {thetaLabel ? (
        <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400">
          {thetaLabel}
        </span>
      ) : null}
    </span>
  );

  const connectorStartClearance =
    gate.gateId === "SWAP" ? TWO_QUBIT_SYMBOL_SIZE / 2 : CONTROL_DOT_SIZE / 2;
  const connectorEndClearance = TWO_QUBIT_SYMBOL_SIZE / 2;
  const connectorTop = q0Center + connectorStartClearance;
  const connectorHeight =
    qubitCount === 2 && typeof q1Center === "number"
      ? Math.max(0, q1Center - connectorEndClearance - connectorTop)
      : 0;

  return (
    <div
      ref={setNodeRef}
      style={inlineStyle}
      className={[
        "relative shrink-0 rounded-xl",
        isDragging ? "z-10 opacity-80" : "",
      ].join(" ")}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label={`Reorder ${def.longName} gate`}
        className="relative z-[2] h-full w-full cursor-grab active:cursor-grabbing focus:outline-none"
      >
        {qubitCount === 2 && gate.arity === 2 && typeof q1Center === "number" ? (
          <>
            <span
              className="absolute left-1/2 w-0.5 -translate-x-1/2 bg-slate-700 dark:bg-slate-300"
              style={{ top: connectorTop, height: connectorHeight }}
              aria-hidden
            />
            <span
              className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
              style={{ left: COLUMN_WIDTH / 2, top: q0Center }}
            >
              {gate.gateId === "SWAP" ? (
                <TargetSymbol label="×" variant="swap" />
              ) : (
                <ControlDot />
              )}
            </span>
            <span
              className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
              style={{ left: COLUMN_WIDTH / 2, top: q1Center }}
            >
              {gate.gateId === "CZ" ? (
                <TargetSymbol label="Z" variant="square" />
              ) : gate.gateId === "SWAP" ? (
                <TargetSymbol label="×" variant="swap" />
              ) : (
                <TargetSymbol label="X" />
              )}
            </span>
          </>
        ) : (
          singleGateFace
        )}
      </button>
      <button
        type="button"
        onClick={() => onRemove(gate.id)}
        aria-label={`Remove ${def.longName} gate`}
        title="Remove"
        className="absolute right-2 z-[3] flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 bg-white text-xs text-slate-600 shadow hover:bg-rose-500 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        style={{ top: q0Center - GATE_SIZE / 2 - 8 }}
      >
        {"\u00D7"}
      </button>
    </div>
  );
}

export function CircuitCanvas({
  qubitCount,
  gates,
  onRemoveGate,
  onRunSimulation,
  onQubitCountChange,
  isEmpty,
}: CircuitCanvasProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: "builder-canvas",
    data: { source: "canvas-drop" },
  });
  const wireHeight = qubitCount === 2 ? TWO_WIRE_HEIGHT : SINGLE_WIRE_HEIGHT;
  const { q0, q1 } = wireCentersFor(qubitCount);
  const displayColumnCount = Math.max(gates.length, 4);
  const canvasWidth =
    STATE_LABEL_WIDTH + displayColumnCount * COLUMN_WIDTH + OUTPUT_LABEL_WIDTH;
  const gateLayerWidth = gates.length * COLUMN_WIDTH;
  const wireLeft = STATE_LABEL_WIDTH - 10;
  const wireRight = OUTPUT_LABEL_WIDTH - 12;
  const guideCount = displayColumnCount + 1;

  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white/85 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/55">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Circuit
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {qubitCount === 1
              ? "Time flows left \u2192 right. Drag gates from the palette and drop them on the wire."
              : "Time flows left \u2192 right. Single-qubit gates target q0; two-qubit gates use q0 \u2192 q1."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Number of qubits
            <select
              value={qubitCount}
              onChange={(event) =>
                onQubitCountChange(Number(event.target.value) as QubitCount)
              }
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold normal-case tracking-normal text-slate-700 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              <option value={1}>1 qubit</option>
              <option value={2}>2 qubits</option>
            </select>
          </label>
          <button
            type="button"
            onClick={onRunSimulation}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-violet-600 dark:hover:bg-violet-500"
            disabled={isEmpty}
          >
            Run simulation
          </button>
        </div>
      </header>

      <div
        ref={setNodeRef}
        className={[
          "relative overflow-x-auto rounded-xl border border-dashed px-4 py-6 transition quantum-thin-scroll",
          isOver
            ? "border-violet-500 bg-violet-500/5"
            : "border-slate-300 dark:border-slate-700",
        ].join(" ")}
        aria-label="Quantum circuit wire"
      >
        <div
          className="relative min-w-max"
          style={{
            width: canvasWidth,
            height: TIME_LABEL_HEIGHT + wireHeight,
          }}
        >
          <div className="absolute top-0 z-[1] flex" aria-hidden>
            {Array.from({ length: guideCount }, (_, index) => (
              <span
                key={`time-${index}`}
                className="block text-center text-[11px] font-semibold tracking-wide text-slate-300 dark:text-slate-600"
                style={{
                  width: COLUMN_WIDTH,
                  marginLeft:
                    index === 0 ? STATE_LABEL_WIDTH - COLUMN_WIDTH / 2 : 0,
                }}
              >
                {index === 0 ? "t0 (init)" : `t${index}`}
              </span>
            ))}
          </div>

          <div
            className="absolute inset-x-0 z-0"
            style={{ top: TIME_LABEL_HEIGHT, height: wireHeight }}
            aria-hidden
          >
            {Array.from({ length: guideCount }, (_, index) => (
              <span
                key={`guide-${index}`}
                className="absolute top-0 h-full border-l border-dashed border-slate-200 dark:border-slate-800"
                style={{
                  left:
                    index === 0
                      ? STATE_LABEL_WIDTH - COLUMN_WIDTH / 2
                      : STATE_LABEL_WIDTH + (index - 0.5) * COLUMN_WIDTH,
                }}
              />
            ))}
            <span
              className="absolute h-0.5 rounded-full bg-slate-700/75 dark:bg-slate-300/75"
              style={{ left: wireLeft, right: wireRight, top: q0 }}
            />
            {qubitCount === 2 && typeof q1 === "number" ? (
              <span
                className="absolute h-0.5 rounded-full bg-slate-700/75 dark:bg-slate-300/75"
                style={{ left: wireLeft, right: wireRight, top: q1 }}
              />
            ) : null}
          </div>

          <span
            className="absolute z-[3] flex -translate-y-1/2 select-none items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-sm font-semibold text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            style={{ left: 0, top: TIME_LABEL_HEIGHT + q0 }}
          >
            q0
          </span>
          {qubitCount === 2 && typeof q1 === "number" ? (
            <span
              className="absolute z-[3] flex -translate-y-1/2 select-none items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-sm font-semibold text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              style={{ left: 0, top: TIME_LABEL_HEIGHT + q1 }}
            >
              q1
            </span>
          ) : null}

          <span
            className="absolute right-0 z-[3] flex -translate-y-1/2 select-none items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-sm font-semibold text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            style={{ top: TIME_LABEL_HEIGHT + q0 }}
          >
            |ψ⟩
          </span>
          {qubitCount === 2 && typeof q1 === "number" ? (
            <span
              className="absolute right-0 z-[3] flex -translate-y-1/2 select-none items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-sm font-semibold text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              style={{ top: TIME_LABEL_HEIGHT + q1 }}
            >
              |ψ⟩
            </span>
          ) : null}

          <SortableContext
            items={gates.map((g) => g.id)}
            strategy={horizontalListSortingStrategy}
          >
            <div
              className="absolute z-[2] flex"
              style={{
                left: STATE_LABEL_WIDTH,
                top: TIME_LABEL_HEIGHT,
                width: gateLayerWidth,
                height: wireHeight,
              }}
            >
              {gates.map((gate) => (
                <CanvasGateColumn
                  key={gate.id}
                  gate={gate}
                  qubitCount={qubitCount}
                  wireHeight={wireHeight}
                  q0Center={q0}
                  q1Center={q1}
                  onRemove={onRemoveGate}
                />
              ))}
            </div>
          </SortableContext>

          {isEmpty ? (
            <span
              className="absolute z-[2] select-none whitespace-nowrap rounded-full bg-white/80 px-3 py-1 text-xs italic text-slate-400 dark:bg-slate-900/80 dark:text-slate-500"
              style={{
                left: STATE_LABEL_WIDTH + COLUMN_WIDTH,
                top: TIME_LABEL_HEIGHT + q0 - 12,
              }}
            >
              Drag quantum gates here
            </span>
          ) : null}
        </div>
      </div>
    </section>
  );
}
