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
