# 🚨 LAPOR-AI
### Sistem Pengaduan Warga Terintegrasi LLM untuk Triage Urgensi & Routing Penanganan

![Python](https://img.shields.io/badge/Python-3.11%2B-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green)
![React](https://img.shields.io/badge/React-19-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-blue)
![Gemini](https://img.shields.io/badge/Google_Gemini-3.6_Flash-orange)
![Resend](https://img.shields.io/badge/Resend_API-Transactional_Email-black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 📌 Deskripsi

**LAPOR-AI** merupakan sistem pengaduan masyarakat tingkat lanjut berbasis Artificial Intelligence yang memanfaatkan **Large Language Model (Google Gemini API)** untuk membantu proses **triage laporan secara otomatis**.

Sistem ini bertindak sebagai platform pengaduan masyarakat pintar berbasis AI dengan kemampuan:

- 🧠 **Klasifikasi Kategori Multi-Domain**: Mengkategorikan pengaduan ke 8 domain dinas teknis (Infrastruktur, Keamanan/Bencana, Layanan Publik, Lingkungan, Kesehatan, Pendidikan, Ketertiban Umum, Lainnya).
- 🚨 **Triage Urgensi Multi-Tier**: Menentukan skor urgensi (*Kritis*, *Tinggi*, *Sedang*, *Rendah*) secara real-time. Laporan darurat otomatis diangkat ke puncak antrean.
- 📍 **Ekstraksi Entitas & Lokasi**: Mengidentifikasi entitas kunci (lokasi kejadian, pihak terlibat, waktu).
- 📄 **Ringkasan Otomatis (Executive Summary)**: Menghasilkan ringkasan narasional singkat untuk percepatan baca petugas.
- 🔁 **Routing Otomatis & Deterministik**: Menentukan rekomendasi awal dinas/instansi tujuan secara presisi.
- 🛡️ **Pengamanan PII & Safeguard**: Melindungi data pribadi warga (email, nomor telp, NIK) melalui *PII Masking* sebelum dikirim ke LLM, serta dilengkapi *Prompt Injection Guard*.
- ✉️ **Integrasi Email Transaksional Resend**: Pengiriman kode OTP verifikasi email fisik 6-digit (berlaku 15 menit) dari domain resmi `lapor-ai.web.id`.
- 🌐 **Dukungan Bahasa Lokal (Bahasa Bangka & Indonesia)**: Memahami dialek lokal Bahasa Bangka (misal: *nian, banyu, dide', katek, uma*) dan Bahasa Indonesia formal/informal.
- 👨‍💼 **Prinsip Responsible AI (Human-in-the-Loop)**: Memberikan rekomendasi transparan kepada petugas verifikator tanpa pernah mengambil keputusan penanganan akhir secara sepihak.

Project ini dikembangkan sebagai prototipe solusi untuk **FTI FEST 2026** dengan tema:

> **Artificial Intelligence untuk Keamanan Informasi & Efisiensi Layanan Publik**

---

# ✨ Fitur Utama

## 👤 Warga (Public Portal)
- 📝 **Formulir Pengaduan Multi-Step**: Alur pembuatan laporan 4 langkah intuitif dengan GPS picker Leaflet.
- 📸 **Lampiran Dokumen/Foto Bukti**: Unggah bukti pendukung hingga 10 MB dan ditayangkan secara statis di `/uploads`.
- 🔍 **Pelacakan Tiket Real-Time & Navigasi Langsung**: Memantau progres status laporan secara instan menggunakan nomor resi resmi (contoh: `LP-2026-08-0000412`).
- ✉️ **Verifikasi Email OTP Resend (15 Menit)**: Autentikasi email pelapor dengan masa berlaku 15 menit dan cooldown pengiriman 60 detik.
- 🕵️ **Mode Anonim**: Pilihan melapor tanpa mencatat identitas email.

## 🤖 Artificial Intelligence & Safeguards
- 🧠 **Google Gemini 3.6 Flash Integration**: Memanfaatkan mode JSON terstruktur native (`responseMimeType: application/json` & `system_instruction`).
- 🛡️ **PII Masking Service**: Anonimisasi otomatis nomor telepon, email, NIK, dan nomor rekening warga.
- 🔒 **Prompt Injection Protection**: Sanitasi input warga dengan teknik *data wrapping* `<user_report>` agar LLM tidak dapat di-hijack oleh instruksi tersembunyi.
- 🔄 **Multi-Tier Model Fallback**: Skema failover dari Primary Model (`gemini-3.6-flash`) ke Fallback Model (`gemini-2.0-flash`) hingga Local Rule-Based Engine jika terjadi gangguan koneksi.
- 🔎 **Deteksi Laporan Ganda (Duplicate Detection)**: Hashing teks fingerprint untuk menandai laporan serupa yang berpotensi membanjiri antrean.

## 👨‍💼 Petugas & Staff Dashboard (Triage AI)
- 📋 **Antrean Triage Berbasis Urgensi**: Tampilan master-detail yang presisi dengan urutan prioritas otomatis (Kritis terlebih dahulu).
- 🔍 **Pencarian Real-Time Multi-Kolom**: Pencarian instan berdasarkan nomor tiket, deskripsi, kategori, dinas, dan lokasi.
- 🖼️ **Preview Lampiran Bukti Foto**: Penayangan foto/dokumen bukti terlampir langsung pada panel rincian pengaduan.
- ✏️ **Koreksi Manusia (Human Override)**: Hak akses petugas untuk menyetujui rekomendasi AI, mengoreksi kategori/urgensi, atau menandai laporan tidak relevan.
- 📜 **Log Audit Transparan**: Jejak audit kronologis mencatat setiap prediksi AI dan keputusan koreksi petugas.

## 📊 Supervisor & Admin Portal
- 📈 **Grafik Tren Laporan Harian**: Visualisasi interaktif volume harian laporan pengaduan masuk dan rasio pengaduan berurgensi Kritis.
- 🗺️ **Peta Sebaran Lokasi Spasial (OpenStreetMap & Leaflet)**: Peta geospasial titik lokasi pengaduan warga dengan indikator warna level urgensi.
- 📈 **Dashboard Analitik Eksekutif**: Visualisasi KPI agregat real-time dari PostgreSQL (rasio urgensi, akurasi *human agreement*, distribusi dinas).
- ⏱️ **Manajemen SLA**: Matriks target waktu respons pertama dan penyelesaian berdasarkan level urgensi.

---

# 🏗️ Arsitektur Sistem

```
 ┌────────────────────────────────────────────────────────┐
 │      React 19 + Vite + GSAP + Lenis + Leaflet          │
 └───────────────────────────┬────────────────────────────┘
                             │ REST API (JSON / FormData)
                             ▼
 ┌────────────────────────────────────────────────────────┐
 │            FastAPI Backend (Python 3.11+)             │
 ├────────────────────────────────────────────────────────┤
 │  • PII Masking Engine      • Resend Email Service     │
 │  • Injection Guard         • Department Routing       │
 │  • Fingerprint Hasher      • Audit Log Tracer         │
 │  • Static Uploads Handler  • Executive Dashboard API  │
 └───────┬──────────────────────┬──────────────────┬──────┘
         │                      │                  │
         ▼                      ▼                  ▼
 ┌──────────────┐      ┌────────────────┐  ┌──────────────┐
 │ PostgreSQL   │      │ Google Gemini  │  │ Resend API   │
 │ Database     │      │ (3.6 Flash)    │  │ (Emails OTP) │
 └──────────────┘      └────────────────┘  └──────────────┘
```

---

# 🛠 Tech Stack

### Frontend
- **Framework**: React 19, Vite
- **Styling**: Tailwind CSS v4 (Desain Sistem Editorial Resi & Palette Indonesia Govtech)
- **Smooth Scroll & Animation**: GSAP + ScrollTrigger + Lenis Smooth Scroll
- **Spatial Maps**: Leaflet & OpenStreetMap (`window.L`)
- **Routing**: React Router v7
- **Icons**: Lucide React

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **ORM & DB**: SQLAlchemy, Alembic Migrations
- **Authentication**: OAuth2 / JWT (python-jose, passlib)
- **Transactional Email**: Resend API (`resend` & HTTP Client)

### Database & Security
- **Database**: PostgreSQL 16
- **PII Protection**: Regex & Token Masking Service
- **Injection Protection**: System Instruction Context Wrapping

### Large Language Model (AI)
- **Primary LLM**: Google Gemini API (`gemini-3.6-flash`)
- **Fallback LLM**: Google Gemini API (`gemini-2.0-flash`)
- **Emergency Local Engine**: Rule-based Keyword & Heuristic Triage Engine

---

# 📂 Struktur Project

```
lapor-ai/
├── backend/
│   ├── app/
│   │   ├── api/v1/          # Endpoint API (auth, report, dashboard)
│   │   ├── core/            # Config, database setup, security
│   │   ├── models/          # SQLAlchemy ORM models (Report, User, AuditLog, EmailVerification)
│   │   ├── schemas/         # Pydantic validation schemas
│   │   └── services/        # Business logic (llm_orchestrator, email_service, pii_masking, etc.)
│   ├── uploads/             # Berkas lampiran foto/PDF warga (Diabaikan Git)
│   ├── tests/               # Pytest & integration test suite
│   ├── .env                 # Environment configuration (Diabaikan Git)
│   └── requirements.txt     # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/      # UI components (ReportTrendChart, ReportDistributionMap, TicketStub, AIJustificationCard)
│   │   ├── pages/           # Pages (HomePage, SubmitReport, TrackReport, DashboardPetugas, Analytics)
│   │   ├── providers/       # LenisGsapProvider (Smooth Scroll & Reveal Animations)
│   │   └── services/        # API client service layer (api.js)
│   ├── package.json
│   └── vite.config.js
│
├── PRD/                     # Product Requirements Document
├── docker-compose.yaml      # Docker environment setup
├── .gitignore               # Root git ignore configuration
└── README.md
```

---

# 🚀 Panduan Instalasi & Memulai

### 1. Clone Repository

```bash
git clone https://github.com/fadiljee/lapor-ai.git
cd lapor-ai
```

### 🐳 2. Menjalankan dengan Docker & Docker Compose (Rekomendasi)

Proyek ini telah dibungkus menggunakan Docker Containerization (`fadiljee/lapor-ai`):

#### A. Opsi 1: Build & Run Lokal via Docker Compose
```bash
# 1. Buat file .env di dalam folder backend/
cp backend/.env.example backend/.env   # Sesuaikan API Keys jika diperlukan

# 2. Jalankan seluruh stack (PostgreSQL, Backend, & Frontend Nginx)
docker compose up -d --build
```

- 🌐 **Frontend Web App**: `http://localhost` (Port 80 via Nginx Reverse Proxy)
- ⚡ **Backend API**: `http://localhost:8000` (Port 8000 via FastAPI Uvicorn)
- 📄 **API Docs (Swagger UI)**: `http://localhost:8000/docs`

#### B. Opsi 2: Pull Image Langsung dari Docker Hub (`fadiljee/lapor-ai`)

```bash
# Pull Image dari Docker Hub
docker pull fadiljee/lapor-ai-backend:latest
docker pull fadiljee/lapor-ai-frontend:latest

# Jalankan via Docker Compose
docker compose up -d
```

---

### 💻 3. Setup Manual Lokal (Tanpa Docker)

#### A. Setup Backend (FastAPI)

```bash
cd backend

# Buat virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install dependensi
pip install -r requirements.txt
```

Buat file `.env` di dalam folder `backend/`:

```env
PROJECT_NAME="LAPOR-AI Backend"
VERSION="1.5"
SECRET_KEY="lapor-ai-super-secret-key-2026"
DATABASE_URL="postgresql://postgres:password@localhost:5432/lapor_ai"
APP_BASE_URL="http://localhost"

# Google Gemini LLM Credentials
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
GEMINI_BASE_URL="https://generativelanguage.googleapis.com/v1beta"
PRIMARY_MODEL="gemini-3.6-flash"
FALLBACK_MODEL="gemini-2.0-flash"

# Resend Transactional Email Credentials
RESEND_API_KEY="YOUR_RESEND_API_KEY"
RESEND_FROM_EMAIL="LAPOR-AI <noreply@lapor-ai.web.id>"
```

Jalankan server backend FastAPI:

```bash
uvicorn app.main:app --reload --port 8000
```

Dokumentasi API Interactive (Swagger UI) dapat diakses di `http://localhost:8000/docs`.

#### B. Setup Frontend (React + Vite)

```bash
cd ../frontend

# Install dependensi Node
npm install

# Jalankan server dev Vite
npm run dev
```

Aplikasi web dapat diakses di `http://localhost:5173`.

---

# 👥 Akun Demo Penjurian / Testing

Tersedia akun default untuk pengujian dashboard berdasarkan peran (Password default: `password123`):

| Peran / Role | Email | Nama Demo | Akses Halaman |
|---|---|---|---|
| **Warga Pelapor** | `warga@lapor.go.id` | Budi Warga | Portal Warga & Form Lapor |
| **Petugas Triage** | `petugas@lapor.go.id` | Budi Santoso | Antrean Triage Pengaduan |
| **Admin Instansi** | `admin@lapor.go.id` | Siti Rahma | Routing Dinas & SLA |
| **Supervisor** | `supervisor@lapor.go.id` | Drs. Hendra | Analitik KPI Executif |
| **Auditor Compliance** | `auditor@lapor.go.id` | Rina Wijaya, S.H. | Log Audit AI & Override |

---

# 📊 Matriks Target Kinerja

| Metrik | Target | Status Realisasi |
|---|---|---|
| **Waktu Triage AI (G1)** | < 10 Detik | ✅ ~1.5–3.8 Detik (Gemini 3.6 Flash) |
| **Presisi Klasifikasi Kritis (G3)** | > 90% | ✅ Tested dengan Bangka Dialect & Indonesian |
| **Pengamanan PII (G4)** | 100% Text Masked | ✅ Regular Expression & Pattern Masking |
| **Masa Berlaku OTP (FR-EV.6)** | 15 Menit | ✅ Resend API Email Integration (`lapor-ai.web.id`) |
| **Ketersediaan Layanan** | 99.5% | ✅ Multi-Tier Fallback System |

---

# 👨‍💻 Tim Pengembang

**LAPOR-AI Development Team**  
FTI FEST 2026 - SFT TEAM

---

> **Catatan SafeGuard:** Sistem LAPOR-AI berfungsi sebagai alat bantu rekomendasi (*Decision Support System*). Keputusan akhir terhadap verifikasi lapangan dan penanganan laporan masyarakat tetap berada sepenuhnya di tangan petugas verifikator manusia (*Human-in-the-Loop*).