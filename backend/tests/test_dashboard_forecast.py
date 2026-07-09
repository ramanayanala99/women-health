from datetime import date, timedelta


def test_forecast_with_no_data(client, auth_headers):
    resp = client.get("/forecast", headers=auth_headers)
    assert resp.status_code == 200
    body = resp.json()
    assert body["has_data"] is False
    assert body["confidence"] == 0.0


def test_forecast_and_dashboard_after_logging_cycles(client, auth_headers):
    today = date.today()
    # Four cycles logged 28 days apart, the last one starting 14 days ago.
    cycle_starts = [today - timedelta(days=offset) for offset in (98, 70, 42, 14)]

    for start in cycle_starts:
        resp = client.post(
            "/cycles",
            json={"start_date": start.isoformat(), "period_length_days": 5},
            headers=auth_headers,
        )
        assert resp.status_code == 201

    forecast = client.get("/forecast", headers=auth_headers)
    assert forecast.status_code == 200
    body = forecast.json()
    assert body["has_data"] is True
    assert body["current_cycle_day"] == 15
    assert body["current_phase"] in {"menstrual", "follicular", "ovulation", "luteal"}
    assert body["avg_cycle_length_days"] == 28.0
    assert body["confidence"] > 0

    dashboard = client.get("/dashboard", headers=auth_headers)
    assert dashboard.status_code == 200
    dash_body = dashboard.json()
    assert dash_body["forecast"]["current_cycle_day"] == 15
    assert "does not diagnose" in dash_body["disclaimer"]
    assert len(dash_body["recommendations"]) >= 1
