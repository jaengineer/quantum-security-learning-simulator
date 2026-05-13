/**
 * Validated access to public environment variables.
 *
 * Centralising env reads in a single module gives us:
 *  - one place to enforce required values,
 *  - clear error messages during development,
 *  - typed helpers for the rest of the codebase.
 */

const RAW_API_URL = process.env.NEXT_PUBLIC_QUANTUM_API_URL;

if (!RAW_API_URL || RAW_API_URL.trim() === "") {
  throw new Error(
    "NEXT_PUBLIC_QUANTUM_API_URL is not set. " +
      "Copy frontend/.env.local.example to frontend/.env.local and restart `npm run dev`."
  );
}

/** Absolute base URL of the Quantum Simulator API (no trailing slash). */
export const QUANTUM_API_URL: string = RAW_API_URL.replace(/\/+$/, "");
