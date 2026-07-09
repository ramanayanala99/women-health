from datetime import datetime, timedelta, timezone
from typing import Any, Literal
from uuid import uuid4

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

TokenType = Literal["access", "refresh"]


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def _create_token(subject: str, token_type: TokenType, expires_delta: timedelta) -> str:
    now = datetime.now(timezone.utc)
    payload: dict[str, Any] = {
        "sub": subject,
        "type": token_type,
        "iat": now,
        "exp": now + expires_delta,
        "jti": str(uuid4()),
    }
    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def create_access_token(user_id: str) -> str:
    return _create_token(
        user_id, "access", timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )


def create_refresh_token(user_id: str) -> str:
    return _create_token(
        user_id, "refresh", timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    )


class InvalidTokenError(Exception):
    pass


def decode_token(token: str, expected_type: TokenType = "access") -> str:
    """Decode a JWT and return the subject (user id). Raises InvalidTokenError on failure."""
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
    except JWTError as exc:
        raise InvalidTokenError("Could not validate token") from exc

    if payload.get("type") != expected_type:
        raise InvalidTokenError("Unexpected token type")

    subject = payload.get("sub")
    if not subject:
        raise InvalidTokenError("Token missing subject")

    return subject
