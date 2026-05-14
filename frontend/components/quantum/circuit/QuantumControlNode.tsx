"use client";

/**
 * Control and target nodes for the CNOT (CX) gate.
 *
 * - The control is a small filled dot on the q0 wire.
 * - The target is a circle with a cross inside (canonical XOR symbol ``⊕``).
 *
 * A vertical edge ("control-link") connects the bottom handle of the control
 * to the top handle of the target, drawn by the dedicated edge component.
 */

import { Handle, Position } from "@xyflow/react";

export function QuantumControlNode() {
  return (
    <div
      className="relative flex h-12 w-12 items-center justify-center"
      aria-label="Control qubit"
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!h-2 !w-2 !border-0 !bg-transparent"
      />
      <span
        aria-hidden
        className={[
          "block h-3.5 w-3.5 rounded-full",
          "bg-slate-900 dark:bg-slate-100",
        ].join(" ")}
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!h-2 !w-2 !border-0 !bg-transparent"
      />
      <Handle
        id="bottom"
        type="source"
        position={Position.Bottom}
        className="!h-2 !w-2 !border-0 !bg-transparent"
      />
    </div>
  );
}

export function QuantumTargetNode() {
  return (
    <div
      className="relative flex h-12 w-12 items-center justify-center"
      aria-label="Target qubit"
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!h-2 !w-2 !border-0 !bg-transparent"
      />
      <Handle
        id="top"
        type="target"
        position={Position.Top}
        className="!h-2 !w-2 !border-0 !bg-transparent"
      />
      <svg
        viewBox="0 0 24 24"
        className={[
          "h-7 w-7 text-slate-900 dark:text-slate-100",
        ].join(" ")}
        aria-hidden
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <circle cx="12" cy="12" r="9" />
        <line x1="12" y1="3" x2="12" y2="21" />
        <line x1="3" y1="12" x2="21" y2="12" />
      </svg>
      <Handle
        type="source"
        position={Position.Right}
        className="!h-2 !w-2 !border-0 !bg-transparent"
      />
    </div>
  );
}
