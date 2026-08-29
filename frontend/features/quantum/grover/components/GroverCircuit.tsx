import { GROVER_UI_STRINGS } from "@/features/quantum/grover/i18n/strings";
import type { GroverStageResult } from "@/features/quantum/grover/math/grover";
import type { Locale } from "@/features/theory/i18n/types";

type GroverStringKey = keyof typeof GROVER_UI_STRINGS;
type GroverWire = "q0" | "q1";
type OperationStatus = "applied" | "current" | "future";

interface GroverCircuitProps {
  locale: Locale;
  stage: GroverStageResult;
}

const GUTTER_WIDTH = 78;
const COLUMN_WIDTH = 128;
const COLUMN_COUNT = 5;
const TIMELINE_WIDTH = COLUMN_WIDTH * COLUMN_COUNT;
const HEADER_HEIGHT = 42;
const WIRE_AREA_HEIGHT = 112;
const WIRE_Y: Record<GroverWire, number> = {
  q0: 34,
  q1: 82,
};

const COLUMNS = [
  { id: "initial", labelKey: "stage_initial" },
  { id: "superposition", labelKey: "stage_superposition" },
  { id: "oracle", labelKey: "stage_oracle" },
  { id: "diffusion", labelKey: "stage_diffusion" },
  { id: "measurement", labelKey: "stage_measurement" },
] as const;

function t(locale: Locale, key: GroverStringKey): string {
  return GROVER_UI_STRINGS[key][locale];
}

function columnX(index: number): number {
  return index * COLUMN_WIDTH + COLUMN_WIDTH / 2;
}

function operationStatus(stageIndex: number, columnIndex: number): OperationStatus {
  if (columnIndex < stageIndex) return "applied";
  if (columnIndex === stageIndex) return "current";
  return "future";
}

function purpleOperationClasses(status: OperationStatus): string {
  if (status === "current") {
    return "border-violet-600 bg-violet-600 text-white shadow-violet-500/25";
  }

  if (status === "applied") {
    return "border-violet-300 bg-violet-50 text-violet-700 dark:border-violet-700 dark:bg-violet-950 dark:text-violet-200";
  }

  return "border-slate-300 bg-white text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400";
}

function semanticBlockClasses(kind: "oracle" | "diffusion", status: OperationStatus): string {
  if (status === "future") {
    return "border-slate-300 bg-white text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400";
  }

  if (kind === "oracle") {
    return status === "current"
      ? "border-amber-500 bg-amber-500 text-slate-950 shadow-amber-500/25 dark:border-amber-300 dark:bg-amber-400 dark:text-slate-950"
      : "border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200";
  }

  return status === "current"
    ? "border-emerald-500 bg-emerald-500 text-slate-950 shadow-emerald-500/25 dark:border-emerald-300 dark:bg-emerald-400 dark:text-slate-950"
    : "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-200";
}

