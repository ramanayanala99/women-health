def test_get_and_update_settings(client, auth_headers):
    resp = client.get("/settings", headers=auth_headers)
    assert resp.status_code == 200
    assert resp.json()["notifications_enabled"] is True

    updated = client.put(
        "/settings",
        json={"notifications_enabled": False, "theme": "dark"},
        headers=auth_headers,
    )
    assert updated.status_code == 200
    body = updated.json()
    assert body["notifications_enabled"] is False
    assert body["theme"] == "dark"
    # untouched fields keep their previous values
    assert body["units"] == "metric"
