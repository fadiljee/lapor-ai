import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.report import User, EmailVerification, Report, AuditLog
from app.schemas.report import UserLogin, Token, VerifyOTPRequest, ResendOTPRequest
from app.services.auth_service import auth_service

router = APIRouter(prefix="", tags=["Authentication & OTP"])

# Demo users pool
DEMO_USERS = {
    "petugas@lapor.go.id": {"nama": "Budi Santoso", "role": "petugas", "instansi": "BPBD"},
    "admin@lapor.go.id": {"nama": "Siti Rahma", "role": "admin", "instansi": "Diskominfo"},
    "supervisor@lapor.go.id": {"nama": "Drs. Hendra", "role": "supervisor", "instansi": "Sekretariat Daerah"},
    "auditor@lapor.go.id": {"nama": "Rina Wijaya, S.H.", "role": "auditor", "instansi": "Inspektorat"}
}

@router.post("/auth/login", response_model=Token)
def login(req: UserLogin, db: Session = Depends(get_db)):
    email_clean = req.email.strip().lower()
    
    # Check demo users or database
    if email_clean in DEMO_USERS:
        u_info = DEMO_USERS[email_clean]
        token = auth_service.create_access_token({"sub": email_clean, "role": u_info["role"]})
        return Token(access_token=token, role=u_info["role"], nama=u_info["nama"])
        
    user = db.query(User).filter(User.email == email_clean).first()
    if not user or not auth_service.verify_password(req.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email atau password salah"
        )
        
    token = auth_service.create_access_token({"sub": user.email, "role": user.role})
    return Token(access_token=token, role=user.role, nama=user.nama or "User")

@router.post("/verify-email")
def verify_email(req: VerifyOTPRequest, db: Session = Depends(get_db)):
    record = db.query(EmailVerification).filter(
        EmailVerification.email == req.email,
        EmailVerification.status == "pending"
    ).order_by(EmailVerification.created_at.desc()).first()
    
    # Allow demo master OTP "123456" or matching database record
    if not record and req.otp_code != "123456":
        raise HTTPException(status_code=400, detail="Kode OTP tidak ditemukan atau sudah kedaluwarsa")
        
    if record and req.otp_code != record.otp_code and req.otp_code != "123456":
        raise HTTPException(status_code=400, detail="Kode OTP salah")
        
    if record:
        record.status = "verified"
        
    # Update associated reports status to Terverifikasi AI
    reports = db.query(Report).filter(
        Report.pelapor_email == req.email,
        Report.status == "Pending Email Verification"
    ).all()
    
    for r in reports:
        r.email_verified = True
        r.status = "Terverifikasi AI" if not r.is_duplikat else "Perlu Verifikasi Manual"
        
    db.commit()
    return {"message": "Email berhasil diverifikasi", "verified": True}

@router.post("/resend-otp")
def resend_otp(req: ResendOTPRequest, db: Session = Depends(get_db)):
    now = datetime.datetime.utcnow()
    last_req = db.query(EmailVerification).filter(
        EmailVerification.email == req.email
    ).order_by(EmailVerification.created_at.desc()).first()
    
    # Enforce 60-second cooldown (FR-EV.6)
    if last_req and (now - last_req.last_requested_at).total_seconds() < 60:
        remaining = 60 - int((now - last_req.last_requested_at).total_seconds())
        raise HTTPException(
            status_code=429,
            detail=f"Tunggu {remaining} detik sebelum meminta ulang kode OTP."
        )
        
    new_otp = auth_service.generate_otp()
    new_record = EmailVerification(
        email=req.email,
        otp_code=new_otp,
        expired_at=now + datetime.timedelta(minutes=10),
        status="pending",
        last_requested_at=now
    )
    db.add(new_record)
    db.commit()
    
    return {"message": "Kode OTP baru telah dikirim", "cooldown_seconds": 60}
