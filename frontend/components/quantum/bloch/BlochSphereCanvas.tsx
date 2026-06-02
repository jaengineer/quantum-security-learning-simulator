"use client";

/**
 * Backwards-compatible adapter for the legacy gate-based Bloch sphere API.
 *
 * Older consumers of this module expect to pass an ``initialState`` plus a
 * sequence of ``appliedGates`` and get an animated 3D sphere back. We
 * preserve that surface here so nothing breaks, but delegate the actual
 * rendering to the new visualization-only primitive ``BlochSphere3D`` —
 * keeping a single canonical scene across the codebase.
 *
 * The math (gate → coordinates) still lives in ``blochMath.ts`` so the
 * adapter only does data shaping; ``BlochSphere3D`` itself never imports
 * anything from the math module.
 */

import { useMemo } from "react";

import { BlochSphere3D } from "./BlochSphere3D";
import type { SingleQubitGate, SupportedKet } from "./blochMath";
import { applyGates } from "./blochMath";

export interface BlochSphereCanvasProps {
  initialState: "0" | "1";
  appliedGates?: ReadonlyArray<SingleQubitGate>;
  animate?: boolean;
}

export function BlochSphereCanvas({
  initialState,
  appliedGates = [],
  animate = true,
}: BlochSphereCanvasProps) {
  const target = useMemo(() => {
    const start: SupportedKet = initialState === "1" ? "1" : "0";
    return applyGates(start, appliedGates);
  }, [initialState, appliedGates]);

  return (
    <BlochSphere3D
      x={target.x}
      y={target.y}
      z={target.z}
      animate={animate}
      showLabels
      showControls
      showTrajectory={false}
    />
  );
}
