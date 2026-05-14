/**
 * Pure builders that translate a logical quantum circuit into a React-Flow
 * graph (`nodes` + `edges`). Keeping the layout logic here means the visual
 * canvas can stay declarative and the placement rules are independently
 * unit-testable.
 *
 * Coordinates are chosen so the diagram fits comfortably in a ~640px-wide
 * container without horizontal scroll on desktop, and the React-Flow
 * `fitView` prop handles smaller screens gracefully.
 */

import type { Edge, Node } from "@xyflow/react";

import type { InitialState } from "@/features/quantum/types";

/* ------------------------------------------------------------------ */
/* Node / edge type discriminators                                     */
/* ------------------------------------------------------------------ */

export type QuantumNodeKind =
  | "state"
  | "gate"
  | "measurement"
  | "control"
  | "target";

export interface QuantumStateNodeData extends Record<string, unknown> {
  kind: "state";
  ket: string;
  wireLabel: string;
}

export interface QuantumGateNodeData extends Record<string, unknown> {
  kind: "gate";
  symbol: "H" | "X";
  semantic: "active" | "superposition" | "entangled";
}

export interface QuantumMeasurementNodeData extends Record<string, unknown> {
  kind: "measurement";
}

export interface QuantumControlNodeData extends Record<string, unknown> {
  kind: "control";
}

export interface QuantumTargetNodeData extends Record<string, unknown> {
  kind: "target";
}

export type QuantumNodeData =
  | QuantumStateNodeData
  | QuantumGateNodeData
  | QuantumMeasurementNodeData
  | QuantumControlNodeData
  | QuantumTargetNodeData;

export type QuantumStateNodeType = Node<QuantumStateNodeData, "quantumState">;
export type QuantumGateNodeType = Node<QuantumGateNodeData, "quantumGate">;
export type QuantumMeasurementNodeType = Node<
  QuantumMeasurementNodeData,
  "quantumMeasurement"
>;
export type QuantumControlNodeType = Node<
  QuantumControlNodeData,
  "quantumControl"
>;
export type QuantumTargetNodeType = Node<
  QuantumTargetNodeData,
  "quantumTarget"
>;

export type QuantumNode =
  | QuantumStateNodeType
  | QuantumGateNodeType
  | QuantumMeasurementNodeType
  | QuantumControlNodeType
  | QuantumTargetNodeType;

export type QuantumEdgeKind = "wire" | "control-link";
export interface QuantumEdgeData extends Record<string, unknown> {
  kind: QuantumEdgeKind;
}
export type QuantumEdge = Edge<QuantumEdgeData>;

export interface QuantumCircuitGraph {
  nodes: QuantumNode[];
  edges: QuantumEdge[];
  width: number;
  height: number;
}

/* ------------------------------------------------------------------ */
/* Layout constants                                                    */
/* ------------------------------------------------------------------ */

const COLUMN_GAP = 130;
const WIRE_GAP = 110;
const START_X = 20;
const WIRE_Y_TOP = 40;
const WIRE_Y_BOTTOM = WIRE_Y_TOP + WIRE_GAP;

const NODE_TYPES = {
  STATE: "quantumState",
  GATE: "quantumGate",
  MEASUREMENT: "quantumMeasurement",
  CONTROL: "quantumControl",
  TARGET: "quantumTarget",
} as const;

const EDGE_TYPES = {
  WIRE: "quantumWire",
  CONTROL_LINK: "quantumControlLink",
} as const;

export const QUANTUM_NODE_TYPES_LOOKUP = NODE_TYPES;
export const QUANTUM_EDGE_TYPES_LOOKUP = EDGE_TYPES;

function column(index: number): number {
  return START_X + index * COLUMN_GAP;
}

/* ------------------------------------------------------------------ */
/* Hadamard graph                                                      */
/* ------------------------------------------------------------------ */

export function buildHadamardGraph(initialState: InitialState | string): QuantumCircuitGraph {
  const includesX = initialState === "1";
  const ket = initialState === "1" ? "1" : "0";

  const nodes: QuantumNode[] = [];
  const edges: QuantumEdge[] = [];

  let col = 0;

  const stateId = "h-state";
  nodes.push({
    id: stateId,
    type: NODE_TYPES.STATE,
    position: { x: column(col), y: WIRE_Y_TOP },
    data: { kind: "state", ket, wireLabel: "q0" },
    draggable: false,
    selectable: false,
  });
  col += 1;

  let previousId = stateId;

  if (includesX) {
    const xId = "h-x";
    nodes.push({
      id: xId,
      type: NODE_TYPES.GATE,
      position: { x: column(col), y: WIRE_Y_TOP },
      data: { kind: "gate", symbol: "X", semantic: "active" },
      draggable: false,
      selectable: false,
    });
    edges.push({
      id: `e-${previousId}-${xId}`,
      source: previousId,
      target: xId,
      type: EDGE_TYPES.WIRE,
      data: { kind: "wire" },
    });
    previousId = xId;
    col += 1;
  }

  const hId = "h-h";
  nodes.push({
    id: hId,
    type: NODE_TYPES.GATE,
    position: { x: column(col), y: WIRE_Y_TOP },
    data: { kind: "gate", symbol: "H", semantic: "superposition" },
    draggable: false,
    selectable: false,
  });
  edges.push({
    id: `e-${previousId}-${hId}`,
    source: previousId,
    target: hId,
    type: EDGE_TYPES.WIRE,
    data: { kind: "wire" },
  });
  previousId = hId;
  col += 1;

  const measureId = "h-measure";
  nodes.push({
    id: measureId,
    type: NODE_TYPES.MEASUREMENT,
    position: { x: column(col), y: WIRE_Y_TOP },
    data: { kind: "measurement" },
    draggable: false,
    selectable: false,
  });
  edges.push({
    id: `e-${previousId}-${measureId}`,
    source: previousId,
    target: measureId,
    type: EDGE_TYPES.WIRE,
    data: { kind: "wire" },
  });

  return {
    nodes,
    edges,
    width: column(col) + 120,
    height: WIRE_Y_TOP + 80,
  };
}

