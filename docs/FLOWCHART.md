# LAPOR-AI Workflow Flowcharts

Berikut adalah ringkasan diagram alur (flowchart) dari sistem LAPOR-AI. Diagram ini menggunakan format **Mermaid** agar dapat dirender secara otomatis di GitHub.

## 1. Alur Laporan Utama & Transparansi Audit

```mermaid
flowchart TD
    %% Entitas
    W([Warga])
    S[Sistem LAPOR-AI]
    AI{AI Processing\nGemini LLM}
    P{Verifikasi\nPetugas}
    D{Proses\nDinas}
    Log[(Audit Log)]

    %% Alur
    W -->|Buat Laporan| S
    S --> AI
    AI -->|Kategori & Urgensi| P
    P -->|Validasi / Koreksi| D
    D -->|Tindak Lanjut| Selesai([Laporan Selesai])
    Selesai -.->|Notifikasi| W

    %% Audit Logging
    AI -.->|Auto-log| Log
    P -.->|Log Perubahan| Log
```

## 2. Alur Akses Role (RBAC)

```mermaid
flowchart LR
    Login([User Login]) --> Validasi{Sistem}
    
    Validasi -->|Warga| H_W[Dashboard Warga]
    Validasi -->|Petugas| H_P[Dashboard Verifikasi]
    Validasi -->|Dinas| H_D[Dashboard Instansi]
    Validasi -->|Admin| H_A[Dashboard Admin]
```
