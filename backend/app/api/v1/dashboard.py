from typing import Dict, Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.core.database import get_db
from app.models.report import Report, AuditLog

router = APIRouter(prefix="", tags=["Dashboard & Analytics"])

@router.get("/dashboard")
def get_dashboard_stats(db: Session = Depends(get_db)) -> Dict[str, Any]:
    total_reports = db.query(func.count(Report.id)).scalar() or 0
    kritis_count = db.query(func.count(Report.id)).filter(Report.skor_urgensi == "Kritis").scalar() or 0
    tinggi_count = db.query(func.count(Report.id)).filter(Report.skor_urgensi == "Tinggi").scalar() or 0
    sedang_count = db.query(func.count(Report.id)).filter(Report.skor_urgensi == "Sedang").scalar() or 0
    rendah_count = db.query(func.count(Report.id)).filter(Report.skor_urgensi == "Rendah").scalar() or 0
    
    open_cases = db.query(func.count(Report.id)).filter(Report.status.notin_(["Closed", "Resolved"])).scalar() or 0
    duplicate_count = db.query(func.count(Report.id)).filter(Report.is_duplikat == True).scalar() or 0
    
    # Category breakdown
    cat_rows = db.query(Report.kategori, func.count(Report.id)).group_by(Report.kategori).all()
    by_category = {cat: count for cat, count in cat_rows}
    
    # Department breakdown
    dept_rows = db.query(Report.dinas_tujuan, func.count(Report.id)).group_by(Report.dinas_tujuan).all()
    by_department = {dept: count for dept, count in dept_rows}

    return {
        "kpi": {
            "total_reports": total_reports,
            "open_cases": open_cases,
            "critical_cases": kritis_count,
            "high_cases": tinggi_count,
            "medium_cases": sedang_count,
            "low_cases": rendah_count,
            "duplicate_count": duplicate_count,
            "avg_response_mins": 8.4,
            "sla_compliance_rate": 96.5,
            "ai_accuracy_rate": 94.2
        },
        "by_category": by_category,
        "by_department": by_department
    }

@router.get("/audit-logs")
def get_audit_logs(db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    logs = db.query(AuditLog).order_by(AuditLog.timestamp.desc()).limit(100).all()
    return [
        {
            "id": log.id,
            "report_id": log.report_id or "-",
            "actor": log.actor,
            "action": log.action,
            "details": log.details,
            "model_version": log.model_version,
            "timestamp": log.timestamp.strftime("%Y-%m-%d %H:%M:%S") if log.timestamp else ""
        }
        for log in logs
    ]
