"use client";

import { useMemo, useState } from "react";

import { QuantumFormula } from "@/components/quantum/QuantumFormula";
import { formatComplexLatex } from "@/features/quantum/builder/format/formatComplexLatex";
import { formatDiracStateLatex } from "@/features/quantum/builder/format/formatDiracState";
import { AmplitudeBars } from "@/features/quantum/grover/components/AmplitudeBars";
import { GroverCircuit } from "@/features/quantum/grover/components/GroverCircuit";
import { ProbabilityBars } from "@/features/quantum/grover/components/ProbabilityBars";
import { GROVER_UI_STRINGS } from "@/features/quantum/grover/i18n/strings";
import {
  GROVER_TARGETS,
  runGrover,
  type GroverBasisState,
  type GroverStageId,
  type GroverStageResult,
} from "@/features/quantum/grover/math/grover";
import type { Locale } from "@/features/theory/i18n/types";

type GroverStringKey = keyof typeof GROVER_UI_STRINGS;

interface GroverLabProps {
  locale?: Locale;
  onLocaleChange?: (locale: Locale) => void;
}

const DEFAULT_TARGET: GroverBasisState = "10";

const STAGE_LABEL_KEYS: Record<GroverStageId, GroverStringKey> = {
  initial: "stage_initial",
  superposition: "stage_superposition",
  oracle: "stage_oracle",
  diffusion: "stage_diffusion",
  measurement: "stage_measurement",
};

const STAGE_SHORT_KEYS: Record<GroverStageId, GroverStringKey> = {
  initial: "stage_initial_short",
  superposition: "stage_superposition_short",
  oracle: "stage_oracle_short",
  diffusion: "stage_diffusion_short",
  measurement: "stage_measurement_short",
};

function t(locale: Locale, key: GroverStringKey): string {
  return GROVER_UI_STRINGS[key][locale];
}

function clampStageIndex(index: number, stages: readonly GroverStageResult[]): number {
  return Math.min(Math.max(index, 0), stages.length - 1);
}

