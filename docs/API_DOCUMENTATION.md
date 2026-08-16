# LAPOR-AI API Documentation (Full Reference)

Dokumentasi ini menjelaskan secara menyeluruh semua endpoint yang tersedia di backend LAPOR-AI. Endpoint dilindungi oleh autentikasi Bearer Token (JWT) kecuali untuk endpoint Publik/Auth tertentu.

---

## 1. Authentication & OTP (`/api/v1/auth`)

### 1.1 Login (`POST /api/v1/auth/login`)
Digunakan untuk autentikasi user.
- **Auth Required:** No
- **Request Body (JSON):**
  ```json
  {
    "email": "warga@lapor.go.id",
    "password": "password123"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "access_token": "eyJhbGciOi...",
    "token_type": "bearer",
    "role": "warga",
    "nama": "Budi Warga"
  }
  ```

### 1.2 Register (`POST /api/v1/auth/register`)
- **Auth Required:** No
- **Request Body:**
  ```json
  {
    "email": "baru@lapor.go.id",
    "password": "password123",
    "nama": "Budi Baru",
    "role": "warga"
  }
  ```
- **Response (201 Created):** Mengembalikan token JWT yang sama seperti Login.

### 1.3 Verifikasi OTP Email (`POST /api/v1/verify-email`)
- **Auth Required:** No
- **Request Body:**
  ```json
  {
    "email": "warga@lapor.go.id",
    "otp_code": "123456"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "message": "Email berhasil diverifikasi",
    "verified": true
  }
  ```

### 1.4 Resend OTP (`POST /api/v1/resend-otp`)
- **Auth Required:** No
- **Request Body:**
  ```json
  {
    "email": "warga@lapor.go.id"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "message": "Kode OTP baru telah dikirim",
    "cooldown_seconds": 60
  }
  ```

---

## 2. Reports (`/api/v1/reports`)

### 2.1 Buat Laporan Baru (`POST /api/v1/reports`)
- **Auth Required:** Yes (Role: `warga`)
- **Content-Type:** `multipart/form-data`
- **Request Form-Data:**
  - `kategori` (string)
  - `deskripsi` (string, wajib)
  - `lokasi_alamat` (string)
  - `is_anonim` (boolean)
  - `email` (string)
  - `lampiran` (File, opsional, maks 5MB)
- **Response (201 Created):**
  ```json
  {
    "id": "LP-2026-08-16-1234",
    "deskripsi_masked": "Jalan berlubang di [LOKASI]",
    "kategori": "Infrastruktur",
    "skor_urgensi": "Tinggi",
    "dinas_tujuan": "Dinas Pekerjaan Umum dan Penataan Ruang (PUPR)",
    "status": "Terverifikasi AI"
  }
  ```

### 2.2 Ambil Daftar Laporan (`GET /api/v1/reports`)
- **Auth Required:** Yes
- **Query Parameters:** `status`, `urgensi`, `kategori`, `search`
- **Response (200 OK):** Array of Report objects.

### 2.3 Ambil Detail Laporan (`GET /api/v1/reports/{report_id}`)
- **Auth Required:** Yes
- **Response (200 OK):** Object Report Response detail.

### 2.4 Update / Override Laporan (`PATCH /api/v1/reports/{report_id}`)
- **Auth Required:** Yes (Role: `petugas`, `admin`, `dinas`)
- **Request Body:**
  ```json
  {
    "kategori": "Sosial",
    "skor_urgensi": "Kritis",
    "status": "Sedang Diproses",
    "dinas_tujuan": "Dinas Sosial (Dinsos)",
    "catatan": "Koreksi oleh petugas"
  }
  ```
- **Response (200 OK):** Object Report yang telah diperbarui.

---

## 3. Dashboard & Analytics (`/api/v1`)

### 3.1 Dashboard Stats (`GET /api/v1/dashboard`)
- **Auth Required:** Yes (Role: `admin`, `petugas`)
- **Response (200 OK):**
  Mengembalikan metrik KPI agregasi (total, open_cases, critical_cases, by_category, daily_trend, dsb).

### 3.2 Audit Logs (`GET /api/v1/audit-logs`)
- **Auth Required:** Yes (Role: `admin`)
- **Response (200 OK):**
  ```json
  [
    {
      "id": 1,
      "report_id": "LP-2026-08-16-1234",
      "actor": "AI Klasifikasi Engine",
      "action": "CREATE_AND_TRIAGE",
      "details": "Klasifikasi: Infrastruktur, Urgensi: Tinggi",
      "model_version": "Google Gemini API",
      "timestamp": "2026-08-16 10:05:00"
    }
  ]
  ```

---

## 4. User Management (`/api/v1/users`)

Seluruh endpoint di bawah ini memerlukan otorisasi (Role: `admin`).

### 4.1 Get All Users (`GET /api/v1/users`)
- **Response (200 OK):** Array object profil pengguna.

### 4.2 Create User (`POST /api/v1/users`)
- **Request Body:** `email`, `password`, `nama`, `role`, `instansi`.
- **Response (201 Created):** Object User yang baru dibuat.

### 4.3 Update User (`PUT /api/v1/users/{user_id}`)
- **Request Body (Opsional):** `nama`, `password`, `role`, `instansi`.
- **Response (200 OK):** Object User terupdate.

### 4.4 Delete User (`DELETE /api/v1/users/{user_id}`)
- **Response (204 No Content)**

---

## 5. Instansi Management (`/api/v1/instansi`)

Mengelola data Satuan Kerja Perangkat Daerah (SKPD) tujuan pelaporan.

### 5.1 Get Instansi (`GET /api/v1/instansi`)
- **Auth Required:** Yes
- **Response (200 OK):** Daftar seluruh instansi.

### 5.2 Create Instansi (`POST /api/v1/instansi`)
- **Auth Required:** Yes (Role: `admin`)
- **Request Body:**
  ```json
  {
    "nama": "Dinas Kominfo",
    "deskripsi": "Dinas Komunikasi dan Informatika"
  }
  ```
- **Response (200 OK):** Instansi baru.

### 5.3 Update Instansi (`PUT /api/v1/instansi/{id}`)
- **Auth Required:** Yes (Role: `admin`)
- **Request Body:** `nama`, `deskripsi`.
- **Response (200 OK):** Instansi terupdate.

### 5.4 Delete Instansi (`DELETE /api/v1/instansi/{id}`)
- **Auth Required:** Yes (Role: `admin`)
- **Response (200 OK):** `{"message": "Instansi berhasil dihapus"}`
