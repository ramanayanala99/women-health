"""Application-layer encryption for sensitive free-text columns.

Symptom notes and AI chat messages can contain highly personal health
information, so they are encrypted at the field level with Fernet
(AES-128-CBC + HMAC) before ever reaching the database. This is
defense-in-depth on top of (not a replacement for) transport encryption
(HTTPS) and at-rest disk/volume encryption on the database itself.
"""

from __future__ import annotations

from functools import lru_cache

from cryptography.fernet import Fernet, InvalidToken
from sqlalchemy.types import String, TypeDecorator

from app.core.config import settings


@lru_cache
def _fernet() -> Fernet | None:
    if not settings.APP_ENCRYPTION_KEY:
        return None
    return Fernet(settings.APP_ENCRYPTION_KEY.encode())


class EncryptedText(TypeDecorator):
    """A text column that is transparently encrypted at rest.

    Falls back to storing plaintext only when no APP_ENCRYPTION_KEY is
    configured (e.g. a throwaway local dev DB) so the app remains
    runnable out of the box, while production deployments are expected
    to always set the key.
    """

    impl = String
    cache_ok = True

    def process_bind_param(self, value: str | None, dialect) -> str | None:
        if value is None:
            return None
        fernet = _fernet()
        if fernet is None:
            return value
        return fernet.encrypt(value.encode()).decode()

    def process_result_value(self, value: str | None, dialect) -> str | None:
        if value is None:
            return None
        fernet = _fernet()
        if fernet is None:
            return value
        try:
            return fernet.decrypt(value.encode()).decode()
        except InvalidToken:
            # Value was stored before encryption was enabled (or key rotated).
            return value
