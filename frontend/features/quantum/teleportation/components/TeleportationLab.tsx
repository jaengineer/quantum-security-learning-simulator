"use client";

import { useMemo, useState } from "react";

import { QuantumFormula } from "@/components/quantum/QuantumFormula";
import { BlochSphere3D } from "@/components/quantum/bloch/BlochSphere3D";
import { formatDiracStateLatex } from "@/features/quantum/builder/format/formatDiracState";
import { cleanBloch, stateToBloch } from "@/features/quantum/builder/math/bloch-coordinates";
import { TeleportationCircuit } from "@/features/quantum/teleportation/components/TeleportationCircuit";
import { TELEPORTATION_INPUT_STATES } from "@/features/quantum/teleportation/data/inputStates";
import {
  TELEPORTATION_PROTOCOL_PHASES,
  getPhaseNavigationState,
  getTeleportationPhaseView,
  type TeleportationProtocolPhaseId,
  type TeleportationPhaseView,
} from "@/features/quantum/teleportation/data/protocolPhases";
import { TELEPORTATION_UI_STRINGS } from "@/features/quantum/teleportation/i18n/strings";
import {
  ALICE_MEASUREMENT_OUTCOMES,
  evaluateTeleportationBranch,
  sampleAliceOutcome,
  type AliceMeasurementOutcome,
} from "@/features/quantum/teleportation/math/teleportation-protocol";
import type { Locale } from "@/features/theory/i18n/types";

function t(locale: Locale, key: keyof typeof TELEPORTATION_UI_STRINGS): string {
  return TELEPORTATION_UI_STRINGS[key][locale];
}

interface TeleportationLabProps {
  locale?: Locale;
  onLocaleChange?: (locale: Locale) => void;
}

