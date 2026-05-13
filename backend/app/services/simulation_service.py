"""Application service that orchestrates quantum simulations.

The service is the bridge between the HTTP layer (FastAPI routers + Pydantic
schemas) and the quantum engine (Qiskit). Keeping orchestration here means:

* Routers stay thin and only deal with transport concerns.
* The quantum engine stays pure and trivially unit-testable.
* New circuits can be added by extending this service and the engine package,
  without touching the HTTP layer beyond a new endpoint.
"""

from __future__ import annotations

from app.core.errors import SimulationError
from app.quantum.bell import simulate_bell_state as run_bell
from app.quantum.hadamard import simulate_hadamard as run_hadamard
from app.schemas.simulation import (
    BellStateRequest,
    HadamardRequest,
    QuantumSimulationResult,
)


def _build_result(payload: dict[str, object]) -> QuantumSimulationResult:
    """Translate an engine payload into the Pydantic response model."""
    return QuantumSimulationResult(**payload)


def _wrap_engine_errors(exc: Exception) -> SimulationError:
    """Map engine-level exceptions to HTTP-friendly :class:`SimulationError`."""
    if isinstance(exc, ValueError):
        return SimulationError(str(exc), status_code=400)
    return SimulationError(f"Quantum simulation failed: {exc}", status_code=500)


def run_hadamard_simulation(request: HadamardRequest) -> QuantumSimulationResult:
    """Execute the single-qubit Hadamard circuit described by ``request``."""
    try:
        payload = run_hadamard(
            initial_state=request.initial_state,
            shots=request.shots,
        )
    except Exception as exc:  # noqa: BLE001 - engine-level catch-all
        raise _wrap_engine_errors(exc) from exc

    return _build_result(payload)


def run_bell_simulation(request: BellStateRequest) -> QuantumSimulationResult:
    """Execute the two-qubit Bell-state circuit described by ``request``."""
    try:
        payload = run_bell(
            bell_state=request.bell_state,
            shots=request.shots,
        )
    except Exception as exc:  # noqa: BLE001 - engine-level catch-all
        raise _wrap_engine_errors(exc) from exc

    return _build_result(payload)