export function GroverLab({
  locale: controlledLocale,
  onLocaleChange,
}: GroverLabProps = {}) {
  const [localLocale, setLocalLocale] = useState<Locale>("en");
  const locale = controlledLocale ?? localLocale;
  const setLocale = onLocaleChange ?? setLocalLocale;
  const [target, setTarget] = useState<GroverBasisState>(DEFAULT_TARGET);
  const [stageIndex, setStageIndex] = useState(0);

  const stages = useMemo(() => runGrover(target), [target]);
  const selectedStage = stages[clampStageIndex(stageIndex, stages)];

  const selectTarget = (nextTarget: GroverBasisState) => {
    setTarget(nextTarget);
    setStageIndex(0);
  };

  const reset = () => {
    setTarget(DEFAULT_TARGET);
    setStageIndex(0);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/55">
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <TargetSelector
                locale={locale}
                onSelect={selectTarget}
                selectedTarget={target}
              />
              <label className="flex min-w-36 flex-col gap-2 text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                {t(locale, "language")}
                <select
                  value={locale}
                  onChange={(event) => setLocale(event.target.value as Locale)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm normal-case tracking-normal text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
              </label>
            </div>

            <StageNavigator
              currentStage={selectedStage}
              locale={locale}
              onSelect={setStageIndex}
              stages={stages}
            />

            <GroverCircuit locale={locale} stage={selectedStage} />
          </div>
        </section>

        <aside className="flex flex-col gap-4">
          <StageExplanation locale={locale} stage={selectedStage} />
          <LegendCard locale={locale} />
        </aside>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/55">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-300">
                {t(locale, "amplitudes")}
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                {t(locale, "amplitudes_hint")}
              </p>
            </div>
            <AmplitudeLegend locale={locale} />
          </div>
          <AmplitudeBars stage={selectedStage} targetLabel={t(locale, "target_badge")} />
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/55">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-300">
            {t(locale, "probabilities")}
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            {t(locale, "probabilities_hint")}
          </p>
          <div className="mt-4">
            <ProbabilityBars stage={selectedStage} targetLabel={t(locale, "target_badge")} />
          </div>
        </section>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.8fr)]">
        <DiffusionPanel locale={locale} stage={selectedStage} />
        <ComplexityPanel locale={locale} />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/55">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-300">
            {t(locale, "state_vector")}
          </h2>
          <QuantumFormula
            expression={formatDiracStateLatex(selectedStage.state)}
            displayMode="block"
            ariaLabel="Current Grover state"
          />
        </section>

        <section className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/55">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-300">
              {t(locale, "about_lab")}
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {t(locale, "about_lab_body")}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={reset}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-violet-300 hover:text-violet-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              {t(locale, "reset_lab")}
            </button>
            <div className="flex gap-3">
              <StageButton
                disabled={selectedStage.index === 0}
                label={t(locale, "previous_stage")}
                onClick={() => setStageIndex((index) => Math.max(0, index - 1))}
              />
              <StageButton
                disabled={selectedStage.index === stages.length - 1}
                label={t(locale, "next_stage")}
                onClick={() =>
                  setStageIndex((index) => Math.min(stages.length - 1, index + 1))
                }
                primary
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function TargetSelector({
  locale,
  onSelect,
  selectedTarget,
}: {
  locale: Locale;
  onSelect: (target: GroverBasisState) => void;
  selectedTarget: GroverBasisState;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-300">
          {t(locale, "target_state")}
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          {t(locale, "current_target")}:{" "}
          <span className="font-mono font-semibold">|{selectedTarget}⟩</span>
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {GROVER_TARGETS.map((target) => (
          <button
            key={target}
            type="button"
            onClick={() => onSelect(target)}
            className={[
              "rounded-xl border px-4 py-2 font-mono text-sm font-semibold transition",
              selectedTarget === target
                ? "border-violet-500 bg-violet-500 text-white shadow-sm shadow-violet-500/20"
                : "border-slate-200 bg-white text-slate-700 hover:border-violet-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200",
            ].join(" ")}
          >
            |{target}⟩
          </button>
        ))}
      </div>
    </div>
  );
}

function StageNavigator({
  currentStage,
  locale,
  onSelect,
  stages,
}: {
  currentStage: GroverStageResult;
  locale: Locale;
  onSelect: (index: number) => void;
  stages: readonly GroverStageResult[];
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-3 dark:border-slate-800 dark:bg-slate-950/20">
      <div className="grid gap-2 sm:grid-cols-5">
        {stages.map((stage) => {
          const active = stage.id === currentStage.id;
          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => onSelect(stage.index)}
              className={[
                "flex items-center gap-3 rounded-xl border px-3 py-2 text-left transition",
                active
                  ? "border-violet-500 bg-violet-500/10 text-violet-700 dark:text-violet-200"
                  : "border-slate-200 bg-white text-slate-600 hover:border-violet-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
              ].join(" ")}
            >
              <span
                className={[
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold",
                  active
                    ? "border-violet-500 bg-violet-500 text-white"
                    : "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800",
                ].join(" ")}
              >
                {stage.index + 1}
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="text-sm font-semibold">
                  {t(locale, STAGE_LABEL_KEYS[stage.id])}
                </span>
                <span className="text-xs">{t(locale, STAGE_SHORT_KEYS[stage.id])}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StageExplanation({
  locale,
  stage,
}: {
  locale: Locale;
  stage: GroverStageResult;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/55">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
        {t(locale, "step_of")} {stage.index + 1} {t(locale, "of")} 5
      </p>
      <h2 className="mt-2 text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
        {t(locale, STAGE_LABEL_KEYS[stage.id])}
      </h2>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        {t(locale, stage.descriptionKey)}
      </p>
      {stage.operatorLatex ? (
        <div className="mt-4 rounded-xl border border-violet-200 bg-violet-500/5 p-3 dark:border-violet-500/40">
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-700 dark:text-violet-300">
            {t(locale, "formula")}
          </p>
          <QuantumFormula
            expression={stage.operatorLatex}
            displayMode="block"
            compact
            ariaLabel="Grover stage operator"
          />
        </div>
      ) : null}
      {stage.id === "oracle" ? (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-500/10 p-3 dark:border-amber-500/40">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-700 dark:text-amber-300">
            {t(locale, "oracle_explanation_title")}
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            {t(locale, "oracle_explanation")}
          </p>
        </div>
      ) : null}
    </section>
  );
}

function DiffusionPanel({
  locale,
  stage,
}: {
  locale: Locale;
  stage: GroverStageResult;
}) {
  const mean = stage.diffusionMean;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/55">
      <h2 className="text-sm font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-300">
        {t(locale, "diffusion_explanation_title")}
      </h2>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        {t(locale, "diffusion_explanation")}
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            {t(locale, "mean_amplitude")}
          </p>
          <p className="mt-2 font-mono text-lg font-semibold text-slate-900 dark:text-slate-100">
            {mean ? (
              <QuantumFormula expression={formatComplexLatex(mean)} />
            ) : (
              <span className="text-slate-400">—</span>
            )}
          </p>
        </div>
        <div className="rounded-xl border border-violet-200 bg-violet-500/5 p-3 dark:border-violet-500/40">
          <QuantumFormula
            expression={"a_i'=2\\bar{a}-a_i"}
            displayMode="block"
            compact
            ariaLabel="Diffusion rule"
          />
        </div>
      </div>
    </section>
  );
}

function ComplexityPanel({ locale }: { locale: Locale }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/55">
      <h2 className="text-sm font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-300">
        {t(locale, "complexity")}
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 p-4 text-center dark:border-slate-800">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            {t(locale, "classical_search")}
          </p>
          <p className="mt-2 font-serif text-2xl italic text-slate-900 dark:text-slate-100">
            O(N)
          </p>
        </div>
        <div className="rounded-xl border border-violet-200 bg-violet-500/5 p-4 text-center dark:border-violet-500/40">
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-700 dark:text-violet-300">
            {t(locale, "quantum_search")}
          </p>
          <QuantumFormula expression={"O(\\sqrt{N})"} size="lg" />
        </div>
      </div>
      <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
        {t(locale, "complexity_note")}
      </p>
    </section>
  );
}

function LegendCard({ locale }: { locale: Locale }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/55">
      <h2 className="text-sm font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-300">
        {t(locale, "legend")}
      </h2>
      <ul className="mt-4 flex flex-col gap-3 text-sm text-slate-600 dark:text-slate-300">
        <li className="flex items-center gap-3">
          <span className="h-px w-8 bg-slate-400" />
          {t(locale, "quantum_wire")}
        </li>
        <li className="flex items-center gap-3">
          <span className="rounded-lg border border-violet-300 bg-white px-2 py-1 font-mono text-xs dark:bg-slate-900">
            H
          </span>
          {t(locale, "hadamard_gate")}
        </li>
        <li className="flex items-center gap-3">
          <span className="rounded-lg border border-amber-300 bg-amber-50 px-2 py-1 text-xs font-semibold dark:bg-amber-500/10">
            O
          </span>
          {t(locale, "oracle_block")}
        </li>
        <li className="flex items-center gap-3">
          <span className="rounded-lg border border-emerald-300 bg-emerald-50 px-2 py-1 text-xs font-semibold dark:bg-emerald-500/10">
            D
          </span>
          {t(locale, "diffusion_block")}
        </li>
      </ul>
    </section>
  );
}

function AmplitudeLegend({ locale }: { locale: Locale }) {
  return (
    <div className="flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400">
      <span className="inline-flex items-center gap-1">
        <span className="h-3 w-3 rounded-sm bg-emerald-500" />
        {t(locale, "positive_amplitude")}
      </span>
      <span className="inline-flex items-center gap-1">
        <span className="h-3 w-3 rounded-sm bg-rose-500" />
        {t(locale, "negative_amplitude")}
      </span>
    </div>
  );
}

function StageButton({
  disabled,
  label,
  onClick,
  primary = false,
}: {
  disabled: boolean;
  label: string;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={[
        "rounded-xl px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
        primary
          ? "bg-violet-600 text-white hover:bg-violet-500"
          : "border border-slate-200 bg-white text-slate-700 hover:border-violet-300 hover:text-violet-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200",
      ].join(" ")}
    >
      {label}
    </button>
  );
}
