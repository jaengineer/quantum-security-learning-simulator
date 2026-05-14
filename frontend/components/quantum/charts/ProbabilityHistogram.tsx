"use client";

/**
 * Interactive histogram of empirical probabilities (counts / shots). Optional
 * ``highlight`` set marks the basis states that should pop visually (used for
 * the Bell experiment, where only ``"00"`` and ``"11"`` are physical).
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

export interface ProbabilityHistogramProps {
  probabilities: Record<string, number>;
  counts?: Record<string, number>;
  highlight?: ReadonlySet<string>;
  height?: number;
}

export function ProbabilityHistogram({
  probabilities,
  counts,
  highlight,
  height = 280,
}: ProbabilityHistogramProps) {
  const scheme = useColorScheme();
  const palette = getChartPalette(scheme);

  const { keys, values, labels, customdata } = useMemo(() => {
    const ks = Object.keys(probabilities).sort();
    const vs = ks.map((key) => probabilities[key] ?? 0);
    const ls = ks.map((key) => `|${key}\u27E9`);
    const cd = ks.map((key) => [key, counts?.[key] ?? 0] as const);
    return { keys: ks, values: vs, labels: ls, customdata: cd };
  }, [probabilities, counts]);

  const data = useMemo<Data[]>(
    () => [
      {
        type: "bar",
        x: labels,
        y: values,
        customdata: customdata as unknown as number[][],
        marker: {
          color: pickBarColors(keys, values, palette, highlight),
          line: { width: 0 },
        },
        hovertemplate:
          "State <b>%{x}</b><br>" +
          "Probability <b>%{y:.4f}</b><br>" +
          "Counts <b>%{customdata[1]:,}</b>" +
          "<extra></extra>",
      },
    ],
    [labels, values, customdata, keys, palette, highlight]
  );

  const layout = useMemo<Partial<Layout>>(
    () => ({
      ...baseLayout(palette),
      height,
      yaxis: {
        ...baseLayout(palette).yaxis,
        range: [0, Math.max(1, Math.max(...values, 0)) * 1.05],
        tickformat: ".2f",
        title: { text: "Probability", standoff: 4 },
      },
      xaxis: {
        ...baseLayout(palette).xaxis,
        title: { text: "Basis state", standoff: 4 },
      },
      transition: { duration: 300, easing: "cubic-in-out" },
    }),
    [palette, height, values]
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
