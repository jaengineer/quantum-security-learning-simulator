"use client";

/**
 * Straight-line edge used both for horizontal quantum wires and for the
 * vertical CNOT control-link. The component picks its style from
 * ``data.kind``:
 *
 *  - ``wire``         — quantum register wire connecting consecutive gates.
 *  - ``control-link`` — vertical line connecting a control dot on q0 to the
 *                       target (XOR) symbol on q1 of a CNOT gate.
 */

import type { EdgeProps } from "@xyflow/react";
import { BaseEdge, getStraightPath } from "@xyflow/react";

import type { QuantumEdgeData } from "@/components/quantum/circuit/wireBuilders";

interface QuantumWireProps extends EdgeProps {
  data?: QuantumEdgeData;
}

export function QuantumWire({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
  markerEnd,
}: QuantumWireProps) {
  const [edgePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const isControlLink = data?.kind === "control-link";

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      markerEnd={markerEnd}
      style={{
        stroke: "var(--quantum-wire-color, #94a3b8)",
        strokeWidth: isControlLink ? 1.6 : 1.4,
        strokeDasharray: undefined,
      }}
    />
  );
}
