def test_ai_chat_offline_fallback(client, auth_headers):
    resp = client.post(
        "/ai/chat",
        json={"message": "Why am I so tired today?"},
        headers=auth_headers,
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["session_id"]
    assert "diagnosis" in body["disclaimer"] or "diagnose" in body["disclaimer"]
    assert body["escalation_flagged"] is False
    assert len(body["reply"]) > 0


def test_ai_chat_flags_severe_symptoms(client, auth_headers):
    resp = client.post(
        "/ai/chat",
        json={"message": "I have severe pain and can't stop bleeding"},
        headers=auth_headers,
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["escalation_flagged"] is True
    assert "healthcare professional" in body["reply"] or "emergency" in body["reply"]


def test_ai_chat_flags_heavy_bleeding(client, auth_headers):
    resp = client.post(
        "/ai/chat",
        json={"message": "I'm soaking through a pad every hour, is that normal?"},
        headers=auth_headers,
    )
    assert resp.json()["escalation_flagged"] is True


def test_ai_chat_flags_fear_and_emergency_language(client, auth_headers):
    resp = client.post(
        "/ai/chat",
        json={"message": "I'm really scared, is this dangerous?"},
        headers=auth_headers,
    )
    assert resp.json()["escalation_flagged"] is True


def test_ai_chat_flags_pregnancy_with_concerning_symptom(client, auth_headers):
    resp = client.post(
        "/ai/chat",
        json={"message": "I think I might be pregnant and I'm spotting"},
        headers=auth_headers,
    )
    assert resp.json()["escalation_flagged"] is True


def test_ai_chat_does_not_flag_pregnancy_alone(client, auth_headers):
    resp = client.post(
        "/ai/chat",
        json={"message": "I might be pregnant, what changes should I expect?"},
        headers=auth_headers,
    )
    assert resp.json()["escalation_flagged"] is False


def test_ai_chat_flags_persistent_high_pain_from_logs(client, auth_headers):
    from datetime import date, timedelta

    today = date.today()
    for offset in range(4):
        log_date = today - timedelta(days=offset)
        resp = client.post(
            "/symptoms",
            json={"log_date": log_date.isoformat(), "pain_level": 5},
            headers=auth_headers,
        )
        assert resp.status_code == 201

    # A completely unrelated question should still get flagged, because the
    # user's *logs* show a persistent pattern even though the message doesn't.
    resp = client.post("/ai/chat", json={"message": "What's a good snack idea?"}, headers=auth_headers)
    assert resp.json()["escalation_flagged"] is True


def test_ai_chat_offline_fallback_includes_real_recommendations(client, auth_headers):
    from datetime import date

    client.post(
        "/symptoms",
        json={"log_date": date.today().isoformat(), "sleep_hours": 4.5},
        headers=auth_headers,
    )
    resp = client.post("/ai/chat", json={"message": "Why am I so tired?"}, headers=auth_headers)
    body = resp.json()
    assert "wellness guidance" in body["reply"]
    assert "\n- " in body["reply"]  # a real recommendation bullet, not just an apology


def test_ai_chat_persists_session_history(client, auth_headers):
    first = client.post("/ai/chat", json={"message": "Hello"}, headers=auth_headers)
    session_id = first.json()["session_id"]

    second = client.post(
        "/ai/chat",
        json={"message": "Follow up question", "session_id": session_id},
        headers=auth_headers,
    )
    assert second.status_code == 200
    assert second.json()["session_id"] == session_id
