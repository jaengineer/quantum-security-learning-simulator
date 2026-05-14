"use client";

/**
 * Connector rendered between two consecutive vertical timeline steps. Shows
 * a downward chevron + uppercase operation label (e.g. ``Apply H on q0``)
 * and centers itself horizontally so that, paired with the gradient spine,
 * it reads as a clear visual cue for "this is the operation that produced
 * the next state".
 *
 * Pure presentational, no animation: the parent step card animates in and
 * the connector simply rides along. This avoids stagger arithmetic in two
 * places and keeps the visual rhythm calm.
 */

interface VerticalTimelineConnectorProps {
  operationLabel: string;
}

export function VerticalTimelineConnector({
  operationLabel,
}: VerticalTimelineConnectorProps) {
  return (
    <div
      aria-hidden="false"
      className={[
        "flex items-center justify-center gap-1.5 py-1.5",
        "text-[11px] font-medium uppercase tracking-[0.14em]",
        "text-slate-500 dark:text-slate-400",
      ].join(" ")}
    >
      <svg
        viewBox="0 0 16 16"
        className="h-3.5 w-3.5"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M8 3 L8 13" />
        <path d="M4 9 L8 13 L12 9" />
      </svg>
      <span>{operationLabel}</span>
    </div>
  );
}
