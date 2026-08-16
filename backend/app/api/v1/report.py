import datetime
import random
import shutil
import os
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status, Query, Form, File, UploadFile, Request
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.models.report import Report, AIAnalysisLog, Feedback, AuditLog, EmailVerification, User
from app.schemas.report import ReportResponse, ReportOverride
from app.services.pii_masking_service import pii_masking_service
from app.services.prompt_injection_guard import prompt_injection_guard
from app.services.llm_orchestrator import llm_orchestrator
from app.services.department_routing_service import department_routing_service
from app.services.duplicate_detection_service import duplicate_detection_service
from app.services.auth_service import auth_service
from app.services.email_service import email_service
from app.core.rate_limiter import limiter
from app.core.security import get_current_user, require_roles

router = APIRouter(prefix="/reports", tags=["Reports"])

def generate_ticket_id() -> str:
    now_str = datetime.datetime.utcnow().strftime("%Y-%m-%d")
    seq = random.randint(1000, 9999)
    return f"LP-{now_str}-{seq}"

@router.get("/test-ai")
@limiter.limit("10/minute")
def test_ai_connection(request: Request, current_user: User = Depends(get_current_user)):
    try:
        dummy_prompt = prompt_injection_guard.sanitize_and_wrap("Test koneksi infrastruktur jalan berlubang")
        ai_res = llm_orchestrator.analyze_report(dummy_prompt, "default")
        return {"status": "connected", "ai_response": ai_res}
    except Exception as e:
        return {"status": "disconnected", "error": str(e)}

