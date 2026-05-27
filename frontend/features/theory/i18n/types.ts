/**
 * Locale identifiers and localized payload types used across the Theory Lab.
 *
 * The Theory Lab keeps every human-readable string inside ``LocalizedText`` or
 * ``LocalizedStringArray`` objects. Identifiers, slugs, LaTeX sources and tags
 * stay locale-agnostic so the same content tree drives every language.
 */

export type Locale = "en" | "es";

export const SUPPORTED_LOCALES: readonly Locale[] = ["en", "es"] as const;

export const DEFAULT_LOCALE: Locale = "en";

export interface LocalizedText {
  en: string;
  es: string;
}

export interface LocalizedStringArray {
  en: string[];
  es: string[];
}
