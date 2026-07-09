from datetime import date, timedelta


def test_insights_detects_sleep_mood_pattern(client, auth_headers):
    start = date.today() - timedelta(days=6)

    for i in range(7):
        log_date = start + timedelta(days=i)
        resp = client.post(
            "/symptoms",
            json={
                "log_date": log_date.isoformat(),
                "mood": min(i + 1, 5),  # rises 1..5 then plateaus, staying within the 1-5 scale
                "sleep_hours": 5 + i,  # 5..11, strictly increasing, strongly correlated with next-day mood
            },
            headers=auth_headers,
        )
        assert resp.status_code == 201

    resp = client.get("/insights", headers=auth_headers)
    assert resp.status_code == 200
    insights = resp.json()
    titles = [row["title"] for row in insights]
    assert any("Sleep" in title for title in titles)


def test_insights_empty_with_too_few_logs(client, auth_headers):
    resp = client.get("/insights", headers=auth_headers)
    assert resp.status_code == 200
    assert resp.json() == []