export function GroverCircuit({ locale, stage }: GroverCircuitProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-50/70 p-4 quantum-thin-scroll dark:border-slate-800 dark:bg-slate-950/40">
      <div
        className="grid"
        style={{
          minWidth: GUTTER_WIDTH + TIMELINE_WIDTH,
          gridTemplateColumns: `${GUTTER_WIDTH}px ${TIMELINE_WIDTH}px`,
        }}
      >
        <div />
        <div className="relative" style={{ height: HEADER_HEIGHT }}>
          {COLUMNS.map((column, index) => (
            <div
              key={column.id}
              className={[
                "absolute top-0 flex w-24 -translate-x-1/2 justify-center text-center text-[11px] font-semibold uppercase tracking-wider",
                operationStatus(stage.index, index) === "current"
                  ? "text-violet-700 dark:text-violet-200"
                  : operationStatus(stage.index, index) === "applied"
                    ? "text-slate-700 dark:text-slate-200"
                    : "text-slate-400 dark:text-slate-500",
              ].join(" ")}
              style={{ left: columnX(index) }}
            >
              {t(locale, column.labelKey)}
            </div>
          ))}
        </div>

        <div className="relative" style={{ height: WIRE_AREA_HEIGHT }}>
          <WireLabel label={t(locale, "q0_initial")} y={WIRE_Y.q0} />
          <WireLabel label={t(locale, "q1_initial")} y={WIRE_Y.q1} />
        </div>

        <div
          className="relative overflow-hidden rounded-xl bg-white/80 dark:bg-slate-950/20"
          style={{ height: WIRE_AREA_HEIGHT, width: TIMELINE_WIDTH }}
        >
          <WireLayer />
          <Gate label="|0⟩" status={operationStatus(stage.index, 0)} x={columnX(0)} y={WIRE_Y.q0} />
          <Gate label="|0⟩" status={operationStatus(stage.index, 0)} x={columnX(0)} y={WIRE_Y.q1} />
          <Gate label="H" status={operationStatus(stage.index, 1)} x={columnX(1)} y={WIRE_Y.q0} />
          <Gate label="H" status={operationStatus(stage.index, 1)} x={columnX(1)} y={WIRE_Y.q1} />
          <TwoQubitBlock
            detail={`${t(locale, "oracle_block_detail")} |${stage.target}⟩`}
            kind="oracle"
            label={t(locale, "oracle_block")}
            status={operationStatus(stage.index, 2)}
            x={columnX(2)}
          />
          <TwoQubitBlock
            detail={t(locale, "diffusion_block_detail")}
            kind="diffusion"
            label={t(locale, "diffusion_block")}
            status={operationStatus(stage.index, 3)}
            x={columnX(3)}
          />
          <Measurement status={operationStatus(stage.index, 4)} x={columnX(4)} y={WIRE_Y.q0} />
          <Measurement status={operationStatus(stage.index, 4)} x={columnX(4)} y={WIRE_Y.q1} />
        </div>
      </div>
    </div>
  );
}

function WireLabel({ label, y }: { label: string; y: number }) {
  return (
    <div
      className="absolute right-4 flex -translate-y-1/2 font-mono text-sm font-semibold text-slate-600 dark:text-slate-300"
      style={{ top: y }}
    >
      {label}
    </div>
  );
}

function WireLayer() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
      {(["q0", "q1"] as const).map((wire) => (
        <span
          key={wire}
          className="absolute left-0 right-0 border-t-2 border-slate-300 dark:border-slate-700"
          style={{ top: WIRE_Y[wire] }}
        />
      ))}
    </div>
  );
}

function Gate({
  label,
  status,
  x,
  y,
}: {
  label: string;
  status: OperationStatus;
  x: number;
  y: number;
}) {
  return (
    <span
      className={[
        "absolute z-20 flex h-10 min-w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg border px-2 font-mono text-sm font-semibold shadow-sm transition",
        purpleOperationClasses(status),
      ].join(" ")}
      style={{ left: x, top: y }}
    >
      {label}
    </span>
  );
}

function TwoQubitBlock({
  detail,
  kind,
  label,
  status,
  x,
}: {
  detail: string;
  kind: "oracle" | "diffusion";
  label: string;
  status: OperationStatus;
  x: number;
}) {
  const top = WIRE_Y.q0;
  const height = WIRE_Y.q1 - WIRE_Y.q0;

  return (
    <div
      className={[
        "absolute z-20 flex w-28 -translate-x-1/2 flex-col items-center justify-center rounded-xl border px-3 text-center shadow-sm transition",
        semanticBlockClasses(kind, status),
      ].join(" ")}
      style={{ left: x, top: top - 18, height: height + 36 }}
    >
      <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
      <span className="mt-1 font-mono text-[11px] leading-tight opacity-80">{detail}</span>
    </div>
  );
}

function Measurement({ status, x, y }: { status: OperationStatus; x: number; y: number }) {
  return (
    <span
      className={[
        "absolute z-20 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg border font-mono text-lg font-semibold shadow-sm transition",
        purpleOperationClasses(status),
      ].join(" ")}
      style={{ left: x, top: y }}
      aria-label="Measurement"
    >
      ⌁
    </span>
  );
}
