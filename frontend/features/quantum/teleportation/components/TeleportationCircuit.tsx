"use client";

import { TELEPORTATION_UI_STRINGS } from "@/features/quantum/teleportation/i18n/strings";
import type {
  AliceMeasurementOutcome,
  CorrectionLabel,
} from "@/features/quantum/teleportation/math/teleportation-protocol";
import type { TeleportationCircuitColumnId } from "@/features/quantum/teleportation/data/protocolPhases";
import type { Locale } from "@/features/theory/i18n/types";

type TeleportationStringKey = keyof typeof TELEPORTATION_UI_STRINGS;
type CircuitWire = "q0" | "q1" | "q2";

interface CircuitColumn {
  id: TeleportationCircuitColumnId;
  labelKey: TeleportationStringKey;
}

interface TeleportationCircuitProps {
  activeColumnIds?: readonly TeleportationCircuitColumnId[];
  completedColumnIds?: readonly TeleportationCircuitColumnId[];
  correctionLabel: CorrectionLabel;
  locale: Locale;
  outcome: AliceMeasurementOutcome;
}

const GUTTER_WIDTH = 144;
const COLUMN_WIDTH = 96;
const COLUMN_COUNT = 8;
const RECOVERED_MARKER_SPACE = 72;
const TIMELINE_WIDTH = COLUMN_WIDTH * COLUMN_COUNT + RECOVERED_MARKER_SPACE;
const HEADER_HEIGHT = 54;
const WIRE_AREA_HEIGHT = 176;
const WIRE_Y: Record<CircuitWire, number> = {
  q0: 32,
  q1: 88,
  q2: 144,
};

const CIRCUIT_COLUMNS = [
  { id: "prepare", labelKey: "circuit_prepare" },
  { id: "h-q1", labelKey: "circuit_h_q1" },
  { id: "cnot-q1-q2", labelKey: "circuit_cnot_q1_q2" },
  { id: "cnot-q0-q1", labelKey: "circuit_cnot_q0_q1" },
  { id: "h-q0", labelKey: "circuit_h_q0" },
  { id: "measure", labelKey: "circuit_measure" },
  { id: "bits", labelKey: "circuit_bits" },
  { id: "correct", labelKey: "circuit_correct" },
] as const satisfies readonly CircuitColumn[];

type CircuitColumnState = "active" | "completed" | "future";

const WIRE_LABELS = {
  q0: "wire_q0",
  q1: "wire_q1",
  q2: "wire_q2",
} as const satisfies Record<CircuitWire, TeleportationStringKey>;

const WIRES = ["q0", "q1", "q2"] as const satisfies readonly CircuitWire[];

function t(locale: Locale, key: TeleportationStringKey): string {
  return TELEPORTATION_UI_STRINGS[key][locale];
}

function columnX(columnIndex: number): number {
  return columnIndex * COLUMN_WIDTH + COLUMN_WIDTH / 2;
}

