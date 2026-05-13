"""Domain-level exceptions and FastAPI error handlers.

We separate domain errors from HTTP concerns so the simulation engine can raise
plain Python exceptions without depending on FastAPI.
"""

from __future__ import annotations

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse


class SimulationError(Exception):
    """Raised when a quantum simulation cannot be executed.

    Examples: an unsupported initial state, a backend (Aer) failure, or any
    other unexpected condition during circuit construction or measurement.
    """

    def __init__(self, message: str, *, status_code: int = 500) -> None:
        super().__init__(message)
        self.message = message
        self.status_code = status_code


def register_exception_handlers(app: FastAPI) -> None:
    """Attach JSON exception handlers to the FastAPI app."""

    @app.exception_handler(SimulationError)
    async def _simulation_error_handler(_: Request, exc: SimulationError) -> JSONResponse:
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.message, "type": "simulation_error"},
        )
