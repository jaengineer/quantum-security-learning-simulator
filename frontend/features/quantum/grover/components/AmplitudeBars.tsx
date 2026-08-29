import type { GroverStageResult } from "@/features/quantum/grover/math/grover";
import { GROVER_TARGETS } from "@/features/quantum/grover/math/grover";

interface AmplitudeBarsProps {
  amplitudeHeader: string;
  stage: GroverStageResult;
  stateHeader: string;
  targetLabel: string;
}

function formatAmplitude(value: number): string {
  const cleaned = Math.abs(value) < 1e-9 ? 0 : value;
  return `${cleaned >= 0 ? "+" : ""}${cleaned.toFixed(2)}`;
}

export function AmplitudeBars({
  amplitudeHeader,
  stage,
  stateHeader,
  targetLabel,
}: AmplitudeBarsProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-[64px_minmax(0,1fr)_72px] items-center gap-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        <span>{stateHeader}</span>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          <span className="text-right">-1</span>
          <span>0</span>
          <span>+1</span>
        </div>
        <span className="text-right">{amplitudeHeader}</span>
      </div>

      <ul className="flex flex-col gap-3">
        {GROVER_TARGETS.map((basis, index) => {
          const amp = stage.state[index];
          const real = Math.abs(amp.re) < 1e-9 ? 0 : amp.re;
          const width = `${Math.min(100, Math.abs(real) * 100)}%`;
          const isNegative = real < 0;
          const isTarget = basis === stage.target;

          return (
            <li
              key={basis}
              className={[
                "grid grid-cols-[64px_minmax(0,1fr)_72px] items-center gap-3 rounded-xl border p-2 transition",
                isTarget
                  ? "border-violet-300 bg-violet-500/5 dark:border-violet-500/50 dark:bg-violet-500/10"
                  : "border-transparent",
              ].join(" ")}
            >
              <div className="flex flex-col">
                <span className="font-mono text-sm font-semibold text-slate-800 dark:text-slate-100">
                  |{basis}⟩
                </span>
                {isTarget ? (
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-300">
                    {targetLabel}
                  </span>
                ) : null}
              </div>

              <div className="relative grid h-8 grid-cols-2 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800/70">
                <span className="absolute inset-y-0 left-1/2 z-10 w-px bg-slate-400/70 dark:bg-slate-500" />
                <div className="relative">
                  {isNegative ? (
                    <span
                      className="absolute right-0 top-1/2 h-3 -translate-y-1/2 rounded-l-full bg-rose-500 transition-[width] duration-500"
                      style={{ width }}
                    />
                  ) : null}
                </div>
                <div className="relative">
                  {!isNegative && real !== 0 ? (
                    <span
                      className="absolute left-0 top-1/2 h-3 -translate-y-1/2 rounded-r-full bg-emerald-500 transition-[width] duration-500"
                      style={{ width }}
                    />
                  ) : null}
                </div>
              </div>

              <span
                className={[
                  "text-right font-mono text-sm font-semibold",
                  isNegative
                    ? "text-rose-600 dark:text-rose-300"
                    : "text-emerald-600 dark:text-emerald-300",
                ].join(" ")}
              >
                {formatAmplitude(real)}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
