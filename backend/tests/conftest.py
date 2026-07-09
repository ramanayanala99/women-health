import os
from collections.abc import Generator

from cryptography.fernet import Fernet

# Environment must be set before any `app.*` module is imported, since
# app.core.config.settings is instantiated at import time.
os.environ["DATABASE_URL"] = "sqlite://"  # placeholder; each test gets its own in-memory engine
os.environ["JWT_SECRET_KEY"] = "test-secret-key"
os.environ["APP_ENCRYPTION_KEY"] = Fernet.generate_key().decode()
os.environ["OPENAI_API_KEY"] = ""  # force the offline AI Coach fallback in tests
os.environ["REDIS_URL"] = ""

import pytest  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402
from sqlalchemy import create_engine  # noqa: E402
from sqlalchemy.orm import sessionmaker  # noqa: E402
from sqlalchemy.pool import StaticPool  # noqa: E402

from app.core.database import Base, get_db  # noqa: E402
from app.main import app  # noqa: E402
from app.models import (  # noqa: E402, F401
    AIConversation,
    Cycle,
    Insight,
    Notification,
    Prediction,
    Report,
    Symptom,
    User,
    UserSettings,
)


@pytest.fixture()
def client() -> Generator[TestClient, None, None]:
    """A fresh, fully isolated in-memory database per test."""
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base.metadata.create_all(bind=engine)

    def override_get_db() -> Generator:
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as c:
        yield c

    app.dependency_overrides.clear()
    Base.metadata.drop_all(bind=engine)
    engine.dispose()


@pytest.fixture()
def auth_headers(client: TestClient) -> dict:
    client.post(
        "/auth/register",
        json={"email": "ava@example.com", "password": "supersecret1", "full_name": "Ava Rivera"},
    )
    resp = client.post("/auth/login", json={"email": "ava@example.com", "password": "supersecret1"})
    token = resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}
