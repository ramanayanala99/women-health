from datetime import date


def test_monthly_report_generation_and_caching(client, auth_headers):
    today = date.today()
    client.post(
        "/symptoms",
        json={
            "log_date": today.replace(day=min(today.day, 28)).isoformat(),
            "mood": 4,
            "energy": 3,
            "sleep_hours": 7,
            "stress": 2,
            "symptoms": ["cramps"],
        },
        headers=auth_headers,
    )

    resp = client.get(f"/reports/monthly?year={today.year}&month={today.month}", headers=auth_headers)
    assert resp.status_code == 200
    body = resp.json()
    assert body["summary"]["days_logged"] == 1
    assert "not a diagnosis" in body["summary"]["note"]

    # second call should return the cached report, not a duplicate
    again = client.get(f"/reports/monthly?year={today.year}&month={today.month}", headers=auth_headers)
    assert again.status_code == 200
    assert again.json()["id"] == body["id"]
