def test_export_account_data(client, auth_headers):
    client.post(
        "/cycles", json={"start_date": "2026-05-01", "period_length_days": 5}, headers=auth_headers
    )
    resp = client.get("/account/export", headers=auth_headers)
    assert resp.status_code == 200
    body = resp.json()
    assert body["profile"]["email"] == "ava@example.com"
    assert len(body["cycles"]) == 1
    assert "settings" in body


def test_delete_account_requires_correct_password(client, auth_headers):
    wrong = client.request(
        "DELETE", "/account", json={"password": "wrong-password"}, headers=auth_headers
    )
    assert wrong.status_code == 401

    right = client.request(
        "DELETE", "/account", json={"password": "supersecret1"}, headers=auth_headers
    )
    assert right.status_code == 204

    # the account (and its token) are now gone
    profile = client.get("/profile", headers=auth_headers)
    assert profile.status_code == 401
