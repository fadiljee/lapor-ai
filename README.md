# 🚨 LAPOR-AI
### Sistem Pengaduan Warga Terintegrasi LLM untuk Triage Urgensi Penanganan

![Python](https://img.shields.io/badge/Python-3.11-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green)
![React](https://img.shields.io/badge/React-19-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 📌 Deskripsi

**LAPOR-AI** merupakan sistem pengaduan masyarakat berbasis Artificial Intelligence yang memanfaatkan **Large Language Model (LLM)** untuk membantu proses **triage laporan secara otomatis**.

Sistem mampu:

- 🧠 Mengklasifikasikan kategori laporan.
- 🚨 Menentukan tingkat urgensi laporan.
- 📍 Mengekstrak lokasi dan informasi penting.
- 📄 Membuat ringkasan otomatis.
- 🔁 Melakukan routing laporan ke dinas terkait.
- 🛡️ Melindungi data pribadi melalui PII Masking.
- 🌐 Mendukung Bahasa Indonesia dan Bahasa Bangka.
- 👨‍💼 Memberikan rekomendasi kepada petugas tanpa menggantikan keputusan manusia (Human in the Loop).

Project ini dikembangkan sebagai prototipe untuk **FTI FEST 2026** dengan tema:

> **Artificial Intelligence untuk Keamanan Informasi**

---

# ✨ Fitur

## 👤 Warga

- Submit laporan
- Upload foto
- Tracking status laporan
- Email Verification (OTP)
- Mode Anonim
- Quick Fill Demo
- Notifikasi Email

---

## 🤖 Artificial Intelligence

- Klasifikasi kategori
- Triage urgensi
- Ringkasan otomatis
- Entity Extraction
- PII Anonymization
- Prompt Injection Protection
- Multi Provider LLM Fallback
- Bahasa Indonesia & Bahasa Bangka

---

## 👨‍💼 Petugas

- Dashboard laporan
- Sorting berdasarkan urgensi
- Override hasil AI
- Routing laporan
- Audit Log
- Dashboard Analytics

---

## 📊 Supervisor

- Statistik laporan
- Grafik tren
- Heatmap lokasi
- SLA Monitoring

---

# 🏗️ Arsitektur

```
React Frontend
        │
        ▼
 FastAPI Backend
        │
 ┌──────┼───────────────┐
 ▼      ▼               ▼
Postgres Redis      Local Storage
        │
        ▼
   Celery Worker
        │
        ▼
   LLM Orchestrator
        │
   ┌────┴─────────┐
   ▼              ▼
 Groq API     Fallback LLM
```

---

# 🛠 Tech Stack

## Frontend

- React
- Vite
- Tailwind CSS
- React Router
- TanStack Query
- Axios

## Backend

- FastAPI
- Python 3.11+
- SQLAlchemy
- Pydantic v2
- JWT Authentication

## Database

- PostgreSQL

## Cache & Queue

- Redis
- Celery

## Artificial Intelligence

- Groq API
- OpenRouter (Fallback)
- Gemini API (Fallback)

## Storage

- Local File Storage

## Deployment

- Docker
- Docker Compose

---

# 📂 Struktur Project

```
lapor-ai/

├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── utils/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── workers/
│   │
│   └── tests/
│
├── docs/
│
├── docker-compose.yml
├── README.md
└── LICENSE
```

---

# 🚀 Instalasi

## 1. Clone Repository

```bash
git clone https://github.com/username/lapor-ai.git

cd lapor-ai
```

---

## 2. Backend

```bash
cd backend

python -m venv .venv

source .venv/bin/activate

pip install -r requirements.txt
```

---

## 3. Frontend

```bash
cd frontend

npm install
```

---

## 4. Jalankan PostgreSQL & Redis

Menggunakan Docker

```bash
docker compose up -d postgres redis
```

---

## 5. Jalankan Backend

```bash
uvicorn app.main:app --reload
```

---

## 6. Jalankan Celery

```bash
celery -A app.worker worker --loglevel=info
```

---

## 7. Jalankan Frontend

```bash
npm run dev
```

---

# ⚙ Environment Variable

Backend membutuhkan file **.env**

```env
APP_NAME=LAPOR-AI

SECRET_KEY=your-secret-key

DATABASE_URL=postgresql://postgres:password@localhost/lapor_ai

REDIS_URL=redis://localhost:6379

JWT_SECRET=your-jwt-secret

GROQ_API_KEY=

OPENROUTER_API_KEY=

GEMINI_API_KEY=

SMTP_HOST=

SMTP_PORT=

SMTP_USER=

SMTP_PASSWORD=
```

---

# 🤖 AI Pipeline

1. Warga mengirim laporan
2. Email diverifikasi
3. PII Masking
4. Prompt Injection Guard
5. Kirim ke LLM
6. AI menghasilkan

- kategori
- urgensi
- ringkasan
- entity

7. Routing otomatis
8. Dashboard petugas

---

# 🔒 Security

- JWT Authentication
- HTTPS
- Rate Limiting
- CAPTCHA
- Email Verification
- PII Masking
- Prompt Injection Protection
- Audit Log
- Secure File Upload

---

# 📈 Target Performance

| Metric | Target |
|---------|--------|
| AI Response | <10 detik |
| API Response | <2 detik |
| Availability | 99.5% |
| Spam Detection | >80% |
| Critical Precision | >90% |

---

# 👥 Demo Account

## Admin

```
Email    : admin@laporai.demo
Password : admin123
```

## Petugas

```
Email    : petugas@laporai.demo
Password : petugas123
```

> **Catatan:** Akun di atas hanya digunakan untuk demonstrasi dan tidak menggunakan data pribadi asli.

---

# 📖 Dokumentasi

- Product Requirement Document (PRD)
- API Documentation (Swagger)
- User Flow
- Wireframe
- Database ERD

---

# 🏆 Kompetisi

Project ini dibuat untuk mengikuti:

**FTI FEST 2026**

Tema:

> Artificial Intelligence untuk Keamanan Informasi

---

# 📜 License

Project ini menggunakan lisensi **MIT License**.

---

# 👨‍💻 Tim Pengembang

**LAPOR-AI Team**

Politeknik Manufaktur Negeri Bangka Belitung

FTI FEST 2026

---

> **Catatan:** Sistem ini merupakan prototipe. Keputusan akhir terhadap setiap laporan tetap berada pada petugas (Human-in-the-Loop). AI hanya memberikan rekomendasi klasifikasi, urgensi, dan routing laporan.