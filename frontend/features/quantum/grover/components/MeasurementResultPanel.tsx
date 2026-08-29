import { GROVER_UI_STRINGS } from "@/features/quantum/grover/i18n/strings";
import type { GroverStageResult } from "@/features/quantum/grover/math/grover";
import type { Locale } from "@/features/theory/i18n/types";

type GroverStringKey = keyof typeof GROVER_UI_STRINGS;

interface MeasurementResultPanelProps {
  locale: Locale;
  stage: GroverStageResult;
}

function t(locale: Locale, key: GroverStringKey): string {
  return GROVER_UI_STRINGS[key][locale];
}

function FlowArrow() {
  return <div className="text-center text-2xl text-violet-300 dark:text-violet-500">↓</div>;
}

export function MeasurementResultPanel({ locale, stage }: MeasurementResultPanelProps) {
  const outcome = stage.measurementOutcome ?? stage.target;
  const bits = stage.measurementBits ?? [outcome[0], outcome[1]];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/55">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-300">
            {t(locale, "measurement_result")}
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            {t(locale, "search_complete")}
          </p>
        </div>
        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-700 dark:text-emerald-300">
          {t(locale, "target_found")} ✓
        </span>
      </div>

      <div className="mt-5 flex flex-col items-center gap-2 rounded-2xl border border-violet-200 bg-violet-500/5 p-5 dark:border-violet-500/40">
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            {t(locale, "quantum_state_before_measurement")}
          </p>
          <p className="mt-1 font-mono text-2xl font-semibold text-violet-700 dark:text-violet-200">
            |{outcome}⟩
          </p>
        </div>

        <FlowArrow />

        <div className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            {t(locale, "measurement_step")}
          </p>
          <p className="mt-1 text-2xl">⌁</p>
        </div>

        <FlowArrow />

        <div className="grid w-full max-w-md grid-cols-2 gap-3">
          <BitCard label={t(locale, "q0_classical_bit")} value={bits[0]} />
          <BitCard label={t(locale, "q1_classical_bit")} value={bits[1]} />
        </div>

        <FlowArrow />

        <div className="grid w-full max-w-md gap-3 sm:grid-cols-2">
          <SummaryCard label={t(locale, "classical_bitstring")} value={outcome} />
          <SummaryCard label={t(locale, "success_probability")} value="100%" />
        </div>
      </div>
    </section>
  );
}

function BitCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 text-center dark:border-slate-700 dark:bg-slate-900">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
        {label}
      </p>
      <p className="mt-1 font-mono text-2xl font-semibold text-slate-900 dark:text-slate-100">
        {value}
      </p>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-500/10 p-3 text-center dark:border-emerald-500/40">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-emerald-700 dark:text-emerald-300">
        {label}
      </p>
      <p className="mt-1 font-mono text-xl font-semibold text-slate-900 dark:text-slate-100">
        {value}
      </p>
    </div>
  );
}