export function TeleportationCircuit({
  activeColumnIds = [],
  completedColumnIds = [],
  correctionLabel,
  locale,
  outcome,
}: TeleportationCircuitProps) {
  const measureX = columnX(5);
  const bitsX = columnX(6);
  const correctionX = columnX(7);
  const bitsY = (WIRE_Y.q0 + WIRE_Y.q1) / 2;
  const recoveredX = TIMELINE_WIDTH - 34;
  const stateForColumn = (id: TeleportationCircuitColumnId): CircuitColumnState =>
    activeColumnIds.includes(id)
      ? "active"
      : completedColumnIds.includes(id)
        ? "completed"
        : "future";

  return (
    <div
      className="flex flex-col gap-4"
      style={{ minWidth: GUTTER_WIDTH + TIMELINE_WIDTH }}
    >
      <p className="max-w-4xl text-sm text-slate-600 dark:text-slate-300">
        {t(locale, "protocol_hint")}
      </p>

      <div
        className="grid"
        style={{
          gridTemplateColumns: `${GUTTER_WIDTH}px ${TIMELINE_WIDTH}px`,
        }}
      >
        <div />
        <div className="relative" style={{ height: HEADER_HEIGHT }}>
          {CIRCUIT_COLUMNS.map((column, index) => (
            <ColumnHeader
              key={column.id}
              label={t(locale, column.labelKey)}
              state={stateForColumn(column.id)}
              x={columnX(index)}
            />
          ))}
        </div>

        <div className="relative" style={{ height: WIRE_AREA_HEIGHT }}>
          {WIRES.map((wire) => (
            <WireLabel
              key={wire}
              label={t(locale, WIRE_LABELS[wire])}
              y={WIRE_Y[wire]}
            />
          ))}
        </div>

        <div
          className="relative overflow-hidden rounded-xl bg-white dark:bg-slate-950"
          style={{ height: WIRE_AREA_HEIGHT, width: TIMELINE_WIDTH }}
        >
          <WireLayer />
          <ClassicalFlow
            bitsX={bitsX}
            bitsY={bitsY}
            correctionX={correctionX}
            measureX={measureX}
          />

          <GateSymbol
            label="|ψ⟩"
            state={stateForColumn("prepare")}
            x={columnX(0)}
            y={WIRE_Y.q0}
          />
          <GateSymbol
            label="|0⟩"
            muted
            state={stateForColumn("prepare")}
            x={columnX(0)}
            y={WIRE_Y.q1}
          />
          <GateSymbol
            label="|0⟩"
            muted
            state={stateForColumn("prepare")}
            x={columnX(0)}
            y={WIRE_Y.q2}
          />
          <GateSymbol
            label="H"
            state={stateForColumn("h-q1")}
            x={columnX(1)}
            y={WIRE_Y.q1}
          />

          <CnotColumn
            controlWire="q1"
            state={stateForColumn("cnot-q1-q2")}
            targetWire="q2"
            x={columnX(2)}
          />
          <CnotColumn
            controlWire="q0"
            state={stateForColumn("cnot-q0-q1")}
            targetWire="q1"
            x={columnX(3)}
          />

          <GateSymbol
            label="H"
            state={stateForColumn("h-q0")}
            x={columnX(4)}
            y={WIRE_Y.q0}
          />
          <MeasurementSymbol
            state={stateForColumn("measure")}
            x={measureX}
            y={WIRE_Y.q0}
          />
          <MeasurementSymbol
            state={stateForColumn("measure")}
            x={measureX}
            y={WIRE_Y.q1}
          />
          <ClassicalBits
            outcome={outcome}
            state={stateForColumn("bits")}
            x={bitsX}
            y={bitsY}
          />
          <GateSymbol
            label={correctionLabel}
            state={stateForColumn("correct")}
            x={correctionX}
            y={WIRE_Y.q2}
          />
          <GateSymbol
            label="|ψ⟩"
            muted
            state={stateForColumn("recovered")}
            x={recoveredX}
            y={WIRE_Y.q2}
          />
        </div>
      </div>
    </div>
  );
}

function stateClasses(state: CircuitColumnState): string {
  if (state === "active") {
    return "border-fuchsia-400 bg-fuchsia-50 text-fuchsia-700 ring-2 ring-fuchsia-300/50 dark:border-fuchsia-400/70 dark:bg-fuchsia-950 dark:text-fuchsia-100 dark:ring-fuchsia-400/30";
  }
  if (state === "completed") {
    return "border-violet-300 bg-white text-slate-800 dark:border-violet-500/50 dark:bg-slate-950 dark:text-slate-100";
  }
  return "border-slate-200 bg-white text-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-500";
}

function lineStateClasses(state: CircuitColumnState): string {
  if (state === "active") return "bg-fuchsia-500 dark:bg-fuchsia-300";
  if (state === "completed") return "bg-slate-600 dark:bg-slate-300";
  return "bg-slate-300 opacity-55 dark:bg-slate-700";
}

function ColumnHeader({
  label,
  state,
  x,
}: {
  label: string;
  state: CircuitColumnState;
  x: number;
}) {
  return (
    <div
      aria-current={state === "active" ? "step" : undefined}
      className={[
        "absolute top-0 flex w-20 -translate-x-1/2 flex-col items-center gap-1 rounded-lg px-1.5 py-1 text-center text-[11px] font-semibold leading-tight transition motion-reduce:transition-none",
        state === "active"
          ? "bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-100"
          : state === "completed"
            ? "text-slate-700 dark:text-slate-200"
            : "text-slate-400 dark:text-slate-500",
      ].join(" ")}
      style={{ left: x }}
    >
      <span>{label}</span>
    </div>
  );
}

function WireLabel({ label, y }: { label: string; y: number }) {
  return (
    <div
      className="absolute right-4 flex -translate-y-1/2 flex-col text-right font-mono text-[11px] leading-tight text-slate-500 dark:text-slate-400"
      style={{ top: y }}
    >
      {label}
    </div>
  );
}

function WireLayer() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
      {WIRES.map((wire) => (
        <span
          key={wire}
          className="absolute left-0 right-0 border-t border-slate-300 dark:border-slate-700"
          style={{ top: WIRE_Y[wire] }}
        />
      ))}
    </div>
  );
}

