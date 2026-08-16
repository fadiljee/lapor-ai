import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    nama = Column(String, nullable=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="warga")                               
    instansi = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class EmailVerification(Base):
    __tablename__ = "email_verifications"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, index=True, nullable=False)
    otp_code = Column(String, nullable=False)
    expired_at = Column(DateTime, nullable=False)
    status = Column(String, default="pending")                             
    last_requested_at = Column(DateTime, default=datetime.datetime.utcnow)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Report(Base):
    __tablename__ = "reports"

    id = Column(String, primary_key=True, index=True)                          
    pelapor_email = Column(String, nullable=True)
    is_anonim = Column(Boolean, default=False)
    email_verified = Column(Boolean, default=False)
    
                             
    deskripsi_asli = Column(Text, nullable=False)
    deskripsi_masked = Column(Text, nullable=False)
    text_fingerprint = Column(String, index=True, nullable=False)
    
    kategori = Column(String, default="Lainnya")
    skor_urgensi = Column(String, default="Sedang")                                 
    alasan_urgensi = Column(Text, nullable=True)
    ringkasan = Column(Text, nullable=True)
    bahasa_terdeteksi = Column(String, default="Bahasa Indonesia")
    confidence_score = Column(Float, default=0.90)
    
    entitas = Column(JSON, nullable=True)                        
    
    lokasi_alamat = Column(String, nullable=True)
    lokasi_lat = Column(Float, nullable=True)
    lokasi_lng = Column(Float, nullable=True)
    
    lampiran_path = Column(String, nullable=True)
    
    dinas_tujuan = Column(String, default="Disposisi Manual")
    is_duplikat = Column(Boolean, default=False)
    duplikat_of_id = Column(String, nullable=True)
    
    status = Column(String, default="Menunggu Verifikasi AI")                                                                                                                                        
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class AIAnalysisLog(Base):
    __tablename__ = "ai_analysis_logs"

    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(String, ForeignKey("reports.id"), nullable=False)
    model_used = Column(String, nullable=False)
    provider = Column(String, default="Groq API")                              
    retry_count = Column(Integer, default=0)
    latency_ms = Column(Integer, default=0)
    raw_prompt = Column(Text, nullable=True)
    raw_response = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

class Feedback(Base):
    __tablename__ = "feedbacks"

    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(String, ForeignKey("reports.id"), nullable=False)
    petugas_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    keputusan_akhir = Column(String, nullable=False)
    koreksi_ai = Column(Boolean, default=False)
    kategori_lama = Column(String, nullable=True)
    kategori_baru = Column(String, nullable=True)
    urgensi_lama = Column(String, nullable=True)
    urgensi_baru = Column(String, nullable=True)
    catatan = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(String, nullable=True)
    actor = Column(String, nullable=False)                              
    action = Column(String, nullable=False)
    details = Column(Text, nullable=True)
    model_version = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
