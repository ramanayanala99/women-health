"""Thin, optional caching layer.

Redis is not required to run CycleAI's API — if REDIS_URL is unset,
every function below becomes a no-op and callers transparently fall
back to computing values fresh on every request.
"""

from __future__ import annotations

import json
from functools import lru_cache
from typing import Any

from app.core.config import settings

try:
    import redis as redis_lib
except ImportError:  # pragma: no cover - redis is an optional dependency
    redis_lib = None


@lru_cache
def get_redis():
    if not settings.REDIS_URL or redis_lib is None:
        return None
    try:
        client = redis_lib.from_url(settings.REDIS_URL, decode_responses=True)
        client.ping()
        return client
    except Exception:
        # Cache is best-effort; never let a Redis outage break the API.
        return None


def cache_get(key: str) -> Any | None:
    client = get_redis()
    if client is None:
        return None
    raw = client.get(key)
    return json.loads(raw) if raw else None


def cache_set(key: str, value: Any, ttl_seconds: int = 300) -> None:
    client = get_redis()
    if client is None:
        return
    client.set(key, json.dumps(value, default=str), ex=ttl_seconds)


def cache_delete(*keys: str) -> None:
    client = get_redis()
    if client is None or not keys:
        return
    client.delete(*keys)
