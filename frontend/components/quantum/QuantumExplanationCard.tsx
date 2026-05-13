import type { ReactNode } from "react";

import { Card } from "@/components/ui/Card";
import { QuantumFormula } from "@/components/quantum/QuantumFormula";

interface FormulaProp {
  expression: string;
  displayMode?: "inline" | "block";
}

export interface QuantumExplanationCardProps {
  title: string;
  description?: string;
  formula?: FormulaProp;
  interpretation?: string | ReactNode;
  icon?: ReactNode;
  className?: string;
}

export function QuantumExplanationCard({
  title,
  description,
  formula,
  interpretation,
  icon,
  className,
}: QuantumExplanationCardProps) {
  return (
    <Card className={className}>
      <div className="flex flex-col gap-3">
        <header className="flex items-center gap-2">
          {icon ? (
            <span
              aria-hidden
              className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              {icon}
            </span>
          ) : null}
          <h3 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            {title}
          </h3>
        </header>

        {description ? (
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {description}
          </p>
        ) : null}

        {formula ? (
          <QuantumFormula
            expression={formula.expression}
            displayMode={formula.displayMode ?? "block"}
          />
        ) : null}

        {interpretation ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2 text-sm leading-relaxed text-slate-700 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-200">
            {typeof interpretation === "string" ? (
              <p>{interpretation}</p>
            ) : (
              interpretation
            )}
          </div>
        ) : null}
      </div>
    </Card>
  );
}
