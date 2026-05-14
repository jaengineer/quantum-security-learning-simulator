"use client";

/**
 * Subscribe to the prefers-color-scheme media query using the React-19
 * idiomatic ``useSyncExternalStore`` API. Used by the Plotly wrappers to
 * theme charts in real-time when the user toggles their OS theme.
 *
 * The hook is SSR-safe: the snapshot returned on the server is always
 * ``"light"``. Components that render charts are loaded via ``next/dynamic``
 * with ``ssr: false`` so the discrepancy never materialises in production.
 */

import { useSyncExternalStore } from "react";

export type ColorScheme = "light" | "dark";

const DARK_QUERY = "(prefers-color-scheme: dark)";

function subscribe(onChange: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;
  const media = window.matchMedia(DARK_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function getSnapshot(): ColorScheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia(DARK_QUERY).matches ? "dark" : "light";
}

function getServerSnapshot(): ColorScheme {
  return "light";
}

export function useColorScheme(): ColorScheme {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
