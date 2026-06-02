"use client";

/**
 * Animates a three.js Vector3 from its previous value to the latest target
 * whenever the consumer-provided ``(x, y, z)`` coordinates change.
 *
 * The hook owns a single ``THREE.Vector3`` ref that downstream meshes copy
 * from inside ``useFrame``; React is never re-rendered during the animation.
 * It also reports whether an animation is currently in flight so the host
 * scene can flip ``frameloop`` between ``"always"`` and ``"demand"`` to keep
 * mobile CPU usage low when idle.
 *
 * No simulator / math logic lives here. The hook is intentionally generic:
 * coordinates in, animated vector out.
 */

import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

import type { BlochVector3 } from "./bloch3d-math";
import { clamp01, distanceSquared, easeInOutCubic } from "./bloch3d-math";

const TRANSITION_DURATION_SECONDS = 0.8;
const EPSILON_SQUARED = 1e-6;

export interface BlochVector3Animation {
  vectorRef: React.RefObject<THREE.Vector3>;
  /** True while the animation is interpolating; flips to false on settle. */
  isAnimating: boolean;
}

export function useBlochVector3DAnimation(
  target: BlochVector3,
  animate: boolean
): BlochVector3Animation {
  const vectorRef = useRef<THREE.Vector3>(
    new THREE.Vector3(target.x, target.y, target.z)
  );
  const sourceRef = useRef<BlochVector3>({ ...target });
  const targetRef = useRef<BlochVector3>({ ...target });
  const progressRef = useRef<number>(1);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  useEffect(() => {
    const previous = targetRef.current;
    const moved = distanceSquared(previous, target) > EPSILON_SQUARED;

    if (!animate || !moved) {
      vectorRef.current.set(target.x, target.y, target.z);
      sourceRef.current = { ...target };
      targetRef.current = { ...target };
      progressRef.current = 1;
      setIsAnimating(false);
      return;
    }

    sourceRef.current = {
      x: vectorRef.current.x,
      y: vectorRef.current.y,
      z: vectorRef.current.z,
    };
    targetRef.current = { ...target };
    progressRef.current = 0;
    setIsAnimating(true);
  }, [target, animate]);

  useFrame((_, delta) => {
    if (progressRef.current >= 1) return;
    progressRef.current = clamp01(
      progressRef.current + delta / TRANSITION_DURATION_SECONDS
    );
    const eased = easeInOutCubic(progressRef.current);
    const s = sourceRef.current;
    const t = targetRef.current;
    vectorRef.current.set(
      s.x + (t.x - s.x) * eased,
      s.y + (t.y - s.y) * eased,
      s.z + (t.z - s.z) * eased
    );
    if (progressRef.current >= 1) {
      setIsAnimating(false);
    }
  });

  return { vectorRef, isAnimating };
}