function ClassicalFlow({
  bitsX,
  bitsY,
  correctionX,
  measureX,
}: {
  bitsX: number;
  bitsY: number;
  correctionX: number;
  measureX: number;
}) {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[1]"
      height={WIRE_AREA_HEIGHT}
      viewBox={`0 0 ${TIMELINE_WIDTH} ${WIRE_AREA_HEIGHT}`}
      width={TIMELINE_WIDTH}
    >
      <path
        d={`M ${measureX} ${WIRE_Y.q0} L ${bitsX} ${bitsY}`}
        fill="none"
        stroke="currentColor"
        strokeDasharray="4 4"
        strokeLinecap="round"
        className="text-slate-400 dark:text-slate-500"
      />
      <path
        d={`M ${measureX} ${WIRE_Y.q1} L ${bitsX} ${bitsY}`}
        fill="none"
        stroke="currentColor"
        strokeDasharray="4 4"
        strokeLinecap="round"
        className="text-slate-400 dark:text-slate-500"
      />
      <path
        d={`M ${bitsX} ${bitsY} L ${bitsX} ${WIRE_Y.q2} L ${correctionX} ${WIRE_Y.q2}`}
        fill="none"
        stroke="currentColor"
        strokeDasharray="4 4"
        strokeLinecap="round"
        className="text-violet-400 dark:text-violet-500"
      />
    </svg>
  );
}

function CnotColumn({
  controlWire,
  state,
  targetWire,
  x,
}: {
  controlWire: CircuitWire;
  state: CircuitColumnState;
  targetWire: CircuitWire;
  x: number;
}) {
  const controlY = WIRE_Y[controlWire];
  const targetY = WIRE_Y[targetWire];
  const top = Math.min(controlY, targetY);
  const height = Math.abs(targetY - controlY);

  return (
    <>
      <span
        aria-hidden
        className={["absolute z-[2] w-px", lineStateClasses(state)].join(" ")}
        style={{ height, left: x, top }}
      />
      <ControlSymbol state={state} x={x} y={controlY} />
      <TargetSymbol state={state} x={x} y={targetY} />
    </>
  );
}

function CircuitElementMask({
  className,
  height,
  width,
  x,
  y,
}: {
  className: string;
  height: number;
  width: number;
  x: number;
  y: number;
}) {
  return (
    <span
      aria-hidden
      className={[
        "absolute z-[8] -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-950",
        className,
      ].join(" ")}
      style={{ height, left: x, top: y, width }}
    />
  );
}

function GateSymbol({
  label,
  muted = false,
  state = "completed",
  x,
  y,
}: {
  label: string;
  muted?: boolean;
  state?: CircuitColumnState;
  x: number;
  y: number;
}) {
  return (
    <>
      <CircuitElementMask
        className="rounded-lg"
        height={36}
        width={50}
        x={x}
        y={y}
      />
      <span
        className={[
          "absolute z-10 flex min-w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg border px-2 py-1 font-mono text-sm font-semibold shadow-sm transition motion-reduce:transition-none",
          stateClasses(state),
          muted && state !== "active"
            ? "text-slate-400 dark:text-slate-500"
            : "",
        ].join(" ")}
        style={{ left: x, top: y }}
      >
        {label}
      </span>
    </>
  );
}

function MeasurementSymbol({
  state,
  x,
  y,
}: {
  state: CircuitColumnState;
  x: number;
  y: number;
}) {
  return (
    <>
      <CircuitElementMask
        className="rounded-lg"
        height={40}
        width={48}
        x={x}
        y={y}
      />
      <span
        className={[
          "absolute z-10 flex h-9 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg border font-mono text-sm font-semibold shadow-sm transition motion-reduce:transition-none",
          stateClasses(state),
        ].join(" ")}
        style={{ left: x, top: y }}
      >
        M
      </span>
    </>
  );
}

function ClassicalBits({
  outcome,
  state,
  x,
  y,
}: {
  outcome: AliceMeasurementOutcome;
  state: CircuitColumnState;
  x: number;
  y: number;
}) {
  return (
    <span
      className={[
        "absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 rounded-xl border border-dashed px-3 py-2 font-mono text-[11px] font-semibold leading-none shadow-sm transition motion-reduce:transition-none",
        stateClasses(state),
      ].join(" ")}
      style={{ left: x, top: y }}
    >
      <span>m0 = {outcome[0]}</span>
      <span>m1 = {outcome[1]}</span>
    </span>
  );
}

function ControlSymbol({
  state,
  x,
  y,
}: {
  state: CircuitColumnState;
  x: number;
  y: number;
}) {
  return (
    <>
      <CircuitElementMask
        className="rounded-full"
        height={28}
        width={28}
        x={x}
        y={y}
      />
      <span
        className={[
          "absolute z-10 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition motion-reduce:transition-none",
          stateClasses(state),
        ].join(" ")}
        style={{ left: x, top: y }}
      />
    </>
  );
}

function TargetSymbol({
  state,
  x,
  y,
}: {
  state: CircuitColumnState;
  x: number;
  y: number;
}) {
  return (
    <>
      <CircuitElementMask
        className="rounded-full"
        height={44}
        width={44}
        x={x}
        y={y}
      />
      <span
        className={[
          "absolute z-10 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 font-mono text-lg leading-none shadow-sm transition motion-reduce:transition-none",
          stateClasses(state),
        ].join(" ")}
        style={{ left: x, top: y }}
      >
        ⊕
      </span>
    </>
  );
}
