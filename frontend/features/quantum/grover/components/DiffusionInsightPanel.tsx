import { QuantumFormula } from "@/components/quantum/QuantumFormula";
import { formatComplexLatex } from "@/features/quantum/builder/format/formatComplexLatex";
import { GROVER_UI_STRINGS } from "@/features/quantum/grover/i18n/strings";
import {
  GROVER_TARGETS,
  targetIndex,
  type GroverStageResult,
} from "@/features/quantum/grover/math/grover";
import type { Locale } from "@/features/theory/i18n/types";

type GroverStringKey = keyof typeof GROVER_UI_STRINGS;

interface DiffusionInsightPanelProps {
  locale: Locale;
  stage: GroverStageResult;
}

function t(locale: Locale, key: GroverStringKey): string {
  return GROVER_UI_STRINGS[key][locale];
}

function formatSigned(value: number): string {
  const cleaned = Math.abs(value) < 1e-9 ? 0 : value;
  return `${cleaned > 0 ? "+" : ""}${cleaned.toFixed(2)}`;
}

function TransitionDots({
  activeIndex,
  amplitudes,
  targetLabel,
}: {
  activeIndex: number;
  amplitudes: readonly { re: number; im: number }[];
  targetLabel: string;
}) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {GROVER_TARGETS.map((basis, index) => {
        const value = Math.abs(amplitudes[index].re) < 1e-9 ? 0 : amplitudes[index].re;
        const isTarget = index === activeIndex;
        const isNegative = value < 0;
        const yOffset = -value * 34;

        return (
          <div key={basis} className="flex flex-col items-center gap-2">
            <div className="relative h-24 w-full border-b border-dashed border-slate-300 dark:border-slate-700">
              <span className="absolute left-0 right-0 top-1/2 border-t border-dashed border-violet-200 dark:border-violet-500/30" />
              <span
                className={[
                  "absolute left-1/2 top-1/2 h-10 w-px -translate-x-1/2",
                  isNegative ? "bg-rose-400" : "bg-emerald-400",
                ].join(" ")}
                style={{
                  transform: `translate(-50%, ${Math.min(0, yOffset)}px)`,
                  height: Math.max(12, Math.abs(yOffset)),
                }}
              />
              <span
                className={[
                  "absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-sm",
                  isNegative ? "bg-rose-500" : "bg-emerald-500",
                ].join(" ")}
                style={{ marginTop: yOffset }}
              />
            </div>
            <div className="text-center">
              <p
                className={[
                  "font-mono text-sm font-semibold",
                  isNegative
                    ? "text-rose-600 dark:text-rose-300"
                    : "text-emerald-600 dark:text-emerald-300",
                ].join(" ")}
              >
                {formatSigned(value)}
              </p>
              <p className="font-mono text-xs text-slate-600 dark:text-slate-300">|{basis}⟩</p>
              {isTarget ? (
                <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-300">
                  {targetLabel}
                </p>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function DiffusionInsightPanel({ locale, stage }: DiffusionInsightPanelProps) {
  const before = stage.diffusionBefore;
  const mean = stage.diffusionMean;
  if (!before || !mean) return null;

  const selectedIndex = targetIndex(stage.target);
  const nonTargetIndex = GROVER_TARGETS.findIndex((_, index) => index !== selectedIndex);
  const targetBefore = before[selectedIndex];
  const targetAfter = stage.state[selectedIndex];
  const otherBefore = before[nonTargetIndex];
  const otherAfter = stage.state[nonTargetIndex];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/55">
      <h2 className="text-sm font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-300">
        {t(locale, "diffusion_explanation_title")}
      </h2>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        {t(locale, "diffusion_explanation")}
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 p-4 text-center dark:border-slate-800">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            {t(locale, "mean_amplitude")}
          </p>
          <div className="mt-2 text-2xl font-semibold text-violet-700 dark:text-violet-200">
            <QuantumFormula expression={`\\bar{a}=${formatComplexLatex(mean)}`} size="lg" />
          </div>
        </div>
        <div className="rounded-xl border border-violet-200 bg-violet-500/5 p-4 dark:border-violet-500/40">
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-700 dark:text-violet-300">
            {t(locale, "formula")}
          </p>
          <QuantumFormula
            expression={"a_i'=2\\bar{a}-a_i"}
            displayMode="block"
            compact
            ariaLabel="Diffusion rule"
          />
        </div>
      </div>

      <div className="mt-4 grid items-center gap-4 xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/30">
          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-widest text-slate-500">
            {t(locale, "before_diffusion")}
          </p>
          <TransitionDots
            activeIndex={selectedIndex}
            amplitudes={before}
            targetLabel={t(locale, "target_badge")}
          />
        </div>

        <div className="hidden text-3xl text-slate-300 xl:block dark:text-slate-600" aria-hidden>
          →
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/30">
          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-widest text-slate-500">
            {t(locale, "after_diffusion")}
          </p>
          <TransitionDots
            activeIndex={selectedIndex}
            amplitudes={stage.state}
            targetLabel={t(locale, "target_badge")}
          />
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-violet-200 bg-violet-500/5 p-3 dark:border-violet-500/40">
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-700 dark:text-violet-300">
            {t(locale, "target_transition")} |{stage.target}⟩
          </p>
          <p className="mt-2 font-mono text-sm text-slate-700 dark:text-slate-200">
            {formatSigned(targetBefore.re)} → {formatSigned(targetAfter.re)}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {t(locale, "target_formula")}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            {t(locale, "other_states_transition")}
          </p>
          <p className="mt-2 font-mono text-sm text-slate-700 dark:text-slate-200">
            {formatSigned(otherBefore.re)} → {formatSigned(otherAfter.re)}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {t(locale, "other_formula")}
          </p>
        </div>
      </div>
    </section>
  );
}
