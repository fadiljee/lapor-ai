import datetime
import random
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.report import Report, AIAnalysisLog, Feedback, AuditLog, EmailVerification
from app.schemas.report import ReportCreate, ReportResponse, ReportOverride
from app.services.pii_masking_service import pii_masking_service
from app.services.prompt_injection_guard import prompt_injection_guard
from app.services.llm_orchestrator import llm_orchestrator
from app.services.department_routing_service import department_routing_service
from app.services.duplicate_detection_service import duplicate_detection_service
from app.services.auth_service import auth_service

router = APIRouter(prefix="/reports", tags=["Reports"])

def generate_ticket_id() -> str:
    now_str = datetime.datetime.utcnow().strftime("%Y-%m-%d")
    seq = random.randint(1000, 9999)
    return f"LP-{now_str}-{seq}"

@router.post("", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
def create_report(req: ReportCreate, db: Session = Depends(get_db)):
    ticket_id = generate_ticket_id()
    
    # 1. PII Masking
    masked_desc = pii_masking_service.mask_text(req.deskripsi)
    
    # 2. Text Fingerprint & Duplicate Detection
    fingerprint = duplicate_detection_service.generate_fingerprint(req.deskripsi)
    existing_duplicate = db.query(Report).filter(Report.text_fingerprint == fingerprint).first()
    is_duplicate = existing_duplicate is not None
    
    # 3. Prompt Injection Guard & LLM Analysis
    wrapped_prompt = prompt_injection_guard.sanitize_and_wrap(masked_desc)
    ai_res = llm_orchestrator.analyze_report(wrapped_prompt, req.preset_type)
    
    # 4. Department Lookup
    dinas = department_routing_service.get_department(ai_res.get("kategori", "Lainnya"))
    
    # Status determination
    initial_status = "Pending Email Verification" if (not req.is_anonim and req.email) else "Terverifikasi AI"
    if is_duplicate:
        initial_status = "Perlu Verifikasi Manual"
        
    email_verified = req.is_anonim
    
    # Create Report entity
    new_report = Report(
        id=ticket_id,
        pelapor_email=req.email if not req.is_anonim else None,
        is_anonim=req.is_anonim,
        email_verified=email_verified,
        deskripsi_asli=req.deskripsi,
        deskripsi_masked=masked_desc,
        text_fingerprint=fingerprint,
        kategori=ai_res.get("kategori", req.kategori or "Lainnya"),
        skor_urgensi=ai_res.get("skor_urgensi", "Sedang"),
        alasan_urgensi=ai_res.get("alasan_urgensi", ""),
        ringkasan=ai_res.get("ringkasan", ""),
        bahasa_terdeteksi=ai_res.get("bahasa_terdeteksi", "Bahasa Indonesia"),
        confidence_score=ai_res.get("confidence_score", 0.90),
        entitas=ai_res.get("entitas", []),
        lokasi_alamat=req.lokasi_alamat or "Lokasi tidak ditentukan",
        lokasi_lat=req.lokasi_lat,
        lokasi_lng=req.lokasi_lng,
        lampiran_path=req.lampiran_path,
        dinas_tujuan=dinas,
        is_duplikat=is_duplicate,
        duplikat_of_id=existing_duplicate.id if existing_duplicate else None,
        status=initial_status
    )
    
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    
    # Create AI Analysis Log
    analysis_log = AIAnalysisLog(
        report_id=ticket_id,
        model_used=ai_res.get("provider", "Groq API"),
        provider=ai_res.get("provider", "Groq API"),
        retry_count=0,
        latency_ms=ai_res.get("latency_ms", 120),
        raw_prompt=wrapped_prompt,
        raw_response=str(ai_res)
    )
    db.add(analysis_log)
    
    # Create Audit Log
    audit = AuditLog(
        report_id=ticket_id,
        actor="AI Triage Engine",
        action="CREATE_AND_TRIAGE",
        details=f"Klasifikasi: {new_report.kategori}, Urgensi: {new_report.skor_urgensi}, Status: {new_report.status}",
        model_version=ai_res.get("provider", "Groq API")
    )
    db.add(audit)
    
    # If requires OTP verification
    if not req.is_anonim and req.email:
        otp_code = auth_service.generate_otp()
        verification = EmailVerification(
            email=req.email,
            otp_code=otp_code,
            expired_at=datetime.datetime.utcnow() + datetime.timedelta(minutes=10),
            status="pending"
        )
        db.add(verification)
    
    db.commit()
    
    return _format_report_response(new_report)

@router.get("", response_model=List[ReportResponse])
def get_reports(
    status_filter: Optional[str] = Query(None, alias="status"),
    urgensi_filter: Optional[str] = Query(None, alias="urgensi"),
    kategori_filter: Optional[str] = Query(None, alias="kategori"),
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Report)
    
    if status_filter:
        query = query.filter(Report.status == status_filter)
    if urgensi_filter:
        query = query.filter(Report.skor_urgensi == urgensi_filter)
    if kategori_filter:
        query = query.filter(Report.kategori == kategori_filter)
    if search:
        query = query.filter(
            (Report.id.like(f"%{search}%")) | 
            (Report.deskripsi_masked.like(f"%{search}%")) |
            (Report.lokasi_alamat.like(f"%{search}%"))
        )
        
    # Sort by Urgency priority (Kritis first) then newest created_at
    reports = query.all()
    urgency_order = {"Kritis": 1, "Tinggi": 2, "Sedang": 3, "Rendah": 4}
    reports.sort(key=lambda r: (urgency_order.get(r.skor_urgensi, 5), r.created_at), reverse=False)
    
    return [_format_report_response(r) for r in reports]

@router.get("/{report_id}", response_model=ReportResponse)
def get_report_detail(report_id: str, db: Session = Depends(get_db)):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Laporan tidak ditemukan")
    return _format_report_response(report)

@router.patch("/{report_id}", response_model=ReportResponse)
def override_report(report_id: str, req: ReportOverride, db: Session = Depends(get_db)):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Laporan tidak ditemukan")
        
    kategori_lama = report.kategori
    urgensi_lama = report.skor_urgensi
    
    if req.kategori:
        report.kategori = req.kategori
    if req.skor_urgensi:
        report.skor_urgensi = req.skor_urgensi
    if req.dinas_tujuan:
        report.dinas_tujuan = req.dinas_tujuan
    if req.status:
        report.status = req.status
        
    report.updated_at = datetime.datetime.utcnow()
    
    # Save Feedback entry
    feedback = Feedback(
        report_id=report_id,
        petugas_id=1, # Default Officer
        keputusan_akhir=report.status,
        koreksi_ai=bool(req.kategori or req.skor_urgensi),
        kategori_lama=kategori_lama,
        kategori_baru=report.kategori,
        urgensi_lama=urgensi_lama,
        urgensi_baru=report.skor_urgensi,
        catatan=req.catatan or "Dikoreksi oleh Petugas Triage"
    )
    db.add(feedback)
    
    # Save Audit Log
    audit = AuditLog(
        report_id=report_id,
        actor="Petugas Verifikator",
        action="OVERRIDE_REPORT",
        details=f"Kategori: {kategori_lama} -> {report.kategori}, Urgensi: {urgensi_lama} -> {report.skor_urgensi}, Dinas: {report.dinas_tujuan}",
        model_version="Human-in-the-Loop"
    )
    db.add(audit)
    
    db.commit()
    db.refresh(report)
    
    return _format_report_response(report)

def _format_report_response(r: Report) -> ReportResponse:
    entitas_list = r.entitas if isinstance(r.entitas, list) else []
    return ReportResponse(
        id=r.id,
        pelapor_email=r.pelapor_email,
        is_anonim=r.is_anonim,
        email_verified=r.email_verified,
        deskripsi_masked=r.deskripsi_masked,
        kategori=r.kategori,
        skor_urgensi=r.skor_urgensi,
        alasan_urgensi=r.alasan_urgensi or "",
        ringkasan=r.ringkasan or "",
        bahasa_terdeteksi=r.bahasa_terdeteksi or "Bahasa Indonesia",
        confidence_score=r.confidence_score or 0.90,
        entitas=entitas_list,
        lokasi_alamat=r.lokasi_alamat or "Tidak ditentukan",
        dinas_tujuan=r.dinas_tujuan,
        is_duplikat=r.is_duplikat,
        status=r.status,
        created_at=r.created_at.strftime("%Y-%m-%d %H:%M:%S") if r.created_at else "",
        updated_at=r.updated_at.strftime("%Y-%m-%d %H:%M:%S") if r.updated_at else ""
    )
