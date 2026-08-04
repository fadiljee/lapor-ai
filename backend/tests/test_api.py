from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "online"

def test_reports_list():
    res = client.get("/api/v1/reports")
    assert res.status_code == 200
    reports = res.json()
    assert isinstance(reports, list)
    assert len(reports) > 0

def test_create_report():
    payload = {
        "kategori": "Infrastruktur",
        "deskripsi": "Jalan berlubang besar di depan Gang Melati NIK 1234567890123456 HP 081234567890",
        "lokasi_alamat": "Gang Melati No 5",
        "is_anonim": True
    }
    res = client.post("/api/v1/reports", json=payload)
    assert res.status_code == 201
    data = res.json()
    assert "LP-2026" in data["id"]
    assert "[REDACTED_NIK]" in data["deskripsi_masked"]
    assert "[REDACTED_PHONE]" in data["deskripsi_masked"]

def test_dashboard():
    res = client.get("/api/v1/dashboard")
    assert res.status_code == 200
    data = res.json()
    assert "kpi text" not in data
    assert "total_reports" in data["kpi"]

def test_audit_logs():
    res = client.get("/api/v1/audit-logs")
    assert res.status_code == 200
    logs = res.json()
    assert isinstance(logs, list)

if __name__ == "__main__":
    test_health()
    test_reports_list()
    test_create_report()
    test_dashboard()
    test_audit_logs()
    print("All FastAPI integration tests passed successfully!")
