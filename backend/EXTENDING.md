# Extending the backend with new circuits

The architecture is intentionally minimal but layered so a new gate, algorithm
or use case can be added without touching unrelated layers.

## Recipe

Suppose we want to add a new endpoint `POST /simulate/<gate>`.

1. **Engine** — `app/quantum/<gate>.py`.

   Implement a pure Python function:

   ```python
   def simulate_<gate>(... params ...) -> dict[str, object]:
       """Build the circuit, run it on the active simulator, return a payload
       matching QuantumSimulationResult."""
   ```

   It must:
   - depend only on `qiskit` (and `qiskit-aer` if available).
   - call `app.quantum.backend.get_simulator()` to stay backend-agnostic.
   - return a dict with keys: `circuit`, `initial_state` (or equivalent),
     `shots`, `counts`, `probabilities`.

2. **Schema** — `app/schemas/simulation.py`.

   Add a new Pydantic request model (e.g. `BellRequest`) with the validations
   relevant to the new circuit. Reuse `QuantumSimulationResult` as the
   response model.

3. **Service** — `app/services/simulation_service.py`.

   Add an orchestration function:

   ```python
   def run_<gate>_simulation(request: <Gate>Request) -> QuantumSimulationResult: ...
   ```

   It should translate engine-level `ValueError`/exceptions into
   `SimulationError` for consistent HTTP responses.

4. **API** — `app/api/simulation.py`.

   Add a new endpoint under the existing `/simulate` router:

   ```python
   @router.post("/<gate>", response_model=QuantumSimulationResult)
   def simulate_<gate>_endpoint(request: <Gate>Request) -> QuantumSimulationResult:
       return run_<gate>_simulation(request)
   ```

5. **Tests** — `tests/test_<gate>.py`.

   Validate shape, key set, and that `counts.sum() == shots`.

No changes to `main.py`, CORS, or `core/` are required.

## Already implemented

| Circuit          | Engine module                  | Endpoint                  |
| ---------------- | ------------------------------ | ------------------------- |
| Hadamard (1q)    | `app/quantum/hadamard.py`      | `POST /simulate/hadamard` |
| Bell state (2q)  | `app/quantum/bell.py`          | `POST /simulate/bell-state` |

## Future use cases mapped to this pattern

| Use case                | New module file                  | New endpoint          |
| ----------------------- | -------------------------------- | --------------------- |
| Single-qubit `X` gate   | `app/quantum/pauli_x.py`         | `POST /simulate/x`    |
| Single-qubit `Z` gate   | `app/quantum/pauli_z.py`         | `POST /simulate/z`    |
| Remaining Bell states   | `app/quantum/bell.py`            | extend `BellStateName` literal |
| Noisy ideal-vs-noise    | `app/quantum/noise_compare.py`   | `POST /simulate/noise`|
| Grover (small N)        | `app/quantum/grover.py`          | `POST /simulate/grover` |
| Simplified Shor         | `app/quantum/shor.py`            | `POST /simulate/shor` |
| Security module (QKD)   | `app/quantum/qkd.py` + new router| `POST /security/qkd/...` |

The "security module" is the only case that justifies a second router
(`app/api/security.py`) because it represents a distinct domain concern.
