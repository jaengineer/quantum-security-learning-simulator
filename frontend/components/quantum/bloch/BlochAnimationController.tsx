"use client";

/**
 * Hook that animates a Bloch vector between a source and a target position
 * using a small ease-in-out curve. The returned ref is meant to be plugged
 * into a three.js Group/Mesh so the animation runs through ``useFrame``
 * without re-rendering the React tree on every frame.
 */

import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

import type { BlochVector } from "./blochMath";
import { clamp01 } from "./blochMath";

const TRANSITION_DURATION_SECONDS = 1.0;

function easeInOutCubic(t: number): number {
  if (t < 0.5) return 4 * t * t * t;
  const f = -2 * t + 2;
  return 1 - (f * f * f) / 2;
}

export interface BlochAnimationApi {
  vectorRef: React.RefObject<THREE.Vector3>;
}

export function useBlochAnimation(
  source: BlochVector,
  target: BlochVector,
  animate: boolean
): BlochAnimationApi {
  const vectorRef = useRef<THREE.Vector3>(
    new THREE.Vector3(source.x, source.y, source.z)
  );
  const progressRef = useRef<number>(animate ? 0 : 1);
  const sourceRef = useRef<BlochVector>(source);
  const targetRef = useRef<BlochVector>(target);

  useEffect(() => {
    sourceRef.current = source;
    targetRef.current = target;
    progressRef.current = animate ? 0 : 1;
    if (!animate) {
      vectorRef.current.set(target.x, target.y, target.z);
    } else {
      vectorRef.current.set(source.x, source.y, source.z);
    }
  }, [source, target, animate]);

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
  });

  return { vectorRef };
}
