# Backend — Quantum Simulator API

FastAPI service that exposes the quantum simulation engine (Qiskit) used by the MVP.

## Requirements

- Python 3.9+ (Python 3.11+ recommended).
- `pip` and the ability to create virtual environments.

## Installation

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

If you want to override defaults, copy the env example:

```bash
cp .env.example .env
```

## Run

```bash
uvicorn app.main:app --reload --port 8000
```

- Health check: <http://localhost:8000/health>
- Interactive docs (Swagger): <http://localhost:8000/docs>
- ReDoc: <http://localhost:8000/redoc>

## Endpoints

### `GET /health`

```json
{ "status": "ok", "service": "quantum-simulator-api" }
```

### `POST /simulate/hadamard`

Request:

```json
{ "initial_state": "0", "shots": 1024 }
```

Response (`QuantumSimulationResult`):

```json
{
  "circuit": "hadamard",
  "initial_state": "0",
  "qubits": 1,
  "shots": 1024,
  "counts": { "0": 512, "1": 512 },
  "probabilities": { "0": 0.5, "1": 0.5 },
  "simulator": "aer_simulator",
  "execution_time_ms": 4.123
}
```

Validation:

- `initial_state` must be `"0"` or `"1"`.
- `shots` must be an integer in `[1, 100000]`.

### `POST /simulate/bell-state`

Request:

```json
{ "bell_state": "phi_plus", "shots": 1024 }
```

Response:

```json
{
  "circuit": "bell-state",
  "bell_state": "phi_plus",
  "qubits": 2,
  "shots": 1024,
  "counts": { "00": 512, "01": 0, "10": 0, "11": 512 },
  "probabilities": { "00": 0.5, "01": 0, "10": 0, "11": 0.5 },
  "simulator": "aer_simulator",
  "execution_time_ms": 5.842
}
```

Validation:

- `bell_state` must be `"phi_plus"` (the other three Bell states are listed
  in the UI as "coming soon").
- `shots` must be an integer in `[1, 100000]`.

Errors are returned as JSON, e.g.:

```json
{ "detail": "...", "type": "simulation_error" }
```

### Qiskit bit ordering

Qiskit reports measurement results as classical big-endian strings: the
leftmost character corresponds to the highest-indexed classical bit. With
the explicit mapping `measure(0, 0)` + `measure(1, 1)`, the string `"c1 c0"`
reads `q1` first. The Bell state `Φ⁺` only populates `"00"` and `"11"`,
which are symmetric and unaffected by the ordering choice; we keep this
note here for clarity.

## Project layout

```
backend/
├── app/
│   ├── main.py                  # FastAPI factory, CORS, routers
│   ├── api/
│   │   ├── health.py            # GET /health
│   │   └── simulation.py        # POST /simulate/hadamard, /simulate/bell-state
│   ├── schemas/
│   │   └── simulation.py        # Pydantic v2 contracts
│   ├── services/
│   │   └── simulation_service.py# Orchestration layer
│   ├── quantum/
│   │   ├── backend.py           # AerSimulator with BasicSimulator fallback
│   │   ├── hadamard.py          # simulate_hadamard(initial_state, shots)
│   │   └── bell.py              # simulate_bell_state(bell_state, shots)
│   └── core/
│       ├── config.py            # Settings (CORS, service name)
│       └── errors.py            # SimulationError + handlers
├── tests/
│   ├── test_hadamard.py
│   └── test_bell.py
├── requirements.txt
└── .env.example
```

The quantum engine (`app/quantum/`) does not import FastAPI or Pydantic. This
isolation is intentional: the engine can be unit-tested in seconds and used
from notebooks or future services without dragging the HTTP layer along.

## Quantum simulation engine

The function `simulate_hadamard(initial_state, shots)` performs:

1. Build a `QuantumCircuit(1, 1)` (one qubit, one classical bit).
2. If `initial_state == "1"`, apply `X` to prepare `|1⟩`.
3. Apply `H` (Hadamard).
4. Measure into the classical bit.
5. Run the circuit on the active simulator.
6. Normalise counts so both keys `"0"` and `"1"` are always present.
7. Compute `probabilities[k] = counts[k] / shots`.

### Simulator selection

`app/quantum/backend.py` picks the first available option:

1. **`AerSimulator`** from `qiskit-aer` — high-performance default.
2. **`BasicSimulator`** from `qiskit.providers.basic_provider` — pure-Python fallback.

If `qiskit-aer` cannot be installed on your platform (e.g. an exotic
architecture where no wheel is available and the C++ build fails), simply
remove it from `requirements.txt`. The backend will transparently use
`BasicSimulator`, which is shipped with Qiskit core and requires no
compilation. Functionally the MVP behaves identically; only performance for
larger circuits differs.

## Tests

```bash
source .venv/bin/activate
python -m pytest tests/ -v
```

## Adding a new circuit

The architecture is intentionally extensible:

1. Create `app/quantum/<gate>.py` with a pure function `simulate_<gate>(...)`.
2. Add an orchestration entry in `app/services/simulation_service.py`.
3. Expose it as a new endpoint inside `app/api/simulation.py` (same `/simulate`
   prefix), backed by a new Pydantic request model in `app/schemas/simulation.py`.
4. Reuse `QuantumSimulationResult` for the response contract.

No other layer needs to change.
