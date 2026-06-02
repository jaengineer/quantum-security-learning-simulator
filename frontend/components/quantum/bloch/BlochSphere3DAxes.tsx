"use client";

/**
 * Static decoration of the 3D Bloch sphere primitive:
 *
 *   - transparent unit sphere
 *   - subtle wireframe sphere overlay
 *   - X, Y and Z axes drawn as arrows (line + conical tip on the positive end)
 *   - italic ``x`` / ``y`` / ``z`` labels next to each arrow tip
 *   - dashed equator (XY plane) and two faint meridians (XZ, YZ planes)
 *
 * Kept as a leaf component so the host scene can mount/unmount it freely.
 * No reactive props: the geometry only depends on constants.
 */

import { Html, Line } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";

import { QUANTUM_COLORS } from "@/styles/quantum-theme";

import { buildCirclePoints } from "./bloch3d-math";

// Axes extend visibly past the sphere surface (radius 1) so the arrow
// tips read as cardinal direction indicators on their own, matching the
// academic reference image.
const AXIS_LENGTH = 1.28;
const ARROW_HEAD_LENGTH = 0.11;
const ARROW_HEAD_RADIUS = 0.038;
const AXIS_LABEL_OFFSET = 1.36;

const SPHERE_COLOR = QUANTUM_COLORS.quantumViolet;
const EQUATOR_COLOR = QUANTUM_COLORS.scientificGraySoft;
const MERIDIAN_COLOR = QUANTUM_COLORS.scientificGraySoft;
/**
 * Single dark slate-700 tone for all three axes and their arrow tips,
 * matching the reference figure. Keeping one tone (instead of contrasting
 * vertical / horizontal) lets the colored state vector and basis dots
 * carry all the chromatic weight.
 */
const AXIS_COLOR = "#334155";
const AXIS_OPACITY = 0.9;

const AXIS_LABEL_CLASSNAME = [
  "pointer-events-none select-none font-serif italic text-xl font-bold leading-none",
  "text-slate-700 drop-shadow-sm dark:text-slate-200",
].join(" ");

export function BlochSphere3DAxes() {
  const equator = useMemo(() => buildCirclePoints("xy", 64), []);
  const meridianXZ = useMemo(() => buildCirclePoints("xz", 64), []);
  const meridianYZ = useMemo(() => buildCirclePoints("yz", 64), []);
  const wireframeGeometry = useMemo(
    () => new THREE.SphereGeometry(1, 24, 16),
    []
  );

  return (
    <group>
      <mesh>
        <sphereGeometry args={[1, 32, 24]} />
        <meshBasicMaterial
          color={SPHERE_COLOR}
          transparent
          opacity={0.08}
          depthWrite={false}
        />
      </mesh>

      <lineSegments>
        <wireframeGeometry args={[wireframeGeometry]} />
        <lineBasicMaterial
          color={EQUATOR_COLOR}
          transparent
          opacity={0.12}
          depthWrite={false}
        />
      </lineSegments>

      {/*
        Dashed equator (XY plane) — the meaningful reference line. Drawn
        slightly more prominently than the curvature-only meridians.
      */}
      <Line
        points={equator}
        color={EQUATOR_COLOR}
        opacity={0.35}
        transparent
        lineWidth={1}
        dashed
        dashSize={0.08}
        gapSize={0.05}
      />
      <Line
        points={meridianXZ}
        color={MERIDIAN_COLOR}
        opacity={0.18}
        transparent
        lineWidth={1}
      />
      <Line
        points={meridianYZ}
        color={MERIDIAN_COLOR}
        opacity={0.18}
        transparent
        lineWidth={1}
      />

      {/*
        Three axes drawn symmetrically through the origin, all sharing the
        same dark slate tone so the colored state vector and basis dots
        remain the chromatic focus.
      */}
      <Line
        points={[
          [-AXIS_LENGTH, 0, 0],
          [AXIS_LENGTH, 0, 0],
        ]}
        color={AXIS_COLOR}
        opacity={AXIS_OPACITY}
        transparent
        lineWidth={1.4}
      />
      <Line
        points={[
          [0, -AXIS_LENGTH, 0],
          [0, AXIS_LENGTH, 0],
        ]}
        color={AXIS_COLOR}
        opacity={AXIS_OPACITY}
        transparent
        lineWidth={1.4}
      />
      <Line
        points={[
          [0, 0, -AXIS_LENGTH],
          [0, 0, AXIS_LENGTH],
        ]}
        color={AXIS_COLOR}
        opacity={AXIS_OPACITY}
        transparent
        lineWidth={1.4}
      />

      {/*
        Conical arrow tips at the positive end of each axis. Three.js cones
        point along their local +Y axis by default, so we rotate each cone
        so its local +Y aligns with the world axis it terminates.
      */}
      <mesh
        position={[AXIS_LENGTH, 0, 0]}
        rotation={[0, 0, -Math.PI / 2]}
      >
        <coneGeometry args={[ARROW_HEAD_RADIUS, ARROW_HEAD_LENGTH, 16]} />
        <meshStandardMaterial
          color={AXIS_COLOR}
          roughness={0.55}
          metalness={0}
        />
      </mesh>
      <mesh position={[0, AXIS_LENGTH, 0]}>
        <coneGeometry args={[ARROW_HEAD_RADIUS, ARROW_HEAD_LENGTH, 16]} />
        <meshStandardMaterial
          color={AXIS_COLOR}
          roughness={0.55}
          metalness={0}
        />
      </mesh>
      <mesh
        position={[0, 0, AXIS_LENGTH]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <coneGeometry args={[ARROW_HEAD_RADIUS, ARROW_HEAD_LENGTH, 16]} />
        <meshStandardMaterial
          color={AXIS_COLOR}
          roughness={0.55}
          metalness={0}
        />
      </mesh>

      {/*
        Italic x / y / z labels at the positive tips. Plain coordinate
        indicators — no tooltips here; the basis-state tooltips live on the
        |ket\u27e9 labels in BlochLabels.
      */}
      <Html
        position={[AXIS_LABEL_OFFSET, 0, 0]}
        center
        distanceFactor={6}
      >
        <span
          className={AXIS_LABEL_CLASSNAME}
          style={{ transform: "translate(-1px, 1px)" }}
        >
          x
        </span>
      </Html>
      <Html
        position={[0, AXIS_LABEL_OFFSET, 0]}
        center
        distanceFactor={6}
      >
        <span
          className={AXIS_LABEL_CLASSNAME}
          style={{ transform: "translateX(1px)" }}
        >
          y
        </span>
      </Html>
      <Html
        position={[0, 0, AXIS_LABEL_OFFSET]}
        center
        distanceFactor={6}
      >
        <span
          className={AXIS_LABEL_CLASSNAME}
          style={{ transform: "translateY(-1px)" }}
        >
          z
        </span>
      </Html>
    </group>
  );
}
