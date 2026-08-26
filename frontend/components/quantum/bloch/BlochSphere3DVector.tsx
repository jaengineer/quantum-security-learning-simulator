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
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

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
const STEM_RADIUS = 0.024;
const TIP_RADIUS = 0.078;

/**
 * Cyan palette matching the reference Bloch sphere:
 *   - stem  : solid cyan
 *   - tip   : slightly darker cyan (reads on top of the glow + mesh)
 *   - glow  : lighter cyan, applied to a soft radial sprite
 */
const STEM_COLOR = "#06b6d4";
const TIP_COLOR = "#0284c7";
const GLOW_COLOR = "#67e8f9";

// Soft sprite glow, not a hard spherical halo. Tied to the tip so it always
// "hugs" the endpoint: the glow's visible radius is GLOW_RADIUS_FACTOR x the
// tip radius. The sprite ``scale`` is the quad side (= diameter), and the
// radial alpha reaches 0 at the edge, hence the ``* 2``. If it reads too
// strong in compact view, drop the opacity before touching the factor.
const GLOW_OPACITY = 0.85;
const GLOW_RADIUS_FACTOR = 3.8;
const GLOW_SCALE = TIP_RADIUS * 2 * GLOW_RADIUS_FACTOR;

/**
 * Builds a radial-falloff alpha texture for the endpoint glow sprite. White
 * center fading smoothly to fully transparent at the edge, so additive
 * blending produces a soft round bloom with no hard rim.
 */
function createGlowTexture(): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const half = size / 2;
    const gradient = ctx.createRadialGradient(half, half, 0, half, half, half);
    gradient.addColorStop(0.0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.35, "rgba(255, 255, 255, 0.65)");
    gradient.addColorStop(0.7, "rgba(255, 255, 255, 0.22)");
    gradient.addColorStop(1.0, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export function BlochSphere3DVector({
  target,
  animate,
  color = STEM_COLOR,
  onAnimatingChange,
}: BlochSphere3DVectorProps) {
  const { vectorRef, isAnimating } = useBlochVector3DAnimation(target, animate);
  const stemRef = useRef<THREE.Mesh>(null);
  const tipRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Sprite>(null);
  const quaternion = useRef(new THREE.Quaternion());
  const up = useRef(new THREE.Vector3(0, 1, 0));

  const glowTexture = useMemo(() => createGlowTexture(), []);

  // Free the CanvasTexture's GPU memory when the vector unmounts.
  useEffect(() => {
    return () => {
      glowTexture.dispose();
    };
  }, [glowTexture]);

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
          emissiveIntensity={1.1}
          metalness={0.1}
          roughness={0.5}
        />
      </mesh>
      <mesh ref={tipRef} renderOrder={9}>
        <sphereGeometry args={[TIP_RADIUS, 18, 18]} />
        <meshStandardMaterial
          color={TIP_COLOR}
          emissive={TIP_COLOR}
          emissiveIntensity={1.8}
          metalness={0.05}
          roughness={0.25}
        />
      </mesh>
      {/*
        Soft endpoint glow as an additive sprite with a radial-falloff alpha
        texture. This avoids the hard rim of a spherical halo mesh while
        keeping the cyan bloom subtle. The sprite is camera-facing, so the
        glow stays round from every angle.
      */}
      <sprite ref={haloRef} scale={[GLOW_SCALE, GLOW_SCALE, 1]} renderOrder={10}>
        <spriteMaterial
          map={glowTexture}
          color={GLOW_COLOR}
          transparent
          opacity={GLOW_OPACITY}
          depthWrite={false}
          depthTest={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
    </group>
  );
}
