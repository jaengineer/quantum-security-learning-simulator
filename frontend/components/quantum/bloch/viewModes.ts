/**
 * Camera + framing presets for the 3D Bloch sphere primitive.
 *
 * The single ``viewMode`` knob on ``BlochSphere3D`` selects one of these
 * presets, which together drive:
 *
 *   - the perspective camera (``fov``, ``cameraPosition``),
 *   - the OrbitControls zoom clamp (``minDistance`` / ``maxDistance``),
 *   - the world-space scale of the Bloch content (``sphereScale``), and
 *   - how far outside the unit sphere the pole labels sit (``labelOffset``).
 *
 * Kept in its own module so ``bloch3d-math.ts`` stays purely mathematical
 * and the scene/wrapper never carry magic numbers.
 *
 * Why three presets?
 *   - ``compact``  — narrow containers (e.g. the Builder side panel,
 *     ~320 px wide). Wider fov, camera pulled back and content scaled
 *     down so the sphere never clips horizontally on a portrait aspect.
 *   - ``hero``     — medium standalone surfaces (e.g. simulation
 *     briefings on a half-grid column). Balanced framing, mild
 *     content scale.
 *   - ``expanded`` — full-viewport focus mode opened from the Expand
 *     dialog. Tight fov + close camera + 1.0 sphere scale for an
 *     immersive view.
 */

export type BlochSphere3DViewMode = "compact" | "hero" | "expanded";

export interface BlochSphere3DPreset {
  /** Vertical field of view passed to the perspective camera, in degrees. */
  fov: number;
  /** Initial camera position; the camera always looks at the origin. */
  cameraPosition: readonly [number, number, number];
  /** Distance from the origin where pole labels sit, in unscaled units. */
  labelOffset: number;
  /** Uniform scale applied to the whole Bloch content group. */
  sphereScale: number;
  /** Lower bound for OrbitControls dolly-in (closer than this is clipped). */
  minDistance: number;
  /** Upper bound for OrbitControls dolly-out. */
  maxDistance: number;
}

export const BLOCH_VIEW_MODE_PRESETS: Record<
  BlochSphere3DViewMode,
  BlochSphere3DPreset
> = {
  compact: {
    // Tuned to match the academic reference image inside the Builder
    // sidebar (~320×520 panel, aspect ≈ 0.615): a near-1.0 ``sphereScale``
    // with a moderately wide FOV makes the sphere fill ~90 % of the
    // canvas width while leaving the per-state ket labels (which carry
    // their own offset in ``BlochLabels``) inside the frustum.
    //
    // Sanity check at 320 × 520 (aspect ≈ 0.615):
    //   distance ≈ √(2.55² + 1.85² + 2.55²)      ≈ 4.05
    //   vertical half-extent ≈ 4.05 · tan(21°)   ≈ 1.55
    //   horizontal half-extent ≈ 1.55 · 0.615    ≈ 0.95
    //   effective sphere radius = sphereScale    = 0.80
    // The sphere remains large, but no longer presses into the side
    // edges; axis tips and per-state ket labels keep enough room inside
    // the canvas thanks to the slightly wider FOV.
    //
    // ``labelOffset`` is retained as a scalar multiplier on the per-state
    // text offsets defined in ``BlochLabels.tsx`` so external consumers
    // that still set the legacy prop keep a sensible fallback.
    fov: 42,
    cameraPosition: [2.55, 1.85, 2.55],
    labelOffset: 1.0,
    sphereScale: 0.8,
    minDistance: 3.0,
    maxDistance: 6.5,
  },
  hero: {
    // Balanced standalone framing. The camera sits a touch farther than
    // ``expanded`` so the per-state ket labels read with breathing room
    // in half-grid columns (~480 px).
    fov: 38,
    cameraPosition: [2.25, 1.65, 2.25],
    labelOffset: 1.0,
    sphereScale: 0.95,
    minDistance: 2.6,
    maxDistance: 5.5,
  },
  expanded: {
    // Full-viewport focus mode. Tight FOV + unit ``sphereScale`` make the
    // Bloch sphere visually dominant in the dialog without clipping any
    // of the per-state labels (vertical half ≈ 3.36·tan(16°) ≈ 0.96 still
    // fits the unit sphere edge-to-edge in a roughly square canvas).
    fov: 32,
    cameraPosition: [2.0, 1.45, 2.0],
    labelOffset: 1.0,
    sphereScale: 1.0,
    minDistance: 1.8,
    maxDistance: 4.5,
  },
};

export const DEFAULT_BLOCH_VIEW_MODE: BlochSphere3DViewMode = "hero";
