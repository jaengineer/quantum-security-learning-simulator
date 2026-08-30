"""Request/response schemas for quantum simulation endpoints.

These models are intentionally generic so that future circuits (X, Z, Bell,
Grover, etc.) can reuse the same response contract. Only the request payload
varies per endpoint.
"""

from __future__ import annotations

from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, Field

InitialState = Literal["0", "1"]

BellStateName = Literal["phi_plus", "phi_minus", "psi_plus", "psi_minus"]


class HadamardRequest(BaseModel):
    """Input payload for ``POST /simulate/hadamard``.

    Constraints are enforced by Pydantic so the simulation engine can assume a
    valid input and stay focused on quantum logic.
    """

    model_config = ConfigDict(extra="forbid")

    initial_state: InitialState = Field(
        default="0",
        description="Initial qubit state. Either '0' (|0>) or '1' (|1>).",
    )
    shots: int = Field(
        default=1024,
        ge=1,
        le=100_000,
        description="Number of measurement repetitions. Must be in [1, 100000].",
    )


class BellStateRequest(BaseModel):
    """Input payload for ``POST /simulate/bell-state``.

    The four canonical Bell states are supported by the same endpoint so the
    original MVP experiment can be explored without changing the response
    contract.
    """

    model_config = ConfigDict(extra="forbid")

    bell_state: BellStateName = Field(
        default="phi_plus",
        description="Bell state to prepare: phi_plus, phi_minus, psi_plus or psi_minus.",
    )
    shots: int = Field(
        default=1024,
        ge=1,
        le=100_000,
        description="Number of measurement repetitions. Must be in [1, 100000].",
    )


class QuantumSimulationResult(BaseModel):
    """Generic response for any single-circuit simulation.

    Keeping this contract circuit-agnostic lets the frontend render results for
    Hadamard, Bell state and any future gate or algorithm. ``counts`` and
    ``probabilities`` are open maps so they support 1-qubit ('0'/'1') and
    2-qubit ('00'/'01'/'10'/'11') alphabets transparently.
    """

    model_config = ConfigDict(extra="forbid")

    circuit: str = Field(
        description="Identifier of the simulated circuit, e.g. 'hadamard' or 'bell-state'.",
    )
    initial_state: Optional[str] = Field(
        default=None,
        description="Initial computational-basis state used by 1-qubit circuits.",
    )
    bell_state: Optional[BellStateName] = Field(
        default=None,
        description="Bell state variant used by 2-qubit Bell circuits.",
    )
    qubits: Optional[int] = Field(
        default=None,
        description="Number of qubits exercised by the circuit.",
    )
    shots: int = Field(
        description="Number of measurement repetitions actually executed.",
    )
    counts: dict[str, int] = Field(
        description="Measurement counts per basis state, normalised so all the "
        "relevant keys are always present (e.g. '0'/'1' for 1 qubit, "
        "'00'/'01'/'10'/'11' for 2 qubits).",
    )
    probabilities: dict[str, float] = Field(
        description="Empirical probabilities derived from counts (counts / shots).",
    )
    simulator: Optional[str] = Field(
        default=None,
        description="Name of the simulator backend used (e.g. 'AerSimulator').",
    )
    execution_time_ms: Optional[float] = Field(
        default=None,
        description="Wall-clock time spent running the circuit, in milliseconds.",
    )
