"use client";

/**
 * Theory Lab locale context.
 *
 * Strategy:
 *   - The locale lives in a tiny external store backed by ``localStorage``.
 *   - On the server (and during the very first client render) the snapshot is
 *     ``DEFAULT_LOCALE`` ("en"), so SSR and the first hydration paint are
 *     identical regardless of any user preference. This is the official
 *     ``useSyncExternalStore`` pattern for hydration-safe stores.
 *   - Once the client mounts, React subscribes to the store; if a stored
 *     preference (or the browser language) maps to a different locale, the
 *     subtree re-renders in the new language.
 *   - ``setLocale`` writes through the store, which persists to
 *     ``localStorage`` and notifies every listener so all consumers update.
 *
 * The context only powers the Theory Lab subtree. The rest of the app is
 * currently English-only.
 */

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import { resolvePreferredLocale } from "@/features/theory/i18n/helpers";
import {
  THEORY_UI_STRINGS,
  type TheoryUiStringKey,
} from "@/features/theory/i18n/strings";
import { DEFAULT_LOCALE, type Locale } from "@/features/theory/i18n/types";

const STORAGE_KEY = "theory-locale";

type Listener = () => void;

// Module-level store. A single instance is enough because the Theory Lab
// uses one global preference, shared across every page and component tree.
let memoryLocale: Locale | null = null;
const listeners = new Set<Listener>();

function readBrowserLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  if (memoryLocale !== null) return memoryLocale;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "es") {
      memoryLocale = stored;
      return stored;
    }
  } catch {
    // ignore storage failures (private mode, disabled storage, etc.)
  }
  const resolved = resolvePreferredLocale();
  memoryLocale = resolved;
  return resolved;
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getClientSnapshot(): Locale {
  return readBrowserLocale();
}

function getServerSnapshot(): Locale {
  return DEFAULT_LOCALE;
}

function writeLocale(next: Locale): void {
  if (memoryLocale === next) return;
  memoryLocale = next;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
  }
  listeners.forEach((listener) => {
    listener();
  });
}

interface LocaleContextValue {
  locale: Locale;
  setLocale(locale: Locale): void;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
});

interface LocaleProviderProps {
  children: ReactNode;
}

export function LocaleProvider({ children }: LocaleProviderProps) {
  const locale = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot
  );
  const setLocale = useCallback((next: Locale) => {
    writeLocale(next);
  }, []);

  const value = useMemo(() => ({ locale, setLocale }), [locale, setLocale]);

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  return useContext(LocaleContext);
}

/**
 * Shortcut for reading UI strings in the active locale. Use for short labels
 * (filter headers, button copy, badge labels). For long-form text fields
 * carried by the data model, project directly with ``getLocalizedText``.
 */
export function useT(): (key: TheoryUiStringKey) => string {
  const { locale } = useLocale();
  return useCallback(
    (key: TheoryUiStringKey) => THEORY_UI_STRINGS[key][locale],
    [locale]
  );
}