@router.post("", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("5/minute")
def create_report(
    request: Request,
    current_user: User = Depends(require_roles(["warga"])),
    kategori: str = Form(...),
    deskripsi: str = Form(...),
    lokasi_alamat: Optional[str] = Form(None),
    lokasi_lat: Optional[float] = Form(None),
    lokasi_lng: Optional[float] = Form(None),
    is_anonim: bool = Form(False),
    email: Optional[str] = Form(None),
    pelapor_email: Optional[str] = Form(None),
    preset_type: Optional[str] = Form(None),
    lampiran: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    ticket_id = generate_ticket_id()
    target_email = (pelapor_email or email or "").strip()
    
    # Tangani penyimpanan file lampiran fisik (jika ada)
    lampiran_path = None
    if lampiran and lampiran.filename:
        upload_dir = "uploads"
        os.makedirs(upload_dir, exist_ok=True)
        lampiran_path = f"{upload_dir}/{ticket_id}_{lampiran.filename}"
        with open(lampiran_path, "wb") as buffer:
            shutil.copyfileobj(lampiran.file, buffer)
    
    # 1. PII Masking
    masked_desc = pii_masking_service.mask_text(deskripsi)
    
    # 2. Text Fingerprint & Duplicate Detection
    fingerprint = duplicate_detection_service.generate_fingerprint(deskripsi)
    existing_duplicate = db.query(Report).filter(Report.text_fingerprint == fingerprint).first()
    is_duplicate = existing_duplicate is not None
    
    # 3. Prompt Injection Guard & LLM Analysis
    wrapped_prompt = prompt_injection_guard.sanitize_and_wrap(masked_desc)
    ai_res = llm_orchestrator.analyze_report(wrapped_prompt, preset_type)
    
    # 4. Department Lookup
    dinas = department_routing_service.get_department(ai_res.get("kategori", "Lainnya"))
    
    # Status determination
    initial_status = "Pending Email Verification" if (not is_anonim and target_email) else "Terverifikasi AI"
    if is_duplicate:
        initial_status = "Perlu Verifikasi Manual"
        
    email_verified = is_anonim
    
    # Create Report entity
    new_report = Report(
        id=ticket_id,
        pelapor_email=target_email if not is_anonim else None,
        is_anonim=is_anonim,
        email_verified=email_verified,
        deskripsi_asli=deskripsi,
        deskripsi_masked=masked_desc,
        text_fingerprint=fingerprint,
        kategori=ai_res.get("kategori", kategori or "Lainnya"),
        skor_urgensi=ai_res.get("skor_urgensi", "Sedang"),
        alasan_urgensi=ai_res.get("alasan_urgensi", ""),
        ringkasan=ai_res.get("ringkasan", ""),
        bahasa_terdeteksi=ai_res.get("bahasa_terdeteksi", "Bahasa Indonesia"),
        confidence_score=ai_res.get("confidence_score", 0.90),
        entitas=ai_res.get("entitas", []),
        lokasi_alamat=lokasi_alamat or "Lokasi tidak ditentukan",
        lokasi_lat=lokasi_lat,
        lokasi_lng=lokasi_lng,
        lampiran_path=lampiran_path,
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
        model_used=ai_res.get("provider", "Google Gemini API"),
        provider=ai_res.get("provider", "Google Gemini API"),
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
        model_version=ai_res.get("provider", "Google Gemini API")
    )
    db.add(audit)
    
    # If requires OTP verification
    if not is_anonim and target_email:
        otp_code = auth_service.generate_otp()
        verification = EmailVerification(
            email=target_email,
            otp_code=otp_code,
            expired_at=datetime.datetime.utcnow() + datetime.timedelta(minutes=15),
            status="pending"
        )
        db.add(verification)
        # Send OTP email via Resend API (lapor-ai.web.id)
        try:
            email_service.send_otp_email(target_email, otp_code, new_report.id)
        except Exception as e:
            print(f"⚠️ Failed to send OTP email: {e}")
    
    db.commit()
    
    return _format_report_response(new_report)

@router.get("", response_model=List[ReportResponse])
@limiter.limit("30/minute")
def get_reports(
    request: Request,
    current_user: User = Depends(get_current_user),
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
        
    reports = query.all()
    urgency_order = {"Kritis": 1, "Tinggi": 2, "Sedang": 3, "Rendah": 4}
    reports.sort(key=lambda r: (urgency_order.get(r.skor_urgensi, 5), r.created_at), reverse=False)
    
    return [_format_report_response(r) for r in reports]

@router.get("/{report_id}", response_model=ReportResponse)
@limiter.limit("30/minute")
def get_report_detail(request: Request, report_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Laporan tidak ditemukan")
    return _format_report_response(report)

@router.patch("/{report_id}", response_model=ReportResponse)
@limiter.limit("20/minute")
def override_report(
    request: Request, 
    report_id: str, 
    req: ReportOverride, 
    current_user: User = Depends(require_roles(["petugas", "admin"])),
    db: Session = Depends(get_db)
):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Laporan tidak ditemukan")
        
    kategori_lama = report.kategori
    urgensi_lama = report.skor_urgensi
    
    if req.kategori:
        report.kategori = req.kategori
        if not req.dinas_tujuan:
            report.dinas_tujuan = department_routing_service.get_department(req.kategori)
            
    if req.skor_urgensi:
        report.skor_urgensi = req.skor_urgensi
    if req.dinas_tujuan:
        report.dinas_tujuan = req.dinas_tujuan
    if req.status:
        report.status = req.status
        
    report.updated_at = datetime.datetime.utcnow()

    feedback = Feedback(
        report_id=report_id,
        petugas_id=current_user.id,
        keputusan_akhir=report.status,
        koreksi_ai=bool(req.kategori or req.skor_urgensi),
        kategori_lama=kategori_lama,
        kategori_baru=report.kategori,
        urgensi_lama=urgensi_lama,
        urgensi_baru=report.skor_urgensi,
        catatan=req.catatan or "Dikoreksi oleh Petugas Triage"
    )
    db.add(feedback)
    
    audit = AuditLog(
        report_id=report_id,
        actor=current_user.nama or "Petugas Verifikator",
        action="OVERRIDE_REPORT",
        details=f"Status: {report.status}, Kategori: {kategori_lama} -> {report.kategori}, Urgensi: {urgensi_lama} -> {report.skor_urgensi}, Dinas: {report.dinas_tujuan}",
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
        lampiran_path=f"{settings.APP_BASE_URL}/{r.lampiran_path}" if r.lampiran_path else None,
        dinas_tujuan=r.dinas_tujuan,
        is_duplikat=r.is_duplikat,
        status=r.status,
        created_at=r.created_at.strftime("%Y-%m-%d %H:%M:%S") if r.created_at else "",
        updated_at=r.updated_at.strftime("%Y-%m-%d %H:%M:%S") if r.updated_at else ""
    )