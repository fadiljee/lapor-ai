from fastapi import APIRouter, Depends, HTTPException, Request, status
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy.orm import Session
import logging

from app.core.database import get_db
from app.core.rate_limiter import limiter
from app.models.report import SupportMessage, AuditLog
from app.services.email_service import email_service

logger = logging.getLogger("lapor-ai-support")

router = APIRouter(tags=["Support Bantuan Email"])

class SupportContactRequest(BaseModel):
    nama: str = Field(..., min_length=2, max_length=100, description="Nama lengkap pengirim")
    email: EmailStr = Field(..., description="Alamat email aktif pengirim")
    pesan: str = Field(..., min_length=10, max_length=3000, description="Isi pesan atau kendala teknis")

@router.post("/contact", status_code=status.HTTP_201_CREATED)
@limiter.limit("5/hour")
def submit_support_contact(
    request: Request,
    payload: SupportContactRequest,
    db: Session = Depends(get_db)
):
    """
    FR-EM.1 & FR-EM.4: Form Hubungi Kami — Mengirim notifikasi email via Resend
    dan menyimpan log pesan bantuan di database.
    """
    try:
        # 1. Simpan pesan ke database
        support_record = SupportMessage(
            nama=payload.nama,
            email=payload.email,
            pesan=payload.pesan,
            status="pending"
        )
        db.add(support_record)
        db.commit()
        db.refresh(support_record)

        # 2. Kirim Notifikasi Email & Auto-Reply via Resend API
        send_success = email_service.send_support_email(
            nama=payload.nama,
            sender_email=payload.email,
            pesan=payload.pesan
        )

        support_record.status = "sent" if send_success else "failed"
        if not send_success:
            support_record.error_message = "Gagal terhubung ke provider email Resend."

        # 3. Log Audit
        audit = AuditLog(
            report_id=None,
            actor=f"Warga ({payload.email})",
            action="SUPPORT_CONTACT_SENT",
            details=f"Pesan bantuan dikirim oleh {payload.nama} <{payload.email}>. ID Pesan: {support_record.id}",
            model_version="v1.5 Support"
        )
        db.add(audit)
        db.commit()

        return {
            "success": True,
            "message": "Pesan bantuan Anda telah berhasil dikirim. Tim kami akan merespons dalam 1x24 jam.",
            "data": {
                "id": support_record.id,
                "email": support_record.email,
                "status": support_record.status
            }
        }
    except Exception as e:
        db.rollback()
        logger.error(f"Error submitting support contact: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Terjadi kesalahan server saat memproses pesan bantuan Anda."
        )
