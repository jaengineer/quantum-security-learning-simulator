"use client";

import { useState } from "react";

import { QuantumFormula } from "@/components/quantum/QuantumFormula";
import { Button } from "@/components/ui/Button";
import { runHadamardSimulation } from "@/features/quantum/services/quantumApi";
import type {
  InitialState,
  QuantumSimulationResult,
} from "@/features/quantum/types";

interface SimulationFormProps {
  onResult: (result: QuantumSimulationResult) => void;
  onError: (message: string) => void;
  onLoadingChange: (isLoading: boolean) => void;
  isLoading: boolean;
}

const MIN_SHOTS = 1;
const MAX_SHOTS = 100_000;
const DEFAULT_SHOTS = 1024;

export function SimulationForm({
  onResult,
  onError,
  onLoadingChange,
  isLoading,
}: SimulationFormProps) {
  const [initialState, setInitialState] = useState<InitialState>("0");
  const [shots, setShots] = useState<number>(DEFAULT_SHOTS);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onError("");
    onLoadingChange(true);
    try {
      const result = await runHadamardSimulation({
        initial_state: initialState,
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
      <div className="grid gap-4 sm:grid-cols-2">
        <fieldset className="flex flex-col gap-2">
          <legend className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Initial state
          </legend>
          <div className="flex gap-2">
            {(["0", "1"] as const).map((value) => {
              const isSelected = initialState === value;
              return (
                <label
                  key={value}
                  className={[
                    "flex flex-1 cursor-pointer items-center justify-center rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                    isSelected
                      ? "border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900"
                      : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800",
                  ].join(" ")}
                >
                  <input
                    type="radio"
                    name="initial-state"
                    value={value}
                    checked={isSelected}
                    onChange={() => setInitialState(value)}
                    className="sr-only"
                  />
                  <QuantumFormula
                    expression={`\\lvert ${value}\\rangle`}
                    ariaLabel={`Initial state ket ${value}`}
                  />
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="shots"
            className="text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Shots
          </label>
          <input
            id="shots"
            type="number"
            min={MIN_SHOTS}
            max={MAX_SHOTS}
            step={1}
            value={shots}
            onChange={(event) => {
              const parsed = Number.parseInt(event.target.value, 10);
              if (Number.isFinite(parsed)) {
                setShots(parsed);
              } else {
                setShots(DEFAULT_SHOTS);
              }
            }}
            className={[
              "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900",
              "focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500",
              "dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100",
            ].join(" ")}
          />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Integer in [{MIN_SHOTS.toLocaleString()},{" "}
            {MAX_SHOTS.toLocaleString()}]. Default {DEFAULT_SHOTS.toLocaleString()}.
          </p>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading || shots < MIN_SHOTS || shots > MAX_SHOTS}
      >
        {isLoading ? "Running simulation…" : "Run simulation"}
      </Button>
    </form>
  );
}
