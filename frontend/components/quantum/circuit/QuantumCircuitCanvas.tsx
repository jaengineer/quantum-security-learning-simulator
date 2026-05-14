"use client";

/**
 * Public component that renders a quantum circuit either as a visual
 * React-Flow graph (``visualMode="advanced"``, default) or as the textual
 * fallback (``visualMode="simple"``, the legacy ``CircuitDiagram`` kept for
 * print/screen-reader friendly contexts).
 *
 * The canvas is decorative: nodes are not draggable, the viewport is locked
 * with ``fitView`` and panning/zoom are disabled so the diagram behaves like
 * an inline figure rather than a graph editor.
 */

import {
  Background,
  BackgroundVariant,
  ReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import { useMemo } from "react";

import { CircuitDiagram } from "@/features/quantum/components/CircuitDiagram";
import type { InitialState } from "@/features/quantum/types";

import { QuantumCircuitLegend } from "./QuantumCircuitLegend";
import {
  QuantumControlNode,
  QuantumTargetNode,
} from "./QuantumControlNode";
import { QuantumGateNode } from "./QuantumGateNode";
import { QuantumMeasurementNode } from "./QuantumMeasurementNode";
import { QuantumStateNode } from "./QuantumStateNode";
import { QuantumWire } from "./QuantumWire";
import {
  QUANTUM_EDGE_TYPES_LOOKUP,
  QUANTUM_NODE_TYPES_LOOKUP,
  buildBellGraph,
  buildHadamardGraph,
} from "./wireBuilders";

import "@xyflow/react/dist/style.css";

const NODE_TYPES = {
  [QUANTUM_NODE_TYPES_LOOKUP.STATE]: QuantumStateNode,
  [QUANTUM_NODE_TYPES_LOOKUP.GATE]: QuantumGateNode,
  [QUANTUM_NODE_TYPES_LOOKUP.MEASUREMENT]: QuantumMeasurementNode,
  [QUANTUM_NODE_TYPES_LOOKUP.CONTROL]: QuantumControlNode,
  [QUANTUM_NODE_TYPES_LOOKUP.TARGET]: QuantumTargetNode,
} as const;

const EDGE_TYPES = {
  [QUANTUM_EDGE_TYPES_LOOKUP.WIRE]: QuantumWire,
  [QUANTUM_EDGE_TYPES_LOOKUP.CONTROL_LINK]: QuantumWire,
} as const;

export type CircuitVariant = "hadamard" | "bell";
export type CircuitVisualMode = "simple" | "advanced";

export interface QuantumCircuitCanvasProps {
  variant: CircuitVariant;
  initialState?: InitialState | string;
  isRunning?: boolean;
  visualMode?: CircuitVisualMode;
}

function CanvasInner({
  variant,
  initialState = "0",
  isRunning = false,
}: Required<Omit<QuantumCircuitCanvasProps, "visualMode">>) {
  const graph = useMemo(() => {
    return variant === "bell"
      ? buildBellGraph()
      : buildHadamardGraph(initialState);
  }, [variant, initialState]);

  return (
    <div
      data-running={isRunning ? "true" : "false"}
      className={[
        "relative w-full overflow-hidden rounded-xl border transition-shadow duration-300",
        "border-slate-200 bg-slate-50/60",
        "dark:border-slate-800 dark:bg-slate-900/40",
      ].join(" ")}
      style={{
        height: graph.height + 80,
        boxShadow: isRunning ? "var(--glow-quantum-violet)" : undefined,
      }}
    >
      <ReactFlow
        nodes={graph.nodes}
        edges={graph.edges}
        nodeTypes={NODE_TYPES}
        edgeTypes={EDGE_TYPES}
        fitView
        fitViewOptions={{ padding: 0.2, includeHiddenNodes: false }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={false}
        panOnScroll={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        preventScrolling={false}
        proOptions={{ hideAttribution: true }}
        aria-label={`Quantum circuit diagram (${variant})`}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          className="!text-slate-300 dark:!text-slate-700"
        />
      </ReactFlow>
    </div>
  );
}

export function QuantumCircuitCanvas({
  variant,
  initialState = "0",
  isRunning = false,
  visualMode = "advanced",
}: QuantumCircuitCanvasProps) {
  if (visualMode === "simple") {
    return <CircuitDiagram variant={variant} initialState={initialState} />;
  }

  return (
    <div className="flex flex-col gap-2">
      <ReactFlowProvider>
        <CanvasInner
          variant={variant}
          initialState={initialState}
          isRunning={isRunning}
        />
      </ReactFlowProvider>
      <QuantumCircuitLegend />
    </div>
  );
}
