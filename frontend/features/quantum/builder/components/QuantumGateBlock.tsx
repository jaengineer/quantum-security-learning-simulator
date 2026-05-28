"use client";

/**
 * Visual block representing a single quantum gate.
 *
 * The same component is reused in two modes:
 *
 *   - ``mode="palette"``: a draggable *source*. dnd-kit's ``useDraggable``
 *     attaches the listeners and the block exposes its gate id via
 *     ``data.gateId`` so the orchestrator's ``onDragEnd`` knows what to
 *     append to the circuit.
 *
 *   - ``mode="canvas"``: a sortable *item*. dnd-kit's ``useSortable`` makes
 *     it reorderable inside the canvas; a delete button is exposed and, for
 *     parametric gates, the current ``\theta`` value is shown.
 *
 * The block is intentionally chunky (64x64) to match a typical hand-drawn
 * circuit notation and to provide a comfortable drop target.
 */

import { useDraggable } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { getGlossaryEntryForGate } from "@/features/overlays/glossary/gateMap";
import { LearnableTooltip } from "@/features/overlays/tooltip/LearnableTooltip";
import { GATE_PALETTE_STYLES } from "@/features/quantum/builder/components/gatePaletteStyles";
import { getGate } from "@/features/quantum/builder/math/quantum-gates";
import type {
  GateId,
  GateInstance,
} from "@/features/quantum/builder/types";

interface PaletteBlockProps {
  mode: "palette";
  gateId: GateId;
  /** Current theta (in radians) for parametric gates, picked from the slider. */
  theta?: number;
}

interface CanvasBlockProps {
  mode: "canvas";
  gate: GateInstance;
  onRemove(uid: string): void;
}

type QuantumGateBlockProps = PaletteBlockProps | CanvasBlockProps;

function formatTheta(rad: number): string {
  const deg = (rad * 180) / Math.PI;
  return `${deg >= 0 ? "+" : ""}${deg.toFixed(0)}°`;
}

export function QuantumGateBlock(props: QuantumGateBlockProps) {
  if (props.mode === "palette") return <PaletteBlock {...props} />;
  return <CanvasBlock {...props} />;
}

function PaletteBlock({ gateId, theta }: PaletteBlockProps) {
  const gate = getGate(gateId);
  const style = GATE_PALETTE_STYLES[gate.palette];
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${gateId}`,
    data: { source: "palette", gateId, theta },
  });
  const entry = getGlossaryEntryForGate(gateId);

  // Tooltip wrapping strategy: the tooltip trigger targets a neutral wrapper
  // ``<span>`` and the draggable ``<button>`` lives untouched inside. This
  // keeps dnd-kit's ref/listeners on the *original* button (no Radix Slot
  // composition cloning that element), which:
  //   - guarantees drag-and-drop behaviour stays byte-identical to before;
  //   - prevents the dnd-kit hydration counter (``DndDescribedBy-N``) from
  //     drifting because of an extra Slot render layer.
  // On touch devices Radix opens on focus only; long-press would clash with
  // dnd-kit's drag activation, so users get the same content via the
  // GlossaryFab fallback.
  return (
    <LearnableTooltip
      title={entry?.term ?? gate.longName}
      description={entry?.summary ?? gate.description}
      latex={entry?.latex ?? gate.latex}
      conceptId={entry?.theoryConceptId}
      side="bottom"
    >
      <span className="inline-block">
        <button
          type="button"
          ref={setNodeRef}
          {...attributes}
          {...listeners}
          aria-label={`Drag ${gate.longName} gate onto the circuit`}
          className={[
            "group relative flex h-16 w-16 select-none flex-col items-center justify-center gap-0.5 rounded-xl border text-center transition",
            "cursor-grab active:cursor-grabbing focus:outline-none focus-visible:ring-2",
            style.block,
            style.ring,
            isDragging ? "opacity-50" : "hover:scale-[1.04]",
          ].join(" ")}
        >
          <span className={["text-base font-semibold", style.label].join(" ")}>
            {gate.label}
          </span>
          {gate.parametric ? (
            <span className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400">
              {typeof theta === "number" ? formatTheta(theta) : "(θ)"}
            </span>
          ) : null}
        </button>
      </span>
    </LearnableTooltip>
  );
}

function CanvasBlock({ gate, onRemove }: CanvasBlockProps) {
  const def = getGate(gate.id);
  const style = GATE_PALETTE_STYLES[def.palette];
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: gate.uid,
    data: { source: "canvas", uid: gate.uid },
  });
  const entry = getGlossaryEntryForGate(gate.id);

  const inlineStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={inlineStyle}
      className={[
        "relative flex h-16 w-16 flex-col items-center justify-center gap-0.5 rounded-xl border shadow-sm transition",
        style.block,
        style.ring,
        isDragging ? "z-10 opacity-80" : "",
      ].join(" ")}
    >
      <LearnableTooltip
        title={entry?.term ?? def.longName}
        description={entry?.summary ?? def.description}
        latex={entry?.latex ?? def.latex}
        conceptId={entry?.theoryConceptId}
        side="top"
      >
        {/* Neutral span wrapper: see PaletteBlock for rationale. */}
        <span className="inline-block h-full w-full">
          <button
            type="button"
            {...attributes}
            {...listeners}
            aria-label={`Reorder ${def.longName} gate`}
            className="flex h-full w-full cursor-grab flex-col items-center justify-center gap-0.5 rounded-xl active:cursor-grabbing focus:outline-none"
          >
            <span
              className={["text-base font-semibold", style.label].join(" ")}
            >
              {def.label}
            </span>
            {gate.params ? (
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400">
                {formatTheta(gate.params.theta)}
              </span>
            ) : null}
          </button>
        </span>
      </LearnableTooltip>
      <button
        type="button"
        onClick={() => onRemove(gate.uid)}
        aria-label={`Remove ${def.longName} gate`}
        title="Remove"
        className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 bg-white text-xs text-slate-600 shadow hover:bg-rose-500 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
      >
        {"\u00D7"}
      </button>
    </div>
  );
}
