import { Card } from "@/components/ui/Card";
import { QuantumFormula } from "@/components/quantum/QuantumFormula";

export interface QuantumGateCardProps {
  name: string;
  matrix: string;
  physicalEffect: string;
  example: {
    input: string;
    output: string;
  };
  className?: string;
}

export function QuantumGateCard({
  name,
  matrix,
  physicalEffect,
  example,
  className,
}: QuantumGateCardProps) {
  return (
    <Card className={className}>
      <div className="flex flex-col gap-3">
        <header className="flex items-baseline justify-between gap-3">
          <h3 className="font-mono text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            {name}
          </h3>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Matrix representation
          </span>
        </header>

        <QuantumFormula expression={matrix} displayMode="block" />

        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          {physicalEffect}
        </p>

        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900/40">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Example
          </span>
          <QuantumFormula expression={example.input} />
          <span aria-hidden className="text-slate-400 dark:text-slate-500">
            {"\u2192"}
          </span>
          <QuantumFormula expression={example.output} />
        </div>
      </div>
    </Card>
  );
}
