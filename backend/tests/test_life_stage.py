from datetime import date, timedelta


def test_life_stage_defaults_and_updates(client, auth_headers):
    profile = client.get("/profile", headers=auth_headers)
    assert profile.json()["life_stage"] == "unsure"

    updated = client.put("/profile", json={"life_stage": "perimenopause"}, headers=auth_headers)
    assert updated.status_code == 200
    assert updated.json()["life_stage"] == "perimenopause"

    invalid = client.put("/profile", json={"life_stage": "not-a-real-stage"}, headers=auth_headers)
    assert invalid.status_code == 422


def test_forecast_treats_perimenopause_as_irregular(client, auth_headers):
    client.put("/profile", json={"life_stage": "perimenopause"}, headers=auth_headers)

    today = date.today()
    # A fairly regular-looking history — but perimenopause framing should still win.
    for offset in (84, 56, 28):
        client.post(
            "/cycles",
            json={"start_date": (today - timedelta(days=offset)).isoformat(), "period_length_days": 5},
            headers=auth_headers,
        )

    resp = client.get("/forecast", headers=auth_headers)
    body = resp.json()
    assert body["current_phase"] == "irregular"
    assert body["is_irregular"] is True
    assert body["confidence"] <= 0.5
    assert "perimenopause" in body["note"].lower()


def test_forecast_stops_predicting_after_menopause(client, auth_headers):
    client.put("/profile", json={"life_stage": "menopause"}, headers=auth_headers)

    client.post(
        "/cycles",
        json={"start_date": (date.today() - timedelta(days=400)).isoformat(), "period_length_days": 5},
        headers=auth_headers,
    )

    resp = client.get("/forecast", headers=auth_headers)
    body = resp.json()
    assert body["current_phase"] == "menopause"
    assert body["predicted_next_period"] is None
    assert body["predicted_ovulation_date"] is None
    assert "menopause" in body["note"].lower()


def test_forecast_flags_long_gap_regardless_of_life_stage(client, auth_headers):
    today = date.today()
    client.post(
        "/cycles",
        json={"start_date": (today - timedelta(days=150)).isoformat(), "period_length_days": 5},
        headers=auth_headers,
    )
    client.post(
        "/cycles",
        json={"start_date": (today - timedelta(days=5)).isoformat(), "period_length_days": 5},
        headers=auth_headers,
    )

    resp = client.get("/forecast", headers=auth_headers)
    body = resp.json()
    assert body["current_phase"] == "irregular"
    assert body["is_irregular"] is True


def test_ai_chat_context_includes_life_stage(client, auth_headers):
    client.put("/profile", json={"life_stage": "perimenopause"}, headers=auth_headers)
    resp = client.post("/ai/chat", json={"message": "Why do my cycles feel so unpredictable?"}, headers=auth_headers)
    assert "perimenopause" in resp.json()["reply"].lower()


def test_ai_chat_flags_bleeding_after_menopause(client, auth_headers):
    client.put("/profile", json={"life_stage": "menopause"}, headers=auth_headers)
    client.post(
        "/cycles",
        json={"start_date": date.today().isoformat(), "period_length_days": 3},
        headers=auth_headers,
    )

    resp = client.post("/ai/chat", json={"message": "I noticed some spotting today"}, headers=auth_headers)
    assert resp.json()["escalation_flagged"] is True


def test_ai_chat_flags_bleeding_after_long_gap(client, auth_headers):
    today = date.today()
    client.post(
        "/cycles",
        json={"start_date": (today - timedelta(days=200)).isoformat(), "period_length_days": 5},
        headers=auth_headers,
    )
    client.post(
        "/cycles",
        json={"start_date": today.isoformat(), "period_length_days": 5},
        headers=auth_headers,
    )

    resp = client.post("/ai/chat", json={"message": "What's a good snack idea?"}, headers=auth_headers)
    assert resp.json()["escalation_flagged"] is True
