"use client";

/**
 * Left column of the Builder: a catalog of every available single-qubit gate
 * (in their canonical order) plus a "Presets" subsection that loads
 * predefined circuits with a single click.
 *
 * Parametric gates (Rx/Ry/Rz) share a single global ``theta`` slider; the
 * captured angle is bundled into the dnd-kit drag data so each gate dropped
 * on the canvas keeps its own independent ``params.theta``.
 */

import { useState } from "react";

import { QuantumGateBlock } from "@/features/quantum/builder/components/QuantumGateBlock";
import { BUILDER_PRESETS } from "@/features/quantum/builder/data/presets";
import { ALL_GATES } from "@/features/quantum/builder/math/quantum-gates";
import type { BuilderPreset } from "@/features/quantum/builder/data/presets";

interface GatePaletteProps {
  onApplyPreset(preset: BuilderPreset): void;
  onClear(): void;
}

const DEFAULT_THETA = Math.PI / 2;

export function GatePalette({ onApplyPreset, onClear }: GatePaletteProps) {
  const [theta, setTheta] = useState<number>(DEFAULT_THETA);
  const thetaDeg = (theta * 180) / Math.PI;

  return (
    <aside className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white/85 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/55">
      <div className="flex flex-col gap-1">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
          Gate palette
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Drag any gate onto the qubit wire.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {ALL_GATES.map((gate) => (
          <QuantumGateBlock
            key={gate.id}
            mode="palette"
            gateId={gate.id}
            theta={gate.parametric ? theta : undefined}
          />
        ))}
      </div>

      <div className="flex flex-col gap-2 rounded-xl border border-dashed border-slate-300 px-3 py-3 dark:border-slate-700">
        <div className="flex items-center justify-between text-xs">
          <label
            htmlFor="builder-theta"
            className="font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400"
          >
            θ (rotation angle)
          </label>
          <span className="font-mono tabular-nums text-slate-700 dark:text-slate-200">
            {`${thetaDeg.toFixed(0)}°`}
          </span>
        </div>
        <input
          id="builder-theta"
          type="range"
          min={-Math.PI}
          max={Math.PI}
          step={Math.PI / 36}
          value={theta}
          onChange={(event) => setTheta(Number(event.target.value))}
          className="accent-violet-600"
        />
        <p className="text-[10px] text-slate-500 dark:text-slate-400">
          Captured when you drop an Rx / Ry / Rz gate; each placed gate keeps its own θ.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
          Presets
        </h3>
        <ul className="flex flex-col gap-1.5">
          {BUILDER_PRESETS.map((preset) => (
            <li key={preset.id}>
              <button
                type="button"
                onClick={() => onApplyPreset(preset)}
                title={preset.description}
                className="group flex w-full items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2 text-left text-xs transition hover:border-violet-400/60 hover:bg-violet-500/10 dark:border-slate-700 dark:bg-slate-800/40 dark:hover:border-violet-400/50"
              >
                <span className="font-medium text-slate-700 dark:text-slate-200">
                  {preset.label}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-slate-500 group-hover:text-violet-600 dark:text-slate-400 dark:group-hover:text-violet-300">
                  Load
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        onClick={onClear}
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-widest text-slate-600 transition hover:border-rose-400/60 hover:text-rose-600 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:border-rose-400/40 dark:hover:text-rose-300"
      >
        Reset circuit
      </button>
    </aside>
  );
}
