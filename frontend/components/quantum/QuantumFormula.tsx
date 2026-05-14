"use client";

/**
 * Render a LaTeX expression with KaTeX.
 *
 * This is the single component every other math-aware component in the app
 * delegates to. Centralising the rendering here keeps the rest of the code
 * free of KaTeX details and makes it easy to swap implementations or tweak
 * accessibility hooks in one place.
 *
 * Sizing model:
 *   - ``size`` (sm/md/lg) sets the wrapper ``font-size`` in em-friendly Tailwind
 *     classes. KaTeX inherits and rescales internally because its layout is
 *     expressed in em units.
 *   - ``compact`` strips the default block-mode vertical margin/padding so the
 *     formula can sit flush inside dense containers (e.g. the timeline step
 *     cards). It is a no-op in inline mode.
 *   - The block mode keeps its native ``overflow-x-auto`` and now also adopts
 *     the global ``quantum-thin-scroll`` style so wide formulas never tear
 *     their parent layout.
 */

import { InlineMath, BlockMath } from "react-katex";

export type QuantumFormulaSize = "sm" | "md" | "lg";

export interface QuantumFormulaProps {
  expression: string;
  displayMode?: "inline" | "block";
  ariaLabel?: string;
  className?: string;
  size?: QuantumFormulaSize;
  compact?: boolean;
}

const SIZE_CLASS: Record<QuantumFormulaSize, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

export function QuantumFormula({
  expression,
  displayMode = "inline",
  ariaLabel,
  className,
  size = "md",
  compact = false,
}: QuantumFormulaProps) {
  const sizeClass = SIZE_CLASS[size];

  if (displayMode === "block") {
    return (
      <div
        className={[
          compact ? "" : "my-2 py-1",
          "overflow-x-auto text-center quantum-thin-scroll",
          sizeClass,
          className ?? "",
        ]
          .filter(Boolean)
          .join(" ")}
        role="math"
        aria-label={ariaLabel ?? expression}
      >
        <BlockMath math={expression} />
      </div>
    );
  }

  return (
    <span
      className={[
        compact ? "inline-block" : "inline-block align-baseline",
        sizeClass,
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
      role="math"
      aria-label={ariaLabel ?? expression}
    >
      <InlineMath math={expression} />
    </span>
  );
}
