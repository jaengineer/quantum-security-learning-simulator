"use client";

/**
 * Measurement node: rendered as a rounded square with the canonical
 * "speedometer arc + needle" symbol used in textbook circuit diagrams.
 */

import { Handle, Position } from "@xyflow/react";

export function QuantumMeasurementNode() {
  return (
    <div
      className={[
        "relative flex h-12 w-12 items-center justify-center rounded-lg border shadow-sm",
        "border-slate-400 bg-white text-slate-700",
        "dark:border-slate-500 dark:bg-slate-900 dark:text-slate-100",
      ].join(" ")}
      aria-label="Measurement"
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!h-2 !w-2 !border-0 !bg-transparent"
      />
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6"
        aria-hidden
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 18 A 8 8 0 0 1 20 18" />
        <line x1="12" y1="18" x2="17" y2="9" />
      </svg>
      <Handle
        type="source"
        position={Position.Right}
        className="!h-2 !w-2 !border-0 !bg-transparent"
      />
    </div>
  );
}
