"use client";

/**
 * Initial-state node: a pill on the left edge of a wire showing the
 * computational-basis ket the qubit starts in (``|0>`` or ``|1>``), with a
 * tiny wire label (`q0`, `q1`) right above so the diagram reads top-to-bottom
 * even before the simulation runs.
 */

import type { NodeProps } from "@xyflow/react";
import { Handle, Position } from "@xyflow/react";

import { QuantumFormula } from "@/components/quantum/QuantumFormula";
import type { QuantumStateNodeType } from "@/components/quantum/circuit/wireBuilders";

type StateNodeProps = NodeProps<QuantumStateNodeType>;

export function QuantumStateNode({ data }: StateNodeProps) {
  return (
    <div
      className="relative flex items-center"
      aria-label={`Initial state ${data.wireLabel} ket ${data.ket}`}
    >
      <span
        aria-hidden
        className="absolute -top-5 left-0 font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400"
      >
        {data.wireLabel}
      </span>
      <span
        className={[
          "inline-flex h-10 min-w-[3.5rem] items-center justify-center rounded-md border px-3 text-sm font-medium",
          "border-slate-300 bg-white text-slate-800 shadow-sm",
          "dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100",
        ].join(" ")}
      >
        <QuantumFormula expression={`\\lvert ${data.ket}\\rangle`} />
      </span>
      <Handle
        type="source"
        position={Position.Right}
        className="!h-2 !w-2 !border-0 !bg-transparent"
      />
    </div>
  );
}
