"use client";

/**
 * SSR-safe public wrapper around the actual Plotly chart. The chart itself
 * (``PlotlyChart.tsx``) imports the Plotly runtime, so it must never reach
 * the server bundle. Loading it through ``next/dynamic({ ssr: false })``
 * guarantees that and also opens an opportunity for Next.js to split the
 * Plotly chunk out of the main bundle.
 */

import dynamic from "next/dynamic";

import type { PlotlyChartProps } from "./PlotlyChart";

const PlotlyChart = dynamic(() => import("./PlotlyChart"), {
  ssr: false,
  loading: () => <ChartSkeleton />,
});

function ChartSkeleton() {
  return (
    <div
      aria-hidden
      className={[
        "h-[260px] w-full animate-pulse rounded-xl border",
        "border-slate-200 bg-slate-100/70",
        "dark:border-slate-800 dark:bg-slate-900/70",
      ].join(" ")}
    />
  );
}

export function PlotlyClient(props: PlotlyChartProps) {
  return <PlotlyChart {...props} />;
}
