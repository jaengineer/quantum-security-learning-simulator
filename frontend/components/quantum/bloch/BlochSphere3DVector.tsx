"use client";

/**
 * Animated Bloch state vector: a cylindrical stem from the origin and a
 * sphere marker at the tip.
 *
 * The tip position comes from a ``THREE.Vector3`` ref animated outside
 * React by ``useBlochVector3DAnimation``; we copy from it every frame in
 * ``useFrame`` so the React tree does not re-render during the animation.
 */

import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

import { QUANTUM_STATE_COLORS } from "@/styles/quantum-theme";

import type { BlochVector3 } from "./bloch3d-math";
import { useBlochVector3DAnimation } from "./useBlochVector3DAnimation";

interface BlochSphere3DVectorProps {
  target: BlochVector3;
  animate: boolean;
  color?: string;
  /** Notified each time the animation starts/stops so the host can adjust frameloop. */
  onAnimatingChange?: (animating: boolean) => void;
}

const ORIGIN = new THREE.Vector3(0, 0, 0);
const STEM_RADIUS = 0.022;
const TIP_RADIUS = 0.058;
const HALO_RADIUS = 0.14;

export function BlochSphere3DVector({
  target,
  animate,
  color = QUANTUM_STATE_COLORS.active.base,
  onAnimatingChange,
}: BlochSphere3DVectorProps) {
  const { vectorRef, isAnimating } = useBlochVector3DAnimation(target, animate);
  const stemRef = useRef<THREE.Mesh>(null);
  const tipRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const quaternion = useRef(new THREE.Quaternion());
  const up = useRef(new THREE.Vector3(0, 1, 0));

  // Bubble the animation state up to the host scene so it can toggle
  // ``frameloop`` between "always" (while animating) and "demand" (idle).
  useEffect(() => {
    onAnimatingChange?.(isAnimating);
  }, [isAnimating, onAnimatingChange]);

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
    if (haloRef.current) haloRef.current.position.copy(v);
  });

  return (
    <group>
      <mesh ref={stemRef} position={ORIGIN}>
        <cylinderGeometry args={[STEM_RADIUS, STEM_RADIUS, 1, 12]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.20}
          metalness={0.1}
          roughness={0.5}
        />
      </mesh>
      <mesh ref={tipRef}>
        <sphereGeometry args={[TIP_RADIUS, 18, 18]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.90}
          metalness={0.1}
          roughness={0.35}
        />
      </mesh>
      {/*
        Additive-blend halo: a cheap academic "bulb" glow that nudges the
        endpoint to the top of the visual hierarchy without a post-processing
        bloom pass. Tasteful, not neon.
      */}
      <mesh ref={haloRef} renderOrder={2}>
        <sphereGeometry args={[HALO_RADIUS, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.22}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
