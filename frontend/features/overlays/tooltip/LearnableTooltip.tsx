"use client";

/**
 * Accessible tooltip enriched with optional KaTeX preview and a "Open in Theory
 * Lab" deep link.
 *
 * Design contract:
 *   - Non-invasive: ``children`` is forwarded verbatim through Radix' ``Slot``
 *     via ``asChild`` so any pre-existing refs and event listeners (notably
 *     dnd-kit's ``useDraggable`` on the gate blocks) keep working untouched.
 *   - Hover + focus on desktop. On touch devices Radix Tooltip is not opened
 *     by long-press (that would clash with dnd-kit's drag start), so the
 *     glossary FAB acts as the touch-friendly fallback for the same content.
 *   - Reduced motion: the tooltip animation is gated by the
 *     ``motion-safe:`` Tailwind variant; users with ``prefers-reduced-motion:
 *     reduce`` see a plain show/hide with no transitions.
 *
 * The component never hardcodes a Theory Lab URL: callers pass an opaque
 * ``conceptId`` and the link is built here as ``/theory/${conceptId}``.
 */

import * as Tooltip from "@radix-ui/react-tooltip";
import Link from "next/link";
import type { ReactNode } from "react";

import { QuantumFormula } from "@/components/quantum/QuantumFormula";

export interface LearnableTooltipProps {
  /** Short label shown as the tooltip heading (gate long name, symbol, …). */
  title: string;
  /** One- or two-sentence definition. Keep it short. */
  description: string;
  /** Optional KaTeX source rendered inline under the description. */
  latex?: string;
  /** Theory Lab concept id. When provided, the "Open in Theory Lab" CTA appears. */
  conceptId?: string;
  /** Tooltip side preference. Radix decides if the side is forbidden. */
  side?: "top" | "right" | "bottom" | "left";
  /** Optional className for the popup (advanced use). */
  contentClassName?: string;
  /**
   * The trigger element. It is forwarded verbatim with Radix ``asChild``, so
   * the child must be a single React element that accepts ``ref`` and the
   * standard DOM event handlers.
   */
  children: ReactNode;
}

/**
 * Provider for the whole Theory Lab overlay system. Mount it once near the
 * root of any page that uses ``LearnableTooltip``. ``delayDuration`` is the
 * idiomatic 200 ms; ``disableHoverableContent`` is false so the CTA inside
 * the tooltip can be clicked.
 */
export function LearnableTooltipProvider({ children }: { children: ReactNode }) {
  return (
    <Tooltip.Provider delayDuration={200} skipDelayDuration={150}>
      {children}
    </Tooltip.Provider>
  );
}

export function LearnableTooltip({
  title,
  description,
  latex,
  conceptId,
  side = "top",
  contentClassName,
  children,
}: LearnableTooltipProps) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          side={side}
          sideOffset={8}
          collisionPadding={12}
          className={[
            "z-50 max-w-xs rounded-2xl border border-slate-200 bg-white p-3 text-left shadow-lg",
            "motion-safe:transition motion-safe:duration-150 motion-safe:ease-out",
            "data-[state=closed]:motion-safe:opacity-0 data-[state=closed]:motion-safe:scale-95",
            "data-[state=delayed-open]:motion-safe:opacity-100 data-[state=delayed-open]:motion-safe:scale-100",
            "dark:border-slate-700 dark:bg-slate-900",
            contentClassName ?? "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <p className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            {title}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            {description}
          </p>
          {latex ? (
            <div className="mt-2 rounded-lg bg-slate-50 px-2 py-1.5 dark:bg-slate-800/50">
              <QuantumFormula
                expression={latex}
                displayMode="block"
                size="sm"
                compact
              />
            </div>
          ) : null}
          {conceptId ? (
            <Link
              href={`/theory/${conceptId}`}
              prefetch
              className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-violet-600 underline-offset-2 hover:underline dark:text-violet-300"
            >
              Open in Theory Lab
              <span aria-hidden>→</span>
            </Link>
          ) : null}
          <Tooltip.Arrow className="fill-white stroke-slate-200 dark:fill-slate-900 dark:stroke-slate-700" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
