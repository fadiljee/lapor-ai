import datetime
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import engine, Base, SessionLocal
from app.api.v1 import report as report_router
from app.api.v1 import auth as auth_router
from app.api.v1 import dashboard as dashboard_router
from app.models.report import Report, AuditLog

# Create DB Tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="LAPOR-AI API — Sistem Pengaduan Warga Terintegrasi LLM"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(report_router.router, prefix=settings.API_V1_STR)
app.include_router(auth_router.router, prefix=settings.API_V1_STR)
app.include_router(dashboard_router.router, prefix=settings.API_V1_STR)

@app.get("/health")
def health_check():
    return {"status": "online", "system": settings.PROJECT_NAME, "version": settings.VERSION}

# Seed Demo Data if Database is Empty
def seed_demo_data():
    db: Session = SessionLocal()
    try:
        if db.query(Report).count() == 0:
            demo_reports = [
                Report(
                    id="LP-2026-08-0000412",
                    pelapor_email="warga1@example.com",
                    is_anonim=False,
                    email_verified=True,
                    deskripsi_asli="Ada kebakaran di Pasar Sekanak RT 03! Api makin gede nak keno uma warga dide jauh dari lokasi!",
                    deskripsi_masked="Ada kebakaran di Pasar Sekanak RT 03! Api makin gede nak keno uma warga dide jauh dari lokasi!",
                    text_fingerprint="fp1",
                    kategori="Keamanan/Bencana",
                    skor_urgensi="Kritis",
                    alasan_urgensi="Indikasi kebakaran aktif di pemukiman padat yang mengancam keselamatan jiwa secara langsung.",
                    ringkasan="Kebakaran pasar meluas menuju pemukiman warga di RT 03.",
                    bahasa_terdeteksi="Bahasa Bangka",
                    confidence_score=0.96,
                    entitas=["Pasar Sekanak RT 03", "Pemukiman Warga"],
                    lokasi_alamat="Pasar Sekanak, Pangkalpinang, Bangka Belitung",
                    dinas_tujuan="Badan Penanggulangan Bencana Daerah (BPBD)",
                    status="Terverifikasi AI",
                    created_at=datetime.datetime.utcnow() - datetime.timedelta(minutes=15)
                ),
                Report(
                    id="LP-2026-08-0000409",
                    pelapor_email="warga2@example.com",
                    is_anonim=False,
                    email_verified=True,
                    deskripsi_asli="Kabel listrik PLN terkelupas menjuntai ke jalan dan tiang hampir roboh di Jalan Merdeka depan SD 01.",
                    deskripsi_masked="Kabel listrik PLN terkelupas menjuntai ke jalan dan tiang hampir roboh di Jalan Merdeka depan SD 01.",
                    text_fingerprint="fp2",
                    kategori="Infrastruktur",
                    skor_urgensi="Tinggi",
                    alasan_urgensi="Kabel bertegangan tinggi menjuntai di area pejalan kaki anak sekolah berpotensi tersengat dalam 24 jam.",
                    ringkasan="Kabel listrik terkelupas & tiang miring di depan sekolah.",
                    bahasa_terdeteksi="Bahasa Indonesia",
                    confidence_score=0.93,
                    entitas=["Jalan Merdeka", "SD 01"],
                    lokasi_alamat="Jl. Merdeka No. 12, Pangkalpinang",
                    dinas_tujuan="Dinas Pekerjaan Umum dan Penataan Ruang (PUPR)",
                    status="Terverifikasi AI",
                    created_at=datetime.datetime.utcnow() - datetime.timedelta(minutes=45)
                ),
                Report(
                    id="LP-2026-08-0000403",
                    pelapor_email=None,
                    is_anonim=True,
                    email_verified=True,
                    deskripsi_asli="Lampu penerangan jalan umum mati total sepanjang 500m di Gang Mawar sejak 3 hari lalu.",
                    deskripsi_masked="Lampu penerangan jalan umum mati total sepanjang 500m di Gang Mawar sejak 3 hari lalu.",
                    text_fingerprint="fp3",
                    kategori="Infrastruktur",
                    skor_urgensi="Sedang",
                    alasan_urgensi="Fasilitas penerangan jalan mati non-darurat namun memicu rawan kejahatan malam.",
                    ringkasan="Penerangan jalan mati sepanjang 500 meter di Gang Mawar.",
                    bahasa_terdeteksi="Bahasa Indonesia",
                    confidence_score=0.88,
                    entitas=["Gang Mawar"],
                    lokasi_alamat="Gang Mawar, Pangkalpinang",
                    dinas_tujuan="Dinas Pekerjaan Umum dan Penataan Ruang (PUPR)",
                    status="Assigned",
                    created_at=datetime.datetime.utcnow() - datetime.timedelta(hours=2)
                ),
                Report(
                    id="LP-2026-08-0000398",
                    pelapor_email="warga4@example.com",
                    is_anonim=False,
                    email_verified=True,
                    deskripsi_asli="Usulan penambahan tempat sampah pilah di area Alun-alun Taman Merdeka.",
                    deskripsi_masked="Usulan penambahan tempat sampah pilah di area Alun-alun Taman Merdeka.",
                    text_fingerprint="fp4",
                    kategori="Lingkungan",
                    skor_urgensi="Rendah",
                    alasan_urgensi="Saran & masukan warga mengenai fasilitas kebersihan publik non-urgensi.",
                    ringkasan="Usulan penambahan bak sampah di Taman Merdeka.",
                    bahasa_terdeteksi="Bahasa Indonesia",
                    confidence_score=0.91,
                    entitas=["Taman Merdeka"],
                    lokasi_alamat="Alun-alun Taman Merdeka",
                    dinas_tujuan="Dinas Lingkungan Hidup (DLH)",
                    status="Closed",
                    created_at=datetime.datetime.utcnow() - datetime.timedelta(days=1)
                )
            ]
            for r in demo_reports:
                db.add(r)
                audit = AuditLog(
                    report_id=r.id,
                    actor="System Seed",
                    action="SEED_DATA",
                    details=f"Demo report created: {r.kategori} ({r.skor_urgensi})",
                    model_version="v1.5 Seed"
                )
                db.add(audit)
            db.commit()
    finally:
        db.close()

seed_demo_data()