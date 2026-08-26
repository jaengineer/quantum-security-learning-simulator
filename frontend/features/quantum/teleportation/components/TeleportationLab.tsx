"use client";

import { useMemo, useState } from "react";

import { BlochSphere3D } from "@/components/quantum/bloch/BlochSphere3D";
import { cleanBloch, stateToBloch } from "@/features/quantum/builder/math/bloch-coordinates";
import type { SingleQubitState } from "@/features/quantum/builder/types";
import { TeleportationCircuit } from "@/features/quantum/teleportation/components/TeleportationCircuit";
import { TELEPORTATION_INPUT_STATES } from "@/features/quantum/teleportation/data/inputStates";
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

function formatState(state: SingleQubitState): string {
  const [a, b] = state;
  const fmt = (value: number) =>
    Math.abs(value) < 1e-9 ? "0" : Number(value.toFixed(3)).toString();
  const complex = (z: { re: number; im: number }) =>
    z.im === 0 ? fmt(z.re) : `${fmt(z.re)}${z.im >= 0 ? "+" : ""}${fmt(z.im)}i`;
  return `${complex(a)}|0⟩ + ${complex(b)}|1⟩`;
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
  const bobBloch = cleanBloch(stateToBloch(branch.bobCorrectedState));

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
                correctionLabel={branch.correction.label}
                locale={locale}
                outcome={outcome}
              />
            </div>
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
            <p className="font-mono text-sm text-slate-700 dark:text-slate-200">
              {formatState(input.state)}
            </p>
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
          stateLabel={formatState(input.state)}
          vector={input.bloch}
        />
        <BlochCard
          title={t(locale, "bob_recovered_comparison")}
          stateLabel={formatState(branch.bobCorrectedState)}
          vector={bobBloch}
        />
      </div>
    </div>
  );
}

function BlochCard({
  title,
  stateLabel,
  vector,
}: {
  title: string;
  stateLabel: string;
  vector: { x: number; y: number; z: number };
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/55">
      <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
        {title}
      </h2>
      <p className="mt-2 font-mono text-sm text-slate-700 dark:text-slate-200">
        {stateLabel}
      </p>
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
