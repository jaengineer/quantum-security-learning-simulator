"""Health-check router.

Exposes ``GET /health`` for liveness checks during local development and in any
future deployment environment.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends

from app.core.config import Settings, get_settings

router = APIRouter(tags=["health"])


@router.get("/health", summary="Service liveness probe")
def health(settings: Settings = Depends(get_settings)) -> dict[str, str]:
    """Return a small JSON payload identifying the service."""
    return {"status": "ok", "service": settings.service_name}
