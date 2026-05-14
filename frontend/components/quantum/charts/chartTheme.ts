/**
 * Shared theming helpers for the Plotly-based charts. Colors are sourced from
 * the quantum design-system module so every chart stays in sync with the rest
 * of the visual language (3D scenes, React-Flow nodes, etc.).
 */

import type { Layout } from "plotly.js";

import {
  QUANTUM_COLORS,
  QUANTUM_STATE_COLORS,
} from "@/styles/quantum-theme";

import type { ColorScheme } from "./useColorScheme";

export interface ChartPalette {
  paper: string;
  plot: string;
  axis: string;
  grid: string;
  text: string;
  bar: string;
  barHighlight: string;
  barImpossible: string;
}

const PALETTES: Record<ColorScheme, ChartPalette> = {
  light: {
    paper: "rgba(0,0,0,0)",
    plot: "rgba(0,0,0,0)",
    axis: "#475569",
    grid: "rgba(148, 163, 184, 0.25)",
    text: "#0f172a",
    bar: QUANTUM_STATE_COLORS.superposition.base,
    barHighlight: QUANTUM_STATE_COLORS.active.base,
    barImpossible: QUANTUM_STATE_COLORS.impossible.base,
  },
  dark: {
    paper: "rgba(0,0,0,0)",
    plot: "rgba(0,0,0,0)",
    axis: QUANTUM_COLORS.scientificGraySoft,
    grid: "rgba(148, 163, 184, 0.18)",
    text: "#e2e8f0",
    bar: QUANTUM_STATE_COLORS.superposition.dim,
    barHighlight: QUANTUM_STATE_COLORS.active.dim,
    barImpossible: QUANTUM_STATE_COLORS.impossible.dim,
  },
};

export function getChartPalette(scheme: ColorScheme): ChartPalette {
  return PALETTES[scheme];
}

export function baseLayout(palette: ChartPalette): Partial<Layout> {
  return {
    paper_bgcolor: palette.paper,
    plot_bgcolor: palette.plot,
    font: {
      family: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
      color: palette.text,
      size: 12,
    },
    margin: { l: 48, r: 16, t: 8, b: 36 },
    showlegend: false,
    bargap: 0.35,
    hoverlabel: {
      bgcolor: palette.text,
      bordercolor: palette.text,
      font: {
        color: palette.paper === "rgba(0,0,0,0)" ? "#0f172a" : "#ffffff",
        family: "ui-sans-serif, system-ui, -apple-system, sans-serif",
      },
    },
    xaxis: {
      color: palette.axis,
      gridcolor: palette.grid,
      tickfont: { color: palette.text, size: 12 },
      automargin: true,
      fixedrange: true,
    },
    yaxis: {
      color: palette.axis,
      gridcolor: palette.grid,
      tickfont: { color: palette.text, size: 11 },
      automargin: true,
      fixedrange: true,
    },
  };
}

export function pickBarColors(
  keys: ReadonlyArray<string>,
  values: ReadonlyArray<number>,
  palette: ChartPalette,
  highlight?: ReadonlySet<string>
): string[] {
  return keys.map((key, index) => {
    const value = values[index] ?? 0;
    if (value <= 0) return palette.barImpossible;
    if (highlight && highlight.has(key)) return palette.barHighlight;
    return palette.bar;
  });
}
