/**
 * HTTP client for the Quantum Simulator API.
 *
 * Visual components MUST NOT call `fetch` directly. Instead, they call the
 * functions exposed here. This keeps the UI layer free of transport details
 * and allows us to swap implementations (mocks, SDK, etc.) without touching
 * components.
 */

import { QUANTUM_API_URL } from "@/lib/env";
import type {
  BellStateRequest,
  HadamardRequest,
  QuantumApiError,
  QuantumSimulationResult,
} from "@/features/quantum/types";

interface RequestOptions {
  signal?: AbortSignal;
}

async function postJson<TRequest, TResponse>(
  path: string,
  body: TRequest,
  options: RequestOptions = {}
): Promise<TResponse> {
  const response = await fetch(`${QUANTUM_API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
    signal: options.signal,
  });

  if (!response.ok) {
    const fallback = `Request to ${path} failed with status ${response.status}.`;
    let detail = fallback;
    try {
      const payload = (await response.json()) as QuantumApiError | { detail?: unknown };
      if (payload && typeof payload === "object" && "detail" in payload) {
        const raw = (payload as QuantumApiError).detail;
        if (typeof raw === "string" && raw.trim().length > 0) {
          detail = raw;
        } else if (Array.isArray(raw)) {
          detail = raw
            .map((item) => (typeof item === "string" ? item : JSON.stringify(item)))
            .join("; ");
        }
      }
    } catch {
      // Ignore JSON parse errors and keep the fallback message.
    }
    throw new Error(detail);
  }

  return (await response.json()) as TResponse;
}

/**
 * Run the single-qubit Hadamard experiment against the backend.
 *
 * Generic helper `runSimulation` is also exposed so future circuits can reuse
 * the same transport without duplicating boilerplate.
 */
export function runHadamardSimulation(
  request: HadamardRequest,
  options: RequestOptions = {}
): Promise<QuantumSimulationResult> {
  return postJson<HadamardRequest, QuantumSimulationResult>(
    "/simulate/hadamard",
    request,
    options
  );
}

/**
 * Run a two-qubit Bell-state experiment against the backend.
 */
export function runBellSimulation(
  request: BellStateRequest,
  options: RequestOptions = {}
): Promise<QuantumSimulationResult> {
  return postJson<BellStateRequest, QuantumSimulationResult>(
    "/simulate/bell-state",
    request,
    options
  );
}

/** Generic POST wrapper for future simulation endpoints under `/simulate/*`. */
export function runSimulation<TRequest>(
  path: `/simulate/${string}`,
  request: TRequest,
  options: RequestOptions = {}
): Promise<QuantumSimulationResult> {
  return postJson<TRequest, QuantumSimulationResult>(path, request, options);
}

/** Lightweight health check against the backend. */
export async function getHealth(options: RequestOptions = {}): Promise<{
  status: string;
  service: string;
}> {
  const response = await fetch(`${QUANTUM_API_URL}/health`, {
    method: "GET",
    headers: { Accept: "application/json" },
    signal: options.signal,
  });
  if (!response.ok) {
    throw new Error(`Health check failed with status ${response.status}.`);
  }
  return (await response.json()) as { status: string; service: string };
}
