import datetime
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import engine, Base, SessionLocal
from app.api.v1 import report as report_router
from app.api.v1 import auth as auth_router
from app.api.v1 import dashboard as dashboard_router
from app.api.v1 import users as users_router
from app.api.v1 import instansi as instansi_router
from app.models.report import User, AuditLog, Instansi
from app.services.auth_service import auth_service

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="LAPOR-AI API — Sistem Pengaduan Warga Terintegrasi LLM"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

import os
from fastapi.staticfiles import StaticFiles
from slowapi.errors import RateLimitExceeded
from app.core.rate_limiter import limiter, _rate_limit_exceeded_handler

os.makedirs("uploads", exist_ok=True)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.include_router(report_router.router, prefix=settings.API_V1_STR)
app.include_router(auth_router.router, prefix=settings.API_V1_STR)
app.include_router(dashboard_router.router, prefix=settings.API_V1_STR)
app.include_router(users_router.router, prefix=settings.API_V1_STR)
app.include_router(instansi_router.router, prefix=settings.API_V1_STR + "/instansi", tags=["Instansi"])

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/health")
def health_check():
    return {"status": "online", "system": settings.PROJECT_NAME, "version": settings.VERSION}

def seed_initial_users():
    db: Session = SessionLocal()
    try:
        initial_instansi = [
            "Dinas Pekerjaan Umum dan Penataan Ruang (PUPR)",
            "Dinas Lingkungan Hidup (DLH)",
            "Dinas Kesehatan (Dinkes)",
            "Dinas Kependudukan dan Pencatatan Sipil (Disdukcapil)",
            "Dinas Perhubungan (Dishub)",
            "Dinas Sosial (Dinsos)",
            "Satuan Polisi Pamong Praja (Satpol PP)",
            "Badan Penanggulangan Bencana Daerah (BPBD)"
        ]

        for inst in initial_instansi:
            existing_inst = db.query(Instansi).filter(Instansi.nama == inst).first()
            if not existing_inst:
                db.add(Instansi(nama=inst, deskripsi="Dinas Pemerintah Daerah"))

        initial_users = [
            {"email": "warga@lapor.go.id", "nama": "Budi Warga", "role": "warga", "instansi": "Masyarakat"},
            {"email": "petugas@lapor.go.id", "nama": "Budi Santoso", "role": "petugas", "instansi": "Verifikator Pusat"},
            {"email": "admin@lapor.go.id", "nama": "Siti Rahma", "role": "admin", "instansi": "Kominfo (Pusat)"},
            {"email": "dinas.pupr@lapor.go.id", "nama": "Agus PUPR", "role": "dinas", "instansi": "Dinas Pekerjaan Umum dan Penataan Ruang (PUPR)"},
            {"email": "dinas.dlh@lapor.go.id", "nama": "Rini DLH", "role": "dinas", "instansi": "Dinas Lingkungan Hidup (DLH)"},
            {"email": "dinas.dinkes@lapor.go.id", "nama": "Dr. Sarah Dinkes", "role": "dinas", "instansi": "Dinas Kesehatan (Dinkes)"},
            {"email": "dinas.disdukcapil@lapor.go.id", "nama": "Andi Disdukcapil", "role": "dinas", "instansi": "Dinas Kependudukan dan Pencatatan Sipil (Disdukcapil)"},
            {"email": "dinas.dishub@lapor.go.id", "nama": "Tito Dishub", "role": "dinas", "instansi": "Dinas Perhubungan (Dishub)"},
            {"email": "dinas.dinsos@lapor.go.id", "nama": "Wati Dinsos", "role": "dinas", "instansi": "Dinas Sosial (Dinsos)"},
            {"email": "dinas.satpolpp@lapor.go.id", "nama": "Bambang Satpol", "role": "dinas", "instansi": "Satuan Polisi Pamong Praja (Satpol PP)"},
            {"email": "dinas.bpbd@lapor.go.id", "nama": "Bima BPBD", "role": "dinas", "instansi": "Badan Penanggulangan Bencana Daerah (BPBD)"}
        ]
        
        for u in initial_users:
            existing = db.query(User).filter(User.email == u["email"]).first()
            if not existing:
                hashed_pwd = auth_service.hash_password("password123")
                db_user = User(
                    email=u["email"],
                    nama=u["nama"],
                    role=u["role"],
                    instansi=u["instansi"],
                    hashed_password=hashed_pwd
                )
                db.add(db_user)
                
                audit = AuditLog(
                    report_id=None,
                    actor="System Seed",
                    action="SEED_USER",
                    details=f"User database record created: {u['email']} ({u['role']})",
                    model_version="v1.5 Seed"
                )
                db.add(audit)
        db.commit()
    finally:
        db.close()

seed_initial_users()