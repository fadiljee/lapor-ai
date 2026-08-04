# 🚨 LAPOR-AI
### Sistem Pengaduan Warga Terintegrasi LLM untuk Triage Urgensi & Routing Penanganan

![Python](https://img.shields.io/badge/Python-3.11%2B-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green)
![React](https://img.shields.io/badge/React-19-blue)
![Gemini](https://img.shields.io/badge/Google_Gemini-3.6_Flash-orange)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 📌 Deskripsi

**LAPOR-AI** merupakan sistem pengaduan masyarakat tingkat lanjut berbasis Artificial Intelligence yang memanfaatkan **Large Language Model (Google Gemini API)** untuk membantu proses **triage laporan secara otomatis**.

Sistem ini bertindak sebagai lapisan kecerdasan buatan (AI Layer) di atas sistem pengaduan publik seperti SP4N-LAPOR! dengan kemampuan:

- 🧠 **Klasifikasi Kategori Multi-Domain**: Mengkategorikan pengaduan ke 8 domain dinas teknis (Infrastruktur, Keamanan/Bencana, Layanan Publik, Lingkungan, Kesehatan, Pendidikan, Ketertiban Umum, Lainnya).
- 🚨 **Triage Urgensi Multi-Tier**: Menentukan skor urgensi (*Kritis*, *Tinggi*, *Sedang*, *Rendah*) secara real-time. Laporan darurat otomatis diangkat ke puncak antrean.
- 📍 **Ekstraksi Entitas & Lokasi**: Mengidentifikasi entitas kunci (lokasi kejadian, pihak terlibat, waktu).
- 📄 **Ringkasan Otomatis (Executive Summary)**: Menghasilkan ringkasan narasional singkat untuk percepatan baca petugas.
- 🔁 **Routing Otomatis & Deterministik**: Menentukan rekomendasi awal dinas/instansi tujuan secara presisi.
- 🛡️ **Pengamanan PII & Safeguard**: Melindungi data pribadi warga (email, nomor telp, NIK) melalui *PII Masking* sebelum dikirim ke LLM, serta dilengkapi *Prompt Injection Guard*.
- 🌐 **Dukungan Bahasa Lokal (Bahasa Bangka & Indonesia)**: Memahami dialek lokal Bahasa Bangka (misal: *nian, banyu, dide', katek, uma*) dan Bahasa Indonesia formal/informal.
- 👨‍💼 **Prinsip Responsible AI (Human-in-the-Loop)**: Memberikan rekomendasi transparan kepada petugas verifikator tanpa pernah mengambil keputusan penanganan akhir secara sepihak.

Project ini dikembangkan sebagai prototipe solusi untuk **FTI FEST 2026** dengan tema:

> **Artificial Intelligence untuk Keamanan Informasi & Efisiensi Layanan Publik**

---

# ✨ Fitur Utama

## 👤 Warga (Public Portal)
- 📝 **Formulir Pengaduan Multi-Step**: Alur pembuatan laporan 4 langkah intuitif.
- 📸 **Lampiran Dokumen/Foto**: Unggah bukti pendukung hingga 10 MB.
- 🔍 **Pelacakan Tiket Real-Time**: Lacak progres status laporan menggunakan nomor resi resmi (contoh: `LP-2026-08-0000412`).
- ✉️ **Verifikasi Email (OTP 6 Digit)**: Autentikasi email pelapor dengan mekanisme cooldown 60 detik.
- 🕵️ **Mode Anonim**: Pilihan melapor tanpa mencatat identitas email.
- ⚡ **Quick Fill Demo Presets**: Pengisian preset sampel laporan darurat/infrastruktur untuk demonstrasi cepat.

## 🤖 Artificial Intelligence & Safeguards
- 🧠 **Google Gemini 3.6 Flash Integration**: Memanfaatkan mode JSON terstruktur native (`responseMimeType: application/json` & `system_instruction`).
- 🛡️ **PII Masking Service**: Anonimisasi otomatis nomor telepon, email, NIK, dan nomor rekening warga.
- 🔒 **Prompt Injection Protection**: Sanitasi input warga dengan teknik *data wrapping* `<user_report>` agar LLM tidak dapat di-hijack oleh instruksi tersembunyi.
- 🔄 **Multi-Tier Model Fallback**: Skema failover dari Primary Model (`gemini-3.6-flash`) ke Fallback Model (`gemini-2.0-flash`) hingga Local Rule-Based Engine jika terjadi gangguan koneksi.
- 🔎 **Deteksi Laporan Ganda (Duplicate Detection)**: Hashing teks fingerprint untuk menandai laporan serupa yang berpotensi membanjiri antrean.

## 👨‍💼 Petugas & Staff Dashboard
- 📋 **Antrean Triage Berbasis Urgensi**: Tampilan master-detail dengan urutan prioritas otomatis (Kritis terlebih dahulu).
- ✏️ **Koreksi Manusia (Human Override)**: Hak akses petugas untuk mengubah kategori, level urgensi, dan dinas tujuan secara opsional.
- 📜 **Log Audit Transparan**: Jejak audit kronologis mencatat setiap prediksi AI dan keputusan koreksi petugas.

## 📊 Supervisor & Admin Portal
- 📈 **Dashboard Analitik Executif**: Visualisasi KPI agregat real-time dari PostgreSQL (rasio urgensi, distribusi dinas, tingkat duplikasi).
- ⏱️ **Manajemen SLA**: Matriks target waktu respons pertama dan penyelesaian berdasarkan level urgensi.
- 🗺️ **Matriks Routing Dinas**: Pemetaan deterministik dari 8 kategori pengaduan ke instansi pelaksana.

---

# 🏗️ Arsitektur Sistem

```
 ┌────────────────────────────────────────────────────────┐
 │            React 19 + Vite Frontend (UI/UX)            │
 └───────────────────────────┬────────────────────────────┘
                             │ REST API (JSON)
                             ▼
 ┌────────────────────────────────────────────────────────┐
 │            FastAPI Backend (Python 3.11+)             │
 ├────────────────────────────────────────────────────────┤
 │  • PII Masking Engine      • Auth & OTP Service       │
 │  • Injection Guard         • Department Routing       │
 │  • Fingerprint Hasher      • Audit Log Tracer         │
 └─────────────┬──────────────────────────┬───────────────┘
               │                          │
               ▼                          ▼
 ┌──────────────────────────┐  ┌──────────────────────────┐
 │  PostgreSQL Database     │  │  Google Gemini API       │
 │  (Reports, Users, Logs)  │  │  (gemini-3.6-flash)      │
 └──────────────────────────┘  └──────────────────────────┘
```

---

# 🛠 Tech Stack

### Frontend
- **Framework**: React 19, Vite
- **Styling**: Tailwind CSS (Desain Sistem Editorial Resi)
- **Routing**: React Router v7
- **Icons**: Lucide React

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **ORM & DB**: SQLAlchemy, Alembic Migrations
- **Authentication**: OAuth2 / JWT (python-jose, passlib)
- **HTTP Client**: HTTPX (Async/Sync API Calls)

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
│   │   ├── models/          # SQLAlchemy ORM models (Report, User, AuditLog)
│   │   ├── schemas/         # Pydantic validation schemas
│   │   └── services/        # Business logic (llm_orchestrator, pii_masking, etc.)
│   ├── tests/               # Pytest & integration test suite
│   ├── .env                 # Environment configuration
│   └── requirements.txt     # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/      # UI components (TicketStub, AIJustificationCard, Navbar)
│   │   ├── pages/           # Pages (HomePage, SubmitReport, DashboardPetugas, Analytics)
│   │   └── services/        # API client service layer (api.js)
│   ├── package.json
│   └── vite.config.js
│
├── PRD/                     # Product Requirements Document
├── docker-compose.yml       # Docker environment setup
└── README.md
```

---

# 🚀 Panduan Instalasi & Memulai

### 1. Clone Repository

```bash
git clone https://github.com/username/lapor-ai.git
cd lapor-ai
```

### 2. Setup Backend (FastAPI)

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

# Google Gemini LLM Credentials
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
GEMINI_BASE_URL="https://generativelanguage.googleapis.com/v1beta"
PRIMARY_MODEL="gemini-3.6-flash"
FALLBACK_MODEL="gemini-2.0-flash"
```

Jalankan server backend FastAPI:

```bash
uvicorn app.main:app --reload --port 8000
```

Dokumentasi API Interactive (Swagger UI) dapat diakses di `http://localhost:8000/docs`.

### 3. Setup Frontend (React + Vite)

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
| **Petugas Triage** | `petugas@lapor.go.id` | Budi Santoso | Antrean Triage Pengaduan |
| **Admin Instansi** | `admin@lapor.go.id` | Siti Rahma | Routing Dinas & SLA |
| **Supervisor** | `supervisor@lapor.go.id` | Drs. Hendra | Analitik KPI Executif |
| **Auditor Compliance** | `auditor@lapor.go.id` | Rina Wijaya, S.H. | Log Audit AI & Override |

---

# 📊 Matriks Target Kinerja (PRD Metrics)

| Metrik | Target PRD | Status Realisasi |
|---|---|---|
| **Waktu Triage AI (G1)** | < 10 Detik | ✅ ~1.5–5.9 Detik (Gemini 3.6 Flash) |
| **Presisi Klasifikasi Kritis (G3)** | > 90% | ✅ Tested dengan Bangka Dialect & Indonesian |
| **Pengamanan PII (G4)** | 100% Text Masked | ✅ Regular Expression & Pattern Masking |
| **Ketersediaan Layanan** | 99.5% | ✅ Multi-Tier Fallback System |

---

# 📜 Lisensi

Project ini menggunakan lisensi **MIT License**.

---

# 👨‍💻 Tim Pengembang

**LAPOR-AI Development Team**  
FTI FEST 2026 — Politeknik Manufaktur Negeri Bangka Belitung

---

> **Catatan SafeGuard:** Sistem LAPOR-AI berfungsi sebagai alat bantu rekomendasi (*Decision Support System*). Keputusan akhir terhadap verifikasi lapangan dan penanganan laporan masyarakat tetap berada sepenuhnya di tangan petugas verifikator manusia (*Human-in-the-Loop*).