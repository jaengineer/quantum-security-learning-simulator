import type { GroverStageResult } from "@/features/quantum/grover/math/grover";
import { GROVER_TARGETS } from "@/features/quantum/grover/math/grover";

interface ProbabilityBarsProps {
  ariaLabelPrefix: string;
  stage: GroverStageResult;
  targetLabel: string;
}

export function ProbabilityBars({
  ariaLabelPrefix,
  stage,
  targetLabel,
}: ProbabilityBarsProps) {
  return (
    <ul className="flex flex-col gap-3">
      {GROVER_TARGETS.map((basis) => {
        const probability = stage.probabilities[`p${basis}`];
        const percent = Math.max(0, Math.min(100, probability * 100));
        const isTarget = basis === stage.target;

        return (
          <li
            key={basis}
            className={[
              "rounded-xl border p-3 transition",
              isTarget
                ? "border-violet-300 bg-violet-500/5 dark:border-violet-500/50 dark:bg-violet-500/10"
                : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950/20",
            ].join(" ")}
          >
            <div className="mb-2 flex items-baseline justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-semibold text-slate-800 dark:text-slate-100">
                  |{basis}⟩
                </span>
                {isTarget ? (
                  <span className="rounded-full bg-violet-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-violet-700 dark:text-violet-200">
                    {targetLabel}
                  </span>
                ) : null}
              </div>
              <span className="font-mono text-sm font-semibold text-slate-700 dark:text-slate-200">
                {percent.toFixed(2)}%
              </span>
            </div>
            <div
              role="progressbar"
              aria-label={`${ariaLabelPrefix} |${basis}>`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Number(percent.toFixed(2))}
              className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
            >
              <div
                className="h-full rounded-full bg-violet-500 transition-[width] duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
