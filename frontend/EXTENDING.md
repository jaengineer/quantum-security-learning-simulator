# Extending the frontend with new circuits

## Recipe

To support a new backend endpoint `POST /simulate/<gate>`:

1. **Catalog** — `features/quantum/data/experiments.ts`.

   Add a new `QuantumExperiment` entry with a stable `id` and the desired
   status (`"available"` once the backend + UI are ready, `"coming-soon"`
   otherwise). The landing page renders the catalog as-is.

2. **Types** — `features/quantum/types.ts`.

   Add a request interface (and a literal for any narrow option set):

   ```ts
   export interface MyGateRequest {
     shots: number;
   }
   ```

   Continue reusing `QuantumSimulationResult` for the response.

3. **Service** — `features/quantum/services/quantumApi.ts`.

   Add a thin wrapper around the generic helper:

   ```ts
   export function runMyGateSimulation(req: MyGateRequest, options = {}) {
     return runSimulation<MyGateRequest>("/simulate/my-gate", req, options);
   }
   ```

4. **Form** — `features/quantum/components/MyGateSimulationForm.tsx`.

   Mirror `SimulationForm.tsx` (Hadamard) or `BellSimulationForm.tsx`
   (Bell). Plug the new form into `ExperimentConfiguration.tsx` behind the
   experiment's `id`.

5. **Results / interpretation**.

   `SimulationResults.tsx` already renders any `Record<string, number>` of
   counts/probabilities. Extend `CircuitDiagram` with a new `variant` and
   add an interpretation block if the circuit deserves bespoke didactic
   text.

## Architectural rules

## Architectural rules

- Visual components must not call `fetch` directly. Always route through
  `features/quantum/services/quantumApi.ts`.
- Cross-cutting types live in `features/quantum/types.ts` or, if shared
  beyond the quantum feature, in `types/`.
- Environment variables are read once in `lib/env.ts`.
- The base URL is the only piece of configuration; never hard-code the
  backend host.
