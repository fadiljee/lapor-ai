# LAPOR-AI Frontend

React-based web interface for LAPOR-AI system.

## Installation
```bash
cd frontend
npm install
```

## Running
```bash
npm run dev
```

## Tech Stack
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- TailwindCSS

## API Endpoints
- POST /api/submit-report (form submission)
- GET /api/status/{report_id} (status check)

## Features
- Ünderi**), Dinamik form dengan Kategorik & Lampiran
- Status tracking (Pendente, Verifikasi AI, Kritis)
- OTP-based Email Verification
- LLM Triage Results Display

## Security
- Input validation (Regex checks)
- CAPTCHA protection
- 60-second OTP cooldown

## Quick-Fill Feature
- Mock presets for demonstration (Form > Quick-Fill button)

## Notes
- API keys should be configured in backend
- Running on port 3000 by default