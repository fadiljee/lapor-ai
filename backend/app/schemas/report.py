from typing import Optional, List
from pydantic import BaseModel, EmailStr

class ReportCreate(BaseModel):
    kategori: Optional[str] = "Lainnya"
    deskripsi: str
    lokasi_alamat: Optional[str] = None
    lokasi_lat: Optional[float] = None
    lokasi_lng: Optional[float] = None
    is_anonim: bool = False
    email: Optional[str] = None
    lampiran_path: Optional[str] = None
    preset_type: Optional[str] = None

class ReportResponse(BaseModel):
    id: str
    pelapor_email: Optional[str] = None
    is_anonim: bool
    email_verified: bool
    deskripsi_masked: str
    kategori: str
    skor_urgensi: str
    alasan_urgensi: Optional[str] = None
    ringkasan: Optional[str] = None
    bahasa_terdeteksi: Optional[str] = None
    confidence_score: Optional[float] = 0.90
    entitas: Optional[List[str]] = []
    lokasi_alamat: Optional[str] = None
    lampiran_path: Optional[str] = None
    dinas_tujuan: str
    is_duplikat: bool
    status: str
    created_at: str
    updated_at: str

class ReportOverride(BaseModel):
    kategori: Optional[str] = None
    skor_urgensi: Optional[str] = None
    dinas_tujuan: Optional[str] = None
    status: Optional[str] = None
    catatan: Optional[str] = None

class VerifyOTPRequest(BaseModel):
    email: str
    otp_code: str

class ResendOTPRequest(BaseModel):
    email: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserRegister(BaseModel):
    email: str
    password: str
    nama: str
    role: Optional[str] = "warga"
    instansi: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    nama: str
