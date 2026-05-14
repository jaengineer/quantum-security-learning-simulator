"use client";

/**
 * Static decoration of the Bloch sphere: a wireframe unit sphere, three
 * coordinate axes and the equator on the XY plane. Kept as a separate
 * component so it remounts trivially with the rest of the scene.
 */

import { Line } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";

import { QUANTUM_COLORS } from "@/styles/quantum-theme";

const AXIS_LENGTH = 1.25;
const SPHERE_COLOR = QUANTUM_COLORS.quantumViolet;
const EQUATOR_COLOR = QUANTUM_COLORS.scientificGraySoft;
const HORIZONTAL_AXIS_COLOR = "#64748b";
const VERTICAL_AXIS_COLOR = "#475569";

function buildEquatorPoints(): [number, number, number][] {
  const segments = 64;
  const points: [number, number, number][] = [];
  for (let i = 0; i <= segments; i += 1) {
    const theta = (i / segments) * Math.PI * 2;
    points.push([Math.cos(theta), Math.sin(theta), 0]);
  }
  return points;
}

export function BlochAxes() {
  const equator = useMemo(() => buildEquatorPoints(), []);

  return (
    <group>
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color={SPHERE_COLOR}
          transparent
          opacity={0.06}
          depthWrite={false}
        />
      </mesh>
      <lineSegments>
        <wireframeGeometry args={[new THREE.SphereGeometry(1, 24, 16)]} />
        <lineBasicMaterial
          color={EQUATOR_COLOR}
          transparent
          opacity={0.18}
          depthWrite={false}
        />
      </lineSegments>

      <Line
        points={equator}
        color={EQUATOR_COLOR}
        opacity={0.45}
        transparent
        lineWidth={1}
      />

      <Line
        points={[
          [-AXIS_LENGTH, 0, 0],
          [AXIS_LENGTH, 0, 0],
        ]}
        color={HORIZONTAL_AXIS_COLOR}
        lineWidth={1.2}
      />
      <Line
        points={[
          [0, -AXIS_LENGTH, 0],
          [0, AXIS_LENGTH, 0],
        ]}
        color={HORIZONTAL_AXIS_COLOR}
        lineWidth={1.2}
      />
      <Line
        points={[
          [0, 0, -AXIS_LENGTH],
          [0, 0, AXIS_LENGTH],
        ]}
        color={VERTICAL_AXIS_COLOR}
        lineWidth={1.4}
      />
    </group>
  );
}
