/**
 * Pure projection helpers for ``LocalizedText`` / ``LocalizedStringArray``.
 *
 * The Theory Lab data is locale-agnostic (every textual field carries every
 * language). UI code projects the active locale on render through these
 * helpers; they never touch React so they can be reused on the server.
 */

import {
  DEFAULT_LOCALE,
  type Locale,
  type LocalizedStringArray,
  type LocalizedText,
} from "@/features/theory/i18n/types";

/** Return the localized string for the given locale, falling back to English. */
export function getLocalizedText(value: LocalizedText, locale: Locale): string {
  return value[locale] ?? value[DEFAULT_LOCALE] ?? "";
}

/** Return the localized string array, falling back to English. */
export function getLocalizedArray(
  value: LocalizedStringArray,
  locale: Locale
): string[] {
  return value[locale] ?? value[DEFAULT_LOCALE] ?? [];
}

/**
 * Resolve the locale to use on a fresh client when no preference is stored.
 *
 * Strategy: if the browser language starts with ``"es"`` -> ``"es"``,
 * otherwise default English. ``navigator`` is referenced behind a guard so
 * the function can be called in any context.
 */
export function resolvePreferredLocale(): Locale {
  if (typeof navigator === "undefined") return DEFAULT_LOCALE;
  const lang = navigator.language?.toLowerCase() ?? "";
  return lang.startsWith("es") ? "es" : "en";
}
