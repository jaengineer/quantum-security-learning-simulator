"use client";

/**
 * Optional trajectory overlay for the 3D Bloch sphere.
 *
 * Renders a faded polyline that traces the path through Bloch space plus a
 * small dot at every sample. Direction-of-time is conveyed by a per-dot
 * opacity ramp: the earliest point is dim, the latest is fully bright.
 *
 * Hover-ready metadata (MVP wiring only — no visible tooltip yet):
 *   - Every dot mesh keeps the full ``TrajectoryPoint`` shape attached to
 *     ``mesh.userData.blochPoint`` so a future Phase 6 educational overlay
 *     can read the applied gate / Dirac state / step label without an API
 *     refactor.
 *   - When ``onHover`` is provided, ``onPointerOver`` / ``onPointerOut``
 *     handlers are attached to each dot and bubble the metadata back to
 *     the host (which is responsible for rendering whatever UI it wants).
 *     When ``onHover`` is undefined, no handlers are attached and there is
 *     zero per-pointer cost.
 *
 * Heavy work (line geometry, dot positions) is memoised on the
 * ``trajectory`` reference. Consumers should keep the trajectory array
 * stable across renders when the underlying data has not changed.
 */

import { Line } from "@react-three/drei";
import { useMemo } from "react";
import type { ThreeEvent } from "@react-three/fiber";

import { QUANTUM_COLORS, QUANTUM_STATE_COLORS } from "@/styles/quantum-theme";

export interface TrajectoryPoint {
  x: number;
  y: number;
  z: number;
  /** Identifier of the gate that produced this point (future tooltip). */
  gateId?: string;
  /** Dirac-notation label for the state at this point (e.g. ``|+i⟩``). */
  stateLabel?: string;
  /** Step heading / index displayed in future tooltips. */
  stepLabel?: string;
}

/**
 * Shape stored on each dot mesh's ``userData.blochPoint``. Re-exported so
 * future consumers can read it back type-safely from
 * ``intersection.object.userData.blochPoint``.
 */
export type BlochTrajectoryDotMeta = Readonly<{
  x: number;
  y: number;
  z: number;
  gateId?: string;
  stateLabel?: string;
  stepLabel?: string;
  /** Position of this point inside the trajectory array. */
  index: number;
}>;

interface BlochSphere3DTrajectoryProps {
  trajectory: ReadonlyArray<TrajectoryPoint>;
  color?: string;
  dotColor?: string;
  /**
   * Optional hover callback fired with the metadata of the dot under the
   * pointer, or ``null`` when the pointer leaves. MVP only — this component
   * never renders a tooltip itself.
   */
  onHover?: (point: TrajectoryPoint | null) => void;
}

const DOT_RADIUS = 0.026;
// Earlier points are dimmer; the latest point is fully opaque. This makes the
// direction-of-time legible at a glance and keeps trajectory dots below the
// hero state vector in the visual hierarchy.
const MIN_DOT_OPACITY = 0.20;

export function BlochSphere3DTrajectory({
  trajectory,
  color = QUANTUM_COLORS.quantumVioletDim,
  dotColor = QUANTUM_STATE_COLORS.active.dim,
  onHover,
}: BlochSphere3DTrajectoryProps) {
  const linePoints = useMemo<[number, number, number][]>(
    () => trajectory.map((p) => [p.x, p.y, p.z]),
    [trajectory]
  );

  if (trajectory.length === 0) return null;

  const lastIndex = Math.max(trajectory.length - 1, 1);

  return (
    <group>
      {linePoints.length >= 2 ? (
        <Line
          points={linePoints}
          color={color}
          opacity={0.55}
          transparent
          lineWidth={1.6}
          dashed={false}
        />
      ) : null}

      {trajectory.map((point, index) => {
        const ramp = index / lastIndex;
        const opacity = MIN_DOT_OPACITY + (1 - MIN_DOT_OPACITY) * ramp;
        const meta: BlochTrajectoryDotMeta = {
          x: point.x,
          y: point.y,
          z: point.z,
          gateId: point.gateId,
          stateLabel: point.stateLabel,
          stepLabel: point.stepLabel,
          index,
        };

        const handlePointerOver = onHover
          ? (event: ThreeEvent<PointerEvent>) => {
              event.stopPropagation();
              onHover(point);
            }
          : undefined;
        const handlePointerOut = onHover
          ? (event: ThreeEvent<PointerEvent>) => {
              event.stopPropagation();
              onHover(null);
            }
          : undefined;

        return (
          // TODO(Phase 6): mount the educational tooltip layer here. The
          // metadata required (gateId, stateLabel, stepLabel, position) is
          // already attached to userData.blochPoint and bubbled through
          // ``onHover`` when the host provides one.
          //
          // Phase 6 step-numbering slot: if ``point.stepLabel`` is provided
          // (e.g. "1", "②", "Step 3"), a sibling <Html distanceFactor={8}>
          // badge can be mounted here without touching the API or geometry.
          // Today we intentionally render nothing for it so the visual
          // hierarchy stays focused on the hero state vector.
          <mesh
            key={`${index}-${point.x}-${point.y}-${point.z}`}
            position={[point.x, point.y, point.z]}
            userData={{ blochPoint: meta }}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
          >
            <sphereGeometry args={[DOT_RADIUS, 12, 12]} />
            <meshStandardMaterial
              color={dotColor}
              emissive={dotColor}
              emissiveIntensity={0.40}
              metalness={0.0}
              roughness={0.55}
              transparent
              opacity={opacity}
            />
          </mesh>
        );
      })}
    </group>
  );
}