export function TeleportationLab({
  locale: controlledLocale,
  onLocaleChange,
}: TeleportationLabProps = {}) {
  const [localLocale, setLocalLocale] = useState<Locale>("en");
  const locale = controlledLocale ?? localLocale;
  const setLocale = onLocaleChange ?? setLocalLocale;
  const [inputId, setInputId] = useState(TELEPORTATION_INPUT_STATES[0].id);
  const [outcome, setOutcome] = useState<AliceMeasurementOutcome>("00");
  const [activePhaseId, setActivePhaseId] =
    useState<TeleportationProtocolPhaseId>("initial");

  const input = useMemo(
    () =>
      TELEPORTATION_INPUT_STATES.find((state) => state.id === inputId) ??
      TELEPORTATION_INPUT_STATES[0],
    [inputId]
  );
  const branch = useMemo(
    () => evaluateTeleportationBranch(input, outcome),
    [input, outcome]
  );
  const phaseNavigation = getPhaseNavigationState(activePhaseId);
  const activePhase = TELEPORTATION_PROTOCOL_PHASES[phaseNavigation.index];
  const phaseView = useMemo(
    () =>
      getTeleportationPhaseView({
        phaseId: activePhase.id,
        input,
        branch,
        locale,
      }),
    [activePhase.id, branch, input, locale]
  );
  const bobBloch = cleanBloch(stateToBloch(branch.bobCorrectedState));
  const selectPreviousPhase = () => {
    if (phaseNavigation.previousPhaseId) {
      setActivePhaseId(phaseNavigation.previousPhaseId);
    }
  };
  const selectNextPhase = () => {
    if (phaseNavigation.nextPhaseId) {
      setActivePhaseId(phaseNavigation.nextPhaseId);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/55">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                {t(locale, "protocol")}
              </h2>
              <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-700 dark:text-violet-200">
                {t(locale, "roles")}
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/40">
              <TeleportationCircuit
                activeColumnIds={activePhase.activeColumnIds}
                completedColumnIds={activePhase.completedColumnIds}
                correctionLabel={branch.correction.label}
                locale={locale}
                outcome={outcome}
              />
            </div>

            <ProtocolWalkthrough
              activePhaseId={activePhase.id}
              locale={locale}
              navigation={phaseNavigation}
              onNext={selectNextPhase}
              onPrevious={selectPreviousPhase}
              onSelectPhase={setActivePhaseId}
              phaseView={phaseView}
            />
          </div>
        </section>

        <aside className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/55">
          <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
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

          <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            {t(locale, "input_state")}
            <select
              value={inputId}
              onChange={(event) => setInputId(event.target.value as typeof inputId)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm normal-case tracking-normal text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              {TELEPORTATION_INPUT_STATES.map((state) => (
                <option key={state.id} value={state.id}>
                  {state.label}
                </option>
              ))}
            </select>
          </label>

          <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
            <QuantumFormula expression={input.latex} displayMode="block" compact />
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              {input.description[locale]}
            </p>
          </div>
        </aside>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/55">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            {t(locale, "alice_measurement")}
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            {t(locale, "alice_measurement_hint")}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {ALICE_MEASUREMENT_OUTCOMES.map((candidate) => (
              <button
                key={candidate}
                type="button"
                onClick={() => setOutcome(candidate)}
                className={[
                  "rounded-xl border px-4 py-3 text-left transition",
                  outcome === candidate
                    ? "border-violet-500 bg-violet-500/10 text-violet-700 dark:text-violet-200"
                    : "border-slate-200 bg-white hover:border-violet-300 dark:border-slate-700 dark:bg-slate-900",
                ].join(" ")}
              >
                <span className="block font-mono text-lg">{candidate}</span>
                <span className="text-xs text-slate-500">p = 25%</span>
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setOutcome(sampleAliceOutcome(input).outcome)}
            className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-600 dark:bg-violet-600 dark:hover:bg-violet-500"
          >
            {t(locale, "sample_branch")}
          </button>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/55">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            {t(locale, "selected_branch")} {outcome}
          </h2>
          <dl className="mt-4 grid gap-3 text-sm">
            <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
              <dt className="text-xs uppercase tracking-widest text-slate-500">{t(locale, "correction")}</dt>
              <dd className="mt-1 font-mono text-lg text-slate-900 dark:text-slate-100">
                {branch.correction.label}
              </dd>
              <dd className="text-xs text-slate-500 dark:text-slate-400">
                {t(locale, branch.correction.descriptionKey)}
              </dd>
            </div>
            <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
              <dt className="text-xs uppercase tracking-widest text-slate-500">
                {t(locale, "measurement_result")}
              </dt>
              <dd className="mt-1 font-mono text-lg text-slate-900 dark:text-slate-100">
                {outcome}
              </dd>
              <dd className="text-xs text-slate-500 dark:text-slate-400">
                {t(locale, "bob_applies")} {branch.correction.label}
              </dd>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-500/10 p-3 dark:border-emerald-500/40">
              <dt className="text-xs uppercase tracking-widest text-emerald-700 dark:text-emerald-300">{t(locale, "fidelity")}</dt>
              <dd className="mt-1 font-mono text-2xl font-semibold text-emerald-700 dark:text-emerald-200">
                {branch.fidelity.toFixed(6)}
              </dd>
              <dd className="text-xs text-slate-600 dark:text-slate-300">{t(locale, "fidelity_hint")}</dd>
            </div>
          </dl>
        </section>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <BlochCard
          title={t(locale, "alice_input_comparison")}
          stateLatex={input.latex}
          vector={input.bloch}
        />
        <BlochCard
          title={t(locale, "bob_recovered_comparison")}
          stateLatex={formatDiracStateLatex(branch.bobCorrectedState)}
          vector={bobBloch}
        />
      </div>
    </div>
  );
}

function ProtocolWalkthrough({
  activePhaseId,
  locale,
  navigation,
  onNext,
  onPrevious,
  onSelectPhase,
  phaseView,
}: {
  activePhaseId: TeleportationProtocolPhaseId;
  locale: Locale;
  navigation: ReturnType<typeof getPhaseNavigationState>;
  onNext(): void;
  onPrevious(): void;
  onSelectPhase(phaseId: TeleportationProtocolPhaseId): void;
  phaseView: TeleportationPhaseView;
}) {
  return (
    <section className="rounded-2xl border border-fuchsia-200 bg-white p-4 shadow-sm dark:border-fuchsia-500/30 dark:bg-slate-900/70">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-fuchsia-700 dark:text-fuchsia-200">
            {t(locale, "protocol_step")}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onPrevious}
              disabled={navigation.isFirst}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-fuchsia-300 hover:text-fuchsia-700 disabled:cursor-not-allowed disabled:opacity-45 dark:border-slate-700 dark:text-slate-300 dark:hover:border-fuchsia-400 dark:hover:text-fuchsia-200"
              aria-label={t(locale, "previous_step")}
            >
              {t(locale, "previous_step")}
            </button>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t(locale, "step_counter")} {navigation.stepNumber} {t(locale, "of")}{" "}
              {navigation.totalSteps}
            </span>
            <button
              type="button"
              onClick={onNext}
              disabled={navigation.isLast}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-fuchsia-300 hover:text-fuchsia-700 disabled:cursor-not-allowed disabled:opacity-45 dark:border-slate-700 dark:text-slate-300 dark:hover:border-fuchsia-400 dark:hover:text-fuchsia-200"
              aria-label={t(locale, "next_step")}
            >
              {t(locale, "next_step")}
            </button>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 quantum-thin-scroll">
          {TELEPORTATION_PROTOCOL_PHASES.map((phase, index) => {
            const selected = phase.id === activePhaseId;
            return (
              <button
                key={phase.id}
                type="button"
                onClick={() => onSelectPhase(phase.id)}
                aria-pressed={selected}
                className={[
                  "shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300 motion-reduce:transition-none",
                  selected
                    ? "border-fuchsia-400 bg-fuchsia-500/15 text-fuchsia-700 dark:border-fuchsia-400/70 dark:text-fuchsia-100"
                    : "border-slate-200 bg-slate-50 text-slate-500 hover:border-fuchsia-300 hover:text-fuchsia-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-fuchsia-400 dark:hover:text-fuchsia-200",
                ].join(" ")}
              >
                {index + 1}. {phase.label[locale]}
              </button>
            );
          })}
        </div>

        <div className="grid gap-3 rounded-xl bg-fuchsia-500/5 p-4 dark:bg-fuchsia-500/10">
          <div className="flex flex-col gap-1">
            <h3 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              {phaseView.title}
            </h3>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {phaseView.description}
            </p>
          </div>

          {phaseView.formulaLatex ? (
            <QuantumFormula
              expression={phaseView.formulaLatex}
              displayMode="block"
              size="md"
              compact
            />
          ) : null}

          <PhaseDynamicDetails locale={locale} phaseView={phaseView} />
        </div>
      </div>
    </section>
  );
}

function PhaseDynamicDetails({
  locale,
  phaseView,
}: {
  locale: Locale;
  phaseView: TeleportationPhaseView;
}) {
  if (phaseView.id === "measurement" && phaseView.branchOptions) {
    return (
      <ul className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
        {phaseView.branchOptions.map((option) => (
          <li
            key={option.outcome}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900/70"
          >
            <span className="block font-mono text-sm text-slate-900 dark:text-slate-100">
              {option.outcome}
            </span>
            <span className="text-slate-500 dark:text-slate-400">
              {t(locale, "branch_probability")}:{" "}
              {(option.probability * 100).toFixed(0)}%
            </span>
          </li>
        ))}
      </ul>
    );
  }

  if (phaseView.id === "classical-communication" && phaseView.messageBits) {
    return (
      <dl className="grid gap-2 text-xs sm:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900/70">
          <dt className="uppercase tracking-widest text-slate-500 dark:text-slate-400">
            {t(locale, "measurement_result")}
          </dt>
          <dd className="mt-1 font-mono text-sm text-slate-900 dark:text-slate-100">
            m0 = {phaseView.messageBits.m0}, m1 = {phaseView.messageBits.m1}
          </dd>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900/70">
          <dt className="uppercase tracking-widest text-slate-500 dark:text-slate-400">
            {t(locale, "classical_message_sent")}
          </dt>
          <dd className="mt-1 font-mono text-sm text-slate-900 dark:text-slate-100">
            {phaseView.messageBits.message}
          </dd>
        </div>
      </dl>
    );
  }

  if (phaseView.id === "bob-correction") {
    return (
      <dl className="grid gap-2 text-xs sm:grid-cols-3">
        <FormulaDetail
          label={`${t(locale, "selected_branch")} ${phaseView.selectedOutcome}`}
          value={phaseView.correctionLabel ?? "I"}
        />
        <FormulaDetail
          label={t(locale, "bob_uncorrected")}
          latex={phaseView.bobUncorrectedStateLatex}
        />
        <FormulaDetail
          label={t(locale, "bob_after")}
          latex={phaseView.bobCorrectedStateLatex}
        />
      </dl>
    );
  }

  if (phaseView.id === "recovered") {
    return (
      <dl className="grid gap-2 text-xs sm:grid-cols-3">
        <FormulaDetail
          label={t(locale, "alice_input")}
          latex={phaseView.inputStateLatex}
        />
        <FormulaDetail
          label={t(locale, "bob_recovered")}
          latex={phaseView.bobCorrectedStateLatex}
        />
        <FormulaDetail
          label={t(locale, "fidelity")}
          value={`F ≈ ${(phaseView.fidelity ?? 1).toFixed(6)}`}
        />
      </dl>
    );
  }

  if (phaseView.id === "initial") {
    return (
      <dl className="grid gap-2 text-xs sm:grid-cols-3">
        <FormulaDetail label={t(locale, "alice_input")} latex={phaseView.inputStateLatex} />
        <FormulaDetail label="q1" latex="\\lvert0\\rangle" />
        <FormulaDetail label="q2" latex="\\lvert0\\rangle" />
      </dl>
    );
  }

  return null;
}

function FormulaDetail({
  label,
  latex,
  value,
}: {
  label: string;
  latex?: string;
  value?: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900/70">
      <dt className="uppercase tracking-widest text-slate-500 dark:text-slate-400">
        {label}
      </dt>
      <dd className="mt-1 font-mono text-sm text-slate-900 dark:text-slate-100">
        {latex ? <QuantumFormula expression={latex} size="inherit" /> : value}
      </dd>
    </div>
  );
}

function BlochCard({
  title,
  stateLatex,
  vector,
}: {
  title: string;
  stateLatex: string;
  vector: { x: number; y: number; z: number };
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/55">
      <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
        {title}
      </h2>
      <QuantumFormula expression={stateLatex} displayMode="block" compact />
      <BlochSphere3D
        x={vector.x}
        y={vector.y}
        z={vector.z}
        height={340}
        viewMode="compact"
        showControls={false}
        expandable
      />
    </section>
  );
}
