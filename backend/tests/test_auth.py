def test_register_and_login(client):
    resp = client.post(
        "/auth/register",
        json={"email": "sam@example.com", "password": "verysecure1", "full_name": "Sam Lee"},
    )
    assert resp.status_code == 201
    body = resp.json()
    assert "access_token" in body
    assert "refresh_token" in body

    # duplicate registration is rejected
    dup = client.post(
        "/auth/register",
        json={"email": "sam@example.com", "password": "verysecure1"},
    )
    assert dup.status_code == 409

    # wrong password
    bad_login = client.post("/auth/login", json={"email": "sam@example.com", "password": "wrong"})
    assert bad_login.status_code == 401

    good_login = client.post("/auth/login", json={"email": "sam@example.com", "password": "verysecure1"})
    assert good_login.status_code == 200
    assert good_login.json()["access_token"]


def test_profile_requires_auth(client):
    resp = client.get("/profile")
    assert resp.status_code == 401


def test_profile_get_and_update(client, auth_headers):
    resp = client.get("/profile", headers=auth_headers)
    assert resp.status_code == 200
    assert resp.json()["email"] == "ava@example.com"
    assert resp.json()["full_name"] == "Ava Rivera"

    updated = client.put("/profile", json={"full_name": "Ava R."}, headers=auth_headers)
    assert updated.status_code == 200
    assert updated.json()["full_name"] == "Ava R."
