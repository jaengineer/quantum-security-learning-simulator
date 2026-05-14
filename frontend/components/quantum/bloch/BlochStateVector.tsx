"use client";

/**
 * Animated state vector: a cylindrical "stem" from the origin plus a small
 * sphere at the tip. The tip position is updated every frame from the
 * three.js Vector3 ref provided by ``useBlochAnimation`` so the React tree
 * does not re-render during the animation.
 */

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

import { QUANTUM_STATE_COLORS } from "@/styles/quantum-theme";

import type { BlochVector } from "./blochMath";
import { useBlochAnimation } from "./BlochAnimationController";

interface BlochStateVectorProps {
  source: BlochVector;
  target: BlochVector;
  animate: boolean;
  color?: string;
}

const ORIGIN = new THREE.Vector3(0, 0, 0);
const RADIUS = 0.025;

export function BlochStateVector({
  source,
  target,
  animate,
  color = QUANTUM_STATE_COLORS.active.base,
}: BlochStateVectorProps) {
  const { vectorRef } = useBlochAnimation(source, target, animate);
  const stemRef = useRef<THREE.Mesh>(null);
  const tipRef = useRef<THREE.Mesh>(null);
  const quaternion = useRef(new THREE.Quaternion());
  const up = useRef(new THREE.Vector3(0, 1, 0));

  useFrame(() => {
    const v = vectorRef.current;
    if (!stemRef.current || !tipRef.current) return;

    const length = Math.max(v.length(), 1e-4);
    stemRef.current.scale.set(1, length, 1);
    stemRef.current.position.copy(v).multiplyScalar(0.5);

    quaternion.current.setFromUnitVectors(
      up.current,
      v.clone().normalize()
    );
    stemRef.current.quaternion.copy(quaternion.current);

    tipRef.current.position.copy(v);
  });

  return (
    <group>
      <mesh ref={stemRef} position={ORIGIN}>
        <cylinderGeometry args={[RADIUS, RADIUS, 1, 12]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.45}
          metalness={0.1}
          roughness={0.5}
        />
      </mesh>
      <mesh ref={tipRef}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.65}
          metalness={0.1}
          roughness={0.4}
        />
      </mesh>
    </group>
  );
}
