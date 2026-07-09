def test_create_and_list_cycles_with_backfill(client, auth_headers):
    first = client.post(
        "/cycles",
        json={"start_date": "2026-05-01", "period_length_days": 5, "flow_intensity": "medium"},
        headers=auth_headers,
    )
    assert first.status_code == 201
    assert first.json()["cycle_length_days"] is None

    second = client.post(
        "/cycles",
        json={"start_date": "2026-05-29", "period_length_days": 5},
        headers=auth_headers,
    )
    assert second.status_code == 201

    listed = client.get("/cycles", headers=auth_headers)
    assert listed.status_code == 200
    rows = {row["start_date"]: row for row in listed.json()}
    # the first cycle should now have its length backfilled: 28 days to the second
    assert rows["2026-05-01"]["cycle_length_days"] == 28


def test_create_and_list_symptoms(client, auth_headers):
    resp = client.post(
        "/symptoms",
        json={
            "log_date": "2026-05-03",
            "mood": 4,
            "energy": 3,
            "stress": 2,
            "pain_level": 1,
            "sleep_hours": 7.5,
            "symptoms": ["cramps"],
            "cravings": ["chocolate"],
            "notes": "Felt pretty good today.",
        },
        headers=auth_headers,
    )
    assert resp.status_code == 201
    body = resp.json()
    assert body["notes"] == "Felt pretty good today."  # round-trips through encryption transparently
    assert body["symptoms"] == ["cramps"]

    listed = client.get("/symptoms", headers=auth_headers)
    assert listed.status_code == 200
    assert len(listed.json()) == 1

    filtered = client.get("/symptoms?start=2026-06-01", headers=auth_headers)
    assert filtered.status_code == 200
    assert filtered.json() == []
