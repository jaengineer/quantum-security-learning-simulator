"use client";

/**
 * Render a LaTeX expression with KaTeX.
 *
 * This is the single component every other math-aware component in the app
 * delegates to. Centralising the rendering here keeps the rest of the code
 * free of KaTeX details and makes it easy to swap implementations or tweak
 * accessibility hooks in one place.
 */

import { InlineMath, BlockMath } from "react-katex";

export interface QuantumFormulaProps {
  expression: string;
  displayMode?: "inline" | "block";
  ariaLabel?: string;
  className?: string;
}

export function QuantumFormula({
  expression,
  displayMode = "inline",
  ariaLabel,
  className,
}: QuantumFormulaProps) {
  if (displayMode === "block") {
    return (
      <div
        className={[
          "my-2 overflow-x-auto py-1 text-center",
          className ?? "",
        ].join(" ")}
        role="math"
        aria-label={ariaLabel ?? expression}
      >
        <BlockMath math={expression} />
      </div>
    );
  }

  return (
    <span
      className={["inline-block align-baseline", className ?? ""].join(" ")}
      role="math"
      aria-label={ariaLabel ?? expression}
    >
      <InlineMath math={expression} />
    </span>
  );
}