/* ------------------------------------------------------------------ */
/* Bell-state graph                                                    */
/* ------------------------------------------------------------------ */

export function buildBellGraph(): QuantumCircuitGraph {
  const nodes: QuantumNode[] = [];
  const edges: QuantumEdge[] = [];

  const q0State = "b-q0-state";
  const q0H = "b-q0-h";
  const q0Control = "b-q0-control";
  const q0Measure = "b-q0-measure";

  const q1State = "b-q1-state";
  const q1Target = "b-q1-target";
  const q1Measure = "b-q1-measure";

  // q0 wire
  nodes.push(
    {
      id: q0State,
      type: NODE_TYPES.STATE,
      position: { x: column(0), y: WIRE_Y_TOP },
      data: { kind: "state", ket: "0", wireLabel: "q0" },
      draggable: false,
      selectable: false,
    },
    {
      id: q0H,
      type: NODE_TYPES.GATE,
      position: { x: column(1), y: WIRE_Y_TOP },
      data: { kind: "gate", symbol: "H", semantic: "superposition" },
      draggable: false,
      selectable: false,
    },
    {
      id: q0Control,
      type: NODE_TYPES.CONTROL,
      position: { x: column(2), y: WIRE_Y_TOP },
      data: { kind: "control" },
      draggable: false,
      selectable: false,
    },
    {
      id: q0Measure,
      type: NODE_TYPES.MEASUREMENT,
      position: { x: column(3), y: WIRE_Y_TOP },
      data: { kind: "measurement" },
      draggable: false,
      selectable: false,
    }
  );

  // q1 wire
  nodes.push(
    {
      id: q1State,
      type: NODE_TYPES.STATE,
      position: { x: column(0), y: WIRE_Y_BOTTOM },
      data: { kind: "state", ket: "0", wireLabel: "q1" },
      draggable: false,
      selectable: false,
    },
    {
      id: q1Target,
      type: NODE_TYPES.TARGET,
      position: { x: column(2), y: WIRE_Y_BOTTOM },
      data: { kind: "target" },
      draggable: false,
      selectable: false,
    },
    {
      id: q1Measure,
      type: NODE_TYPES.MEASUREMENT,
      position: { x: column(3), y: WIRE_Y_BOTTOM },
      data: { kind: "measurement" },
      draggable: false,
      selectable: false,
    }
  );

  // Horizontal wires q0
  edges.push(
    {
      id: `e-${q0State}-${q0H}`,
      source: q0State,
      target: q0H,
      type: EDGE_TYPES.WIRE,
      data: { kind: "wire" },
    },
    {
      id: `e-${q0H}-${q0Control}`,
      source: q0H,
      target: q0Control,
      type: EDGE_TYPES.WIRE,
      data: { kind: "wire" },
    },
    {
      id: `e-${q0Control}-${q0Measure}`,
      source: q0Control,
      target: q0Measure,
      type: EDGE_TYPES.WIRE,
      data: { kind: "wire" },
    }
  );

  // Horizontal wires q1
  edges.push(
    {
      id: `e-${q1State}-${q1Target}`,
      source: q1State,
      target: q1Target,
      type: EDGE_TYPES.WIRE,
      data: { kind: "wire" },
    },
    {
      id: `e-${q1Target}-${q1Measure}`,
      source: q1Target,
      target: q1Measure,
      type: EDGE_TYPES.WIRE,
      data: { kind: "wire" },
    }
  );

  // Vertical CNOT link
  edges.push({
    id: `e-${q0Control}-${q1Target}`,
    source: q0Control,
    target: q1Target,
    sourceHandle: "bottom",
    targetHandle: "top",
    type: EDGE_TYPES.CONTROL_LINK,
    data: { kind: "control-link" },
  });

  return {
    nodes,
    edges,
    width: column(3) + 120,
    height: WIRE_Y_BOTTOM + 80,
  };
}
