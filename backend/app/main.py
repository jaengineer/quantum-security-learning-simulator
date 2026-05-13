"""FastAPI application factory and module entry point.

Run locally with::

    uvicorn app.main:app --reload --port 8000
"""

from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.health import router as health_router
from app.api.simulation import router as simulation_router
from app.core.config import get_settings
from app.core.errors import register_exception_handlers


def create_app() -> FastAPI:
    """Build the FastAPI app with CORS, routers and exception handlers."""
    settings = get_settings()

    app = FastAPI(
        title="Quantum Simulator API",
        description=(
            "Backend of the Quantum Security Learning Simulator MVP "
            "(Master's Thesis on quantum computing applied to security)."
        ),
        version="0.1.0",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origin_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    register_exception_handlers(app)

    app.include_router(health_router)
    app.include_router(simulation_router)

    return app


app = create_app()
