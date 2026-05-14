"use client";

/**
 * Square gate node used for ``H`` and ``X`` (any future single-qubit gate
 * follows the same shape). The component exposes left/right wire handles so
 * React-Flow can route horizontal edges through the gate.
 *
 * A subtle Framer Motion pulse animates while the simulation is running, set
 * via the `data-running` attribute on the parent ReactFlow container.
 */

import type { NodeProps } from "@xyflow/react";
import { Handle, Position } from "@xyflow/react";
import { motion } from "framer-motion";

import type {
  QuantumGateNodeData,
  QuantumGateNodeType,
} from "@/components/quantum/circuit/wireBuilders";

type GateNodeProps = NodeProps<QuantumGateNodeType>;

function semanticClasses(semantic: QuantumGateNodeData["semantic"]): string {
  switch (semantic) {
    case "superposition":
      return "border-violet-500/70 bg-violet-50 text-violet-700 dark:border-violet-400/70 dark:bg-violet-950/40 dark:text-violet-200";
    case "entangled":
      return "border-fuchsia-500/70 bg-fuchsia-50 text-fuchsia-700 dark:border-fuchsia-400/70 dark:bg-fuchsia-950/40 dark:text-fuchsia-200";
    case "active":
    default:
      return "border-cyan-500/70 bg-cyan-50 text-cyan-800 dark:border-cyan-400/70 dark:bg-cyan-950/40 dark:text-cyan-200";
  }
}

export function QuantumGateNode({ data }: GateNodeProps) {
  return (
    <motion.div
      className={[
        "relative flex h-12 w-12 items-center justify-center rounded-lg border text-base font-semibold shadow-sm",
        "transition-colors",
        semanticClasses(data.semantic),
      ].join(" ")}
      initial={false}
      animate={{ scale: [1, 1.04, 1] }}
      transition={{
        duration: 0.6,
        repeat: Infinity,
        repeatDelay: 1.2,
        ease: "easeInOut",
      }}
      aria-label={`Quantum gate ${data.symbol}`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!h-2 !w-2 !border-0 !bg-transparent"
      />
      <span className="font-mono">{data.symbol}</span>
      <Handle
        type="source"
        position={Position.Right}
        className="!h-2 !w-2 !border-0 !bg-transparent"
      />
    </motion.div>
  );
}
