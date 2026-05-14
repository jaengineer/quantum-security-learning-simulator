"use client";

/**
 * Integer-valued companion to ``ProbabilityHistogram``: shows raw measurement
 * counts so the user can compare the empirical sample against the theoretical
 * probabilities. Shares the same palette and highlight semantics.
 */

import type { Data, Layout } from "plotly.js";
import { useMemo } from "react";

import { PlotlyClient } from "./PlotlyClient";
import {
  baseLayout,
  getChartPalette,
  pickBarColors,
} from "./chartTheme";
import { useColorScheme } from "./useColorScheme";

export interface CountsHistogramProps {
  counts: Record<string, number>;
  shots: number;
  highlight?: ReadonlySet<string>;
  height?: number;
}

export function CountsHistogram({
  counts,
  shots,
  highlight,
  height = 280,
}: CountsHistogramProps) {
  const scheme = useColorScheme();
  const palette = getChartPalette(scheme);

  const { keys, values, labels } = useMemo(() => {
    const ks = Object.keys(counts).sort();
    const vs = ks.map((key) => counts[key] ?? 0);
    const ls = ks.map((key) => `|${key}⟩`);
    return { keys: ks, values: vs, labels: ls };
  }, [counts]);

  const data = useMemo<Data[]>(
    () => [
      {
        type: "bar",
        x: labels,
        y: values,
        marker: {
          color: pickBarColors(keys, values, palette, highlight),
          line: { width: 0 },
        },
        hovertemplate:
          "State <b>%{x}</b><br>" +
          "Counts <b>%{y:,}</b><br>" +
          `out of ${shots.toLocaleString()} shots` +
          "<extra></extra>",
      },
    ],
    [labels, values, keys, palette, highlight, shots]
  );

  const layout = useMemo<Partial<Layout>>(
    () => ({
      ...baseLayout(palette),
      height,
      yaxis: {
        ...baseLayout(palette).yaxis,
        rangemode: "tozero",
        tickformat: ",d",
        title: { text: "Counts", standoff: 4 },
      },
      xaxis: {
        ...baseLayout(palette).xaxis,
        title: { text: "Basis state", standoff: 4 },
      },
      transition: { duration: 300, easing: "cubic-in-out" },
    }),
    [palette, height]
  );

  return (
    <PlotlyClient
      data={data}
      layout={layout}
      className="!w-full"
      style={{ width: "100%", height }}
    />
  );
}
