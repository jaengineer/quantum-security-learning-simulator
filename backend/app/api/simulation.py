"""Quantum simulation router.

Each endpoint here corresponds to a didactic experiment in the MVP. The first
implemented case is the single-qubit Hadamard circuit. Future endpoints (X, Z,
Bell, Grover, Shor, security use cases) can be added next to this one without
touching the service or engine layers beyond their own dedicated modules.
"""

from __future__ import annotations

from fastapi import APIRouter

from app.schemas.simulation import (
    BellStateRequest,
    HadamardRequest,
    QuantumSimulationResult,
)
from app.services.simulation_service import (
    run_bell_simulation,
    run_hadamard_simulation,
)

router = APIRouter(prefix="/simulate", tags=["simulation"])


@router.post(
    "/hadamard",
    response_model=QuantumSimulationResult,
    summary="Simulate a single-qubit Hadamard circuit",
)
def simulate_hadamard_endpoint(request: HadamardRequest) -> QuantumSimulationResult:
    """Apply ``H`` (optionally preceded by ``X``) and return measurement results.

    Didactic purpose: this endpoint demonstrates how a Hadamard gate transforms
    a computational-basis state into an equal superposition, which then yields
    an approximately 50/50 measurement distribution between ``|0>`` and ``|1>``.
    """
    return run_hadamard_simulation(request)


@router.post(
    "/bell-state",
    response_model=QuantumSimulationResult,
    summary="Simulate a two-qubit Bell state",
)
def simulate_bell_state_endpoint(
    request: BellStateRequest,
) -> QuantumSimulationResult:
    """Prepare a Bell state with ``H`` + ``CX`` and return measurement results.

    Didactic purpose: this endpoint introduces entanglement. The canonical
    ``|Phi+>`` state collapses only to ``|00>`` or ``|11>`` on measurement,
    illustrating how the two qubits are perfectly correlated.
    """
    return run_bell_simulation(request)
