"use client";

/**
 * Internal chart component that owns the actual ``react-plotly.js`` Plot
 * instance. Wired up via the factory pattern with ``plotly.js-cartesian-dist-min``
 * (\~700KB) instead of the full Plotly bundle (\~3MB), since the MVP only needs
 * 2D histograms/scatter charts.
 *
 * This file MUST NOT be imported directly: it is loaded lazily through
 * ``PlotlyClient.tsx`` via ``next/dynamic`` with ``ssr: false`` so server
 * rendering never touches the Plotly module.
 */

import type { Data, Layout, Config } from "plotly.js";
import Plotly from "plotly.js-cartesian-dist-min";
import type { Figure } from "react-plotly.js";
import createPlotlyComponent from "react-plotly.js/factory";

const Plot = createPlotlyComponent(
  Plotly as unknown as Parameters<typeof createPlotlyComponent>[0]
);

export interface PlotlyChartProps {
  data: Data[];
  layout: Partial<Layout>;
  config?: Partial<Config>;
  className?: string;
  style?: React.CSSProperties;
  onInitialized?: (
    figure: Readonly<Figure>,
    graphDiv: Readonly<HTMLElement>
  ) => void;
  onUpdate?: (
    figure: Readonly<Figure>,
    graphDiv: Readonly<HTMLElement>
  ) => void;
}

const DEFAULT_CONFIG: Partial<Config> = {
  displayModeBar: false,
  responsive: true,
  staticPlot: false,
  doubleClick: false,
  showAxisDragHandles: false,
  showTips: false,
};

export default function PlotlyChart({
  data,
  layout,
  config,
  className,
  style,
  onInitialized,
  onUpdate,
}: PlotlyChartProps) {
  return (
    <Plot
      data={data}
      layout={layout}
      config={{ ...DEFAULT_CONFIG, ...config }}
      className={className}
      style={style}
      useResizeHandler
      onInitialized={onInitialized}
      onUpdate={onUpdate}
    />
  );
}
