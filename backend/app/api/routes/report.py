from fastapi import APIRouter, HTTPException, status, Form
from typing import Optional
from datetime import datetime, timezone, timedelta
from app.core.database import SessionLocal, Report, User, EmailVerification, Notification
from app.services.llm_service import LLMService
from app.utils.pii_masking import mask_pii, generate_fingerprint

router = APIRouter(prefix='/api')

llm_service = LLMService()


@router.post('/submit-report')
def submit_report(
    kategori: str = Form(...),
    deskripsi: str = Form(...),
    email: Optional[str] = Form(None),
    is_anonymous: bool = Form(False),
    lampiran: Optional[bytes] = Form(None)
):
    """Handle warga form submission"""

    db = SessionLocal()
    try:
        if not is_anonymous:
            verification = EmailVerification(
                email=email,
                status='pending',
                expires_at=datetime.now(timezone.utc) + timedelta(minutes=10)
            )
            db.add(verification)
            db.commit()
            db.refresh(verification)
        else:
            verification = None

        masked_text = mask_pii(deskripsi)
        text_fingerprint = generate_fingerprint(masked_text)

        analysis = llm_service.analyze_report(
            masked_text,
            bahasa='id' if 'bahasa bangka' not in deskripsi.lower() else 'bg'
        )

        if not analysis:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail='LLM analysis failed after all fallbacks'
            )

        new_report = Report(
            kategori=kategori,
            deskripsi=deskripsi,
            deskripsi_masked=masked_text,
            text_fingerprint=text_fingerprint,
            status='menunggu_verifikasi_ai' if not is_anonymous else 'verifikasi_email',
            skor_urgensi=analysis['skor_urgensi'],
            bahasa_terdeteksi=analysis['bahasa_terdeteksi']
        )
        db.add(new_report)
        db.commit()
        db.refresh(new_report)

        if not is_anonymous and verification:
            notification = Notification(
                user_id=verification.id if verification.id else None,
                report_id=new_report.id,
                tipe='status_initial',
                status_kirim='pending'
            )
            db.add(notification)
            db.commit()

        return {
            'report_id': new_report.id,
            'status': new_report.status,
            'urgency': new_report.skor_urgensi,
            'timestamp': new_report.created_at.isoformat()
        }

    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
    finally:
        db.close()


@router.get('/status/{report_id}')
def get_report_status(report_id: int):
    """Retrieve laporan status by ID"""

    db = SessionLocal()
    try:
        report = db.query(Report).filter(Report.id == report_id).first()
        if not report:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail='Laporan tidak ditemukan'
            )
        return {
            'id': report.id,
            'status': report.status,
            'urgency': report.skor_urgensi,
            'created_at': report.created_at.isoformat()
        }
    finally:
        db.close()


@router.post('/verify-email')
def verify_email(email: str, otp: str):
    """Verify email address for non-anonymous reports"""

    db = SessionLocal()
    try:
        verification = (
            db.query(EmailVerification)
            .filter(EmailVerification.email == email)
            .first()
        )
        if not verification or verification.status != 'pending':
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail='Email verification failed'
            )

        if otp != verification.otp or verification.expires_at < datetime.now(timezone.utc):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail='Invalid OTP or expired verification'
            )

        verification.status = 'verified'
        db.commit()
        db.refresh(verification)
        return {'status': 'success'}
    finally:
        db.close()