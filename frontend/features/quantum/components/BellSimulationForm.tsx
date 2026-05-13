"use client";

import { useState } from "react";

import { QuantumFormula } from "@/components/quantum/QuantumFormula";
import { Button } from "@/components/ui/Button";
import { runBellSimulation } from "@/features/quantum/services/quantumApi";
import type {
  BellStateName,
  QuantumSimulationResult,
} from "@/features/quantum/types";

interface BellSimulationFormProps {
  onResult: (result: QuantumSimulationResult) => void;
  onError: (message: string) => void;
  onLoadingChange: (isLoading: boolean) => void;
  isLoading: boolean;
}

const MIN_SHOTS = 1;
const MAX_SHOTS = 100_000;
const DEFAULT_SHOTS = 1024;

type BellChoice = {
  id: BellStateName | "phi_minus" | "psi_plus" | "psi_minus";
  labelExpression: string;
  formulaExpression: string;
  available: boolean;
};

const BELL_CHOICES: readonly BellChoice[] = [
  {
    id: "phi_plus",
    labelExpression: "\\Phi^{+}",
    formulaExpression:
      "\\tfrac{1}{\\sqrt{2}}\\bigl(\\lvert 00\\rangle + \\lvert 11\\rangle\\bigr)",
    available: true,
  },
  {
    id: "phi_minus",
    labelExpression: "\\Phi^{-}",
    formulaExpression:
      "\\tfrac{1}{\\sqrt{2}}\\bigl(\\lvert 00\\rangle - \\lvert 11\\rangle\\bigr)",
    available: false,
  },
  {
    id: "psi_plus",
    labelExpression: "\\Psi^{+}",
    formulaExpression:
      "\\tfrac{1}{\\sqrt{2}}\\bigl(\\lvert 01\\rangle + \\lvert 10\\rangle\\bigr)",
    available: false,
  },
  {
    id: "psi_minus",
    labelExpression: "\\Psi^{-}",
    formulaExpression:
      "\\tfrac{1}{\\sqrt{2}}\\bigl(\\lvert 01\\rangle - \\lvert 10\\rangle\\bigr)",
    available: false,
  },
];

export function BellSimulationForm({
  onResult,
  onError,
  onLoadingChange,
  isLoading,
}: BellSimulationFormProps) {
  const [bellState, setBellState] = useState<BellStateName>("phi_plus");
  const [shots, setShots] = useState<number>(DEFAULT_SHOTS);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onError("");
    onLoadingChange(true);
    try {
      const result = await runBellSimulation({
        bell_state: bellState,
        shots,
      });
      onResult(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error.";
      onError(message);
    } finally {
      onLoadingChange(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <fieldset className="flex flex-col gap-3">
        <legend className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Bell state
        </legend>
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
          {BELL_CHOICES.map((choice) => {
            const isSelected = choice.available && bellState === choice.id;
            return (
              <label
                key={choice.id}
                className={[
                  "flex cursor-pointer flex-col gap-1 rounded-lg border p-3 text-sm transition-colors",
                  isSelected
                    ? "border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900"
                    : choice.available
                      ? "border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                      : "cursor-not-allowed border-dashed border-slate-300 bg-slate-50/60 text-slate-400 dark:border-slate-700 dark:bg-slate-900/30 dark:text-slate-500",
                ].join(" ")}
              >
                <input
                  type="radio"
                  name="bell-state"
                  value={choice.id}
                  checked={isSelected}
                  disabled={!choice.available}
                  onChange={() =>
                    choice.available && setBellState(choice.id as BellStateName)
                  }
                  className="sr-only"
                />
                <span className="flex items-center justify-between text-base">
                  <QuantumFormula expression={choice.labelExpression} />
                  {!choice.available ? (
                    <span className="text-[10px] font-semibold uppercase tracking-wider">
                      Soon
                    </span>
                  ) : null}
                </span>
                <span
                  className={[
                    "text-[12px]",
                    isSelected
                      ? "text-white/80 dark:text-slate-900/70"
                      : "text-slate-500 dark:text-slate-400",
                  ].join(" ")}
                >
                  <QuantumFormula expression={choice.formulaExpression} />
                </span>
              </label>
            );
          })}
        </div>
        <p className="flex flex-wrap items-baseline gap-1 text-xs text-slate-500 dark:text-slate-400">
          <span>Only</span>
          <QuantumFormula expression="\Phi^{+}" />
          <span>
            is enabled in this iteration; the other three Bell states are
            listed as the next step of the MVP.
          </span>
        </p>
      </fieldset>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="bell-shots"
          className="text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Shots
        </label>
        <input
          id="bell-shots"
          type="number"
          min={MIN_SHOTS}
          max={MAX_SHOTS}
          step={1}
          value={shots}
          onChange={(event) => {
            const parsed = Number.parseInt(event.target.value, 10);
            setShots(Number.isFinite(parsed) ? parsed : DEFAULT_SHOTS);
          }}
          className={[
            "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900",
            "focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500",
            "dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100",
          ].join(" ")}
        />
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Integer in [{MIN_SHOTS.toLocaleString()},{" "}
          {MAX_SHOTS.toLocaleString()}].
        </p>
      </div>

      <Button
        type="submit"
        disabled={isLoading || shots < MIN_SHOTS || shots > MAX_SHOTS}
      >
        {isLoading ? "Running simulation\u2026" : "Run simulation"}
      </Button>
    </form>
  );
}
