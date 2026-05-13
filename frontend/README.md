# Frontend — Quantum Security Learning Simulator

Next.js 16 (App Router) + TypeScript (strict) + Tailwind CSS v4.

## Requirements

- Node.js 20+ (LTS recommended).
- npm 10+ (or any other compatible package manager).

## Installation

```bash
cd frontend
npm install
cp .env.local.example .env.local
```

Edit `.env.local` if your backend runs on a different host/port:

```env
NEXT_PUBLIC_QUANTUM_API_URL=http://localhost:8000
```

## Run

```bash
npm run dev
```

Open <http://localhost:3000> and click "Run Hadamard Simulation".

## Build & checks

```bash
npm run build       # production build
npx tsc --noEmit    # type-check only
npm run lint        # eslint
```

## Project layout

```
frontend/
├── app/
│   ├── layout.tsx                          # root layout + metadata
│   ├── page.tsx                            # state machine: landing <-> workspace
│   └── globals.css                         # Tailwind v4 entry
├── components/
│   └── ui/
│       ├── Button.tsx
│       └── Card.tsx
├── features/
│   └── quantum/
│       ├── data/
│       │   └── experiments.ts              # static catalog (4 experiments)
│       ├── types.ts                        # ExperimentType, requests, result
│       ├── services/
│       │   └── quantumApi.ts               # runHadamard / runBell / generic helpers
│       └── components/
│           ├── ExperimentSelector.tsx      # landing grid
│           ├── ExperimentCard.tsx          # tile per experiment
│           ├── SimulationWorkspace.tsx     # per-experiment screen
│           ├── ExperimentConfiguration.tsx # wraps form + qubit selector
│           ├── QubitModeSelector.tsx       # 1 or 2 qubits indicator
│           ├── SimulationForm.tsx          # Hadamard form
│           ├── BellSimulationForm.tsx      # Bell-state form
│           ├── SimulationResults.tsx       # counts + bars + interpretation
│           ├── ProbabilityBars.tsx
│           ├── CircuitDiagram.tsx          # variant hadamard | bell
│           └── QuantumStateEvolution.tsx
├── lib/
│   └── env.ts                              # validated NEXT_PUBLIC_QUANTUM_API_URL
└── types/                                  # reserved for cross-cutting types
```

## Architectural rules

- Visual components never call `fetch`; they go through
  `features/quantum/services/quantumApi.ts`.
- The shared `QuantumSimulationResult` type matches the backend Pydantic model
  and is intentionally generic so it will support future circuits with no
  changes.
- Environment access is centralised in `lib/env.ts` and validated at module
  load time — missing config fails fast with a clear message.
