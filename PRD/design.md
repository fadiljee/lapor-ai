# PRD-Design (UI/UX Specification)
# LAPOR-AI: Sistem Pengaduan Warga Terintegrasi LLM — Desain Antarmuka Web

**Versi Dokumen:** 1.0
**Tanggal:** 3 Agustus 2026
**Status:** Draft untuk Review
**Turunan dari:** PRD.md v1.5
**Pemilik Dokumen:** UI/UX Lead LAPOR-AI

**Catatan Kepatuhan:** Dokumen ini menindaklanjuti Section 8.6 PRD ("Prinsip Desain UI/UX") — antarmuka dirancang dan diputuskan secara manual, bukan output mentah generator AI, sesuai aturan kompetisi yang melarang UI hasil AI tanpa intervensi desain manusia. Setiap keputusan warna, tipografi, dan layout pada dokumen ini disertai alasan, bukan default template.

---

## 1. Tujuan & Ruang Lingkup

Dokumen ini menerjemahkan kebutuhan fungsional pada PRD.md (khususnya Section 4–6, 8.6) menjadi spesifikasi desain yang dapat langsung diimplementasikan tim frontend (React + TailwindCSS). Cakupan:

- Sistem desain (warna, tipografi, komponen, ikonografi) — **tanpa gradient**, tanpa pola visual generik/"AI slop".
- Arsitektur informasi & peta navigasi per peran pengguna.
- Wireframe tingkat-struktur (bukan high-fidelity mockup) untuk 5 alur utama.
- Pola interaksi khusus terkait AI-in-the-loop (menampilkan skor urgensi, justifikasi, disclaimer).
- Aksesibilitas, responsivitas, microcopy, dan design token untuk hand-off ke engineering.

Di luar cakupan: high-fidelity visual mockup (Figma), ilustrasi final, dan copy produksi penuh (disediakan contoh representatif saja).

---

## 2. Mengapa "Anti-Gradient" dan "Anti-AI-Slop" — Bukan Sekadar Preferensi

Tiga pola visual yang saat ini paling umum dihasilkan alat AI generatif — **(1)** krem hangat + serif kontras + aksen terracotta, **(2)** hitam pekat + satu aksen neon, **(3)** layout broadsheet bergaris tipis tanpa radius — dihindari secara sadar di LAPOR-AI, bukan karena gaya tersebut buruk, tetapi karena dua alasan spesifik ke produk ini:

1. **Legibilitas fungsional lebih penting dari estetika dekoratif.** Sistem ini memuat label urgensi (Kritis/Tinggi/Sedang/Rendah) yang harus dibaca sekilas oleh petugas dalam hitungan detik saat antrean padat. Gradient pada badge status justru **menurunkan kontras** dan membuat warna sulit dipetakan secara konsisten ke makna (lihat WCAG 1.4.11 non-text contrast). Warna di LAPOR-AI harus **flat dan deterministik** — persis seperti prinsip "lookup table, bukan tebakan bebas" yang dipakai untuk routing dinas (Section 36 PRD).
2. **Kepercayaan publik terhadap layanan pemerintah.** LAPOR-AI adalah kanal pengaduan warga, bukan produk konsumer. Visual yang terasa seperti "template startup AI" (gradient mewah, ilustrasi 3D mengambang, glassmorphism) mengurangi kredibilitas institusional. Referensi visual yang lebih tepat: **loket layanan publik, tiket antrean fisik, formulir resmi** — dunia yang sudah dikenali warga Indonesia.

Signature visual LAPOR-AI adalah metafora **"tiket robek" (ticket stub)** pada nomor laporan — meniru tiket antrean loket/puskesmas yang dikenal warga, dengan garis perforasi antara nomor tiket dan status. Elemen ini dipakai secara konsisten namun **terbatas** (hanya pada kartu tiket & status), bukan didekorasi di semua tempat.

---

## 3. Ringkasan Persona & Implikasi Desain

| Persona | Konteks Pakai | Implikasi Desain Utama |
|---|---|---|
| Warga Pelapor | Mobile, sekali pakai, kadang panik/terburu-buru (kasus darurat) | Mobile-first, form pendek per langkah, bahasa awam, opsi anonim jelas tanpa dark pattern |
| Petugas Triage | Desktop, penggunaan berulang sepanjang shift | Densitas informasi tinggi, scan cepat via warna+ikon, keyboard-friendly |
| Admin Instansi | Desktop, penggunaan berkala | Tabel & form konfigurasi, penekanan pada *reversibilitas* (semua override tercatat) |
| Supervisor | Desktop/tablet, melihat ringkasan | Visualisasi agregat, bukan detail baris-per-baris |
| Auditor | Desktop, read-only | Tabel log kronologis, dapat difilter & diekspor, tanpa aksi mutasi data |

---

## 4. Sistem Desain (Design System)

### 4.1 Palet Warna

Dua lapis warna dipisah secara sengaja: **(a) warna institusional/brand** (netral, dipakai minim) dan **(b) warna semantik urgensi** (fungsional, tidak boleh dipakai untuk tujuan dekoratif lain agar maknanya tidak "aus").

**Warna Institusional**

| Token | Hex | Peran | Catatan |
|---|---|---|---|
| `color-ink` | `#1A2420` | Teks utama | Hitam kehijauan-gelap, bukan hitam pekat — lebih ramah baca lama |
| `color-paper` | `#F3F4EF` | Latar halaman | Abu-hangat netral (sengaja *bukan* krem persik `#F4F1EA` yang jadi ciri khas template AI) |
| `color-surface` | `#FFFFFF` | Latar kartu/panel | Kontras terhadap `color-paper` tanpa bayangan gradient |
| `color-line` | `#D8DAD2` | Border, divider | Satu warna garis konsisten di seluruh produk |
| `color-primary` | `#1F4E4B` | Aksi utama (tombol, tautan aktif, ikon terpilih) | Teal-tinta-pekat, merujuk warna tinta pena dinas/stempel basah, bukan biru korporat generik |
| `color-primary-hover` | `#163A38` | Hover/pressed state primary | |
| `color-accent-stamp` | `#A23B2E` | *Hanya* untuk elemen tiket/stempel verifikasi | Merujuk warna tinta stempel resmi Indonesia — dipakai terbatas agar tetap bermakna "resmi/tervalidasi" |
| `color-muted` | `#5B6357` | Teks sekunder/caption | |

**Warna Semantik Urgensi** (satu-satunya tempat warna "mencolok" boleh dipakai — dan wajib konsisten di seluruh produk, termasuk grafik dashboard)

| Level | Token | Hex (teks/ikon) | Hex (latar tint) | Rasio kontras vs putih |
|---|---|---|---|---|
| Kritis | `urgency-critical` | `#B3261E` | `#FBEAEA` | 6.3:1 |
| Tinggi | `urgency-high` | `#94570A` | `#FCF1DC` | 5.9:1 |
| Sedang | `urgency-medium` | `#3E5C78` | `#E9EEF3` | 6.7:1 |
| Rendah | `urgency-low` | `#4B564D` | `#EEF1EC` | 7.8:1 |

> Aturan pemakaian: warna urgensi **tidak pernah** dipakai sebagai warna latar tombol umum, ilustrasi, atau elemen marketing — hanya pada badge/label/border kiri baris tabel yang merepresentasikan urgensi laporan itu sendiri. Ini menjaga agar warna tetap punya satu makna yang bisa dipercaya petugas.

**Tidak ada** token gradient di seluruh sistem ini. Elevasi kartu dicapai lewat `color-line` (border 1px) + sedikit perbedaan `color-surface`/`color-paper`, bukan `box-shadow` dramatis atau gradasi warna.

### 4.2 Tipografi

Tiga peran tipografi dipisah **berdasarkan fungsi**, bukan dekorasi:

| Peran | Font | Alasan |
|---|---|---|
| Judul & heading warga-facing | **Source Serif 4** | Serif editorial memberi kesan "surat/dokumen resmi" pada halaman warga (form, halaman sukses, status) — familiar dengan nuansa dokumen pemerintah cetak, tanpa terasa mewah/branding startup |
| UI, body text, dashboard petugas/admin | **IBM Plex Sans** | Grotesk humanis, dukungan diakritik Latin lengkap (aman untuk campuran Bahasa Indonesia/Bahasa Bangka), sangat terbaca di ukuran kecil pada tabel padat |
| Nomor tiket, kode OTP, timestamp, ID laporan | **IBM Plex Mono** | Angka tabular monospace memudahkan warga membaca/menyalin nomor tiket dan memudahkan petugas membandingkan ID secara visual |

**Skala Tipe** (basis 16px, rasio 1.25)

| Token | Ukuran | Pemakaian |
|---|---|---|
| `text-xs` | 12px | Caption, metadata tabel |
| `text-sm` | 14px | Body dashboard, label form |
| `text-base` | 16px | Body warga-facing (minimum demi aksesibilitas form publik) |
| `text-lg` | 20px | Sub-judul, judul kartu |
| `text-xl` | 25px | Judul section |
| `text-2xl` | 31px | Judul halaman warga (mis. "Ajukan Laporan") |

Berat font dibatasi 2 varian per keluarga (Regular 400, Semibold 600) — tidak memakai Black/Thin agar sistem tetap disiplin dan bukan "eksperimen tipografi" yang mengalihkan perhatian dari isi laporan.

### 4.3 Grid & Spacing

- Grid 8px sebagai satuan dasar (`4, 8, 12, 16, 24, 32, 48, 64`).
- Kolom: 4 kolom (mobile, margin 16px), 8 kolom (tablet), 12 kolom (desktop, max-width kontainer 1200px untuk dashboard, 720px untuk form warga agar fokus baca terjaga).
- Radius: `4px` untuk kontrol interaktif kecil (tombol, input), `8px` untuk kartu. Radius kecil dan konsisten — bukan `0` (kesan broadsheet dingin) dan bukan radius besar ala kartu konsumer.

### 4.4 Ikonografi

- Gaya **line icon** stroke 1.5px, sudut tumpul ringan, satu warna (`color-ink` atau warna semantik saat merepresentasikan urgensi) — tanpa isian gradient, tanpa emoji di UI produksi.
- Ikon tidak pernah berdiri sendiri sebagai penyampai makna (selalu didampingi label teks) — memenuhi prinsip aksesibilitas dan menghindari ambiguitas lintas budaya.
- Sumber: set ikon konsisten tunggal (mis. Lucide/Phosphor line-style) — dilarang mencampur beberapa set ikon dengan gaya berbeda.

### 4.5 Komponen Kunci

**a. Urgency Badge**
```
┌──────────────┐
│ ● KRITIS     │   ● = dot 8px warna urgency-critical
└──────────────┘   latar urgency-critical tint, border 1px warna solid urgency-critical
```
Selalu berupa teks + dot, tidak pernah hanya warna (aturan aksesibilitas buta warna).

**b. Kartu Tiket Laporan (signature element)**
```
┌───────────────────────────────┐
│ LAPOR-AI · Tanda Terima        │
│                                 │
│  No. Tiket                     │
│  LP-2026-08-0000412            │  ← IBM Plex Mono
│ ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄  │  ← garis perforasi (border-dashed)
│  Status: Menunggu Verifikasi AI│
│  Diajukan: 3 Agu 2026, 14:02   │
└───────────────────────────────┘
```
Dipakai di halaman sukses submit & halaman lacak status. Garis perforasi memakai `border-top: 1px dashed color-line` — bukan ilustrasi/SVG dekoratif, murni CSS agar ringan.

**c. Panel Justifikasi AI (untuk petugas)** — lihat detail pola di Section 7.

**d. Flag Duplikasi/Spam** — badge outline (bukan solid) warna `color-muted`, label eksplisit "Terindikasi Duplikat Teknis" (bukan "Spam" agar tidak menghakimi konten sebelum tinjauan petugas — selaras Section 6.2 FR-2.6 PRD).

**e. Tombol** — hanya 3 varian: Primary (solid `color-primary`), Secondary (outline), Destructive teks-only (untuk aksi seperti "Tandai Tidak Relevan"), tanpa gradient/shadow tebal.

### 4.6 Motion

Motion dibatasi pada fungsi, bukan dekorasi:
- Notifikasi laporan Kritis baru: satu kali *pulse* halus 400ms pada badge sidebar, lalu diam (tidak berulang — mencegah kelelahan visual pada petugas yang bekerja berjam-jam).
- Transisi antar step form: slide 150ms, `prefers-reduced-motion` dihormati (motion dinonaktifkan otomatis).
- Tidak ada animasi loading skeleton berkilau (shimmer gradient) — memakai indikator progress teks sederhana ("Menganalisis laporan…") sesuai prinsip anti-gradient.

---

## 5. Arsitektur Informasi

```
LAPOR-AI
├── (Publik — tanpa login)
│   ├── / Beranda ringkas + CTA "Ajukan Laporan" & "Lacak Laporan"
│   ├── /lapor Form pengaduan (multi-step)
│   ├── /verifikasi-email Input OTP/magic link
│   ├── /lapor/berhasil Halaman sukses + kartu tiket
│   └── /lacak Input nomor tiket → status
│
├── /masuk Login (petugas/admin/supervisor/auditor)
│
├── /dashboard (butuh login, tampilan menyesuaikan role)
│   ├── /dashboard/antrean (Petugas) — daftar laporan terurut urgensi
│   ├── /dashboard/laporan/:id (Petugas) — detail + panel AI + aksi
│   ├── /dashboard/routing (Admin) — override tabel dinas tujuan
│   ├── /dashboard/sla (Admin) — konfigurasi SLA per kategori/urgensi
│   ├── /dashboard/analitik (Supervisor) — tren, peta sebaran, waktu respons
│   └── /dashboard/audit-log (Auditor) — log keputusan AI & manusia, read-only
```

Navigasi warga sengaja **dangkal** (maks. 2 klik ke aksi manapun) mengikuti Section 8.6 PRD ("alur navigasi dibuat sesederhana mungkin agar mudah didemonstrasikan"). Navigasi dashboard internal boleh lebih dalam karena penggunanya terlatih.

---

## 6. Wireframe per Alur (Struktural, bukan Visual Final)

### 6.1 Warga — Form Pengaduan (FR-1.1–1.9)

Form dipecah **4 langkah** (bukan satu halaman panjang) agar tidak menakutkan di mobile dan mengurangi *abandonment* saat pelapor sedang stres/darurat:

```
Langkah 1/4 — Kategori & Deskripsi
┌─────────────────────────────────┐
│ ← Kembali            Langkah 1/4│
│                                   │
│ Apa yang ingin Anda laporkan?   │
│ [ Infrastruktur ▾ ]              │
│                                   │
│ Ceritakan kejadiannya            │
│ ┌───────────────────────────┐   │
│ │ (textarea, maks 2.000     │   │
│ │  karakter — sesuai FR-2.9)│   │
│ └───────────────────────────┘   │
│ 0/2000 karakter                  │
│                                   │
│ Bisa ditulis Bahasa Indonesia    │
│ atau Bahasa Bangka.              │
│                                   │
│           [ Lanjut → ]           │
└─────────────────────────────────┘
```
- Counter karakter real-time menegaskan batas 2.000 karakter (FR-2.9) secara transparan ke warga — bukan error mendadak di akhir.
- Keterangan dwibahasa (FR-1.8) ditulis sebagai *helper text* singkat, bukan dropdown pilih bahasa (sistem mendeteksi otomatis, warga tidak perlu memilih apa pun secara manual — mengurangi friksi).

```
Langkah 2/4 — Lokasi & Lampiran
[ 📍 Gunakan lokasi saat ini ]  atau  [ Pilih di peta ]
[ Tambah Foto/Video (maks 10MB) ]  ← thumbnail preview, bukan ikon upload generik

Langkah 3/4 — Identitas
◯ Lapor dengan identitas (dapat notifikasi status)
◯ Lapor secara anonim (tanpa notifikasi personal — lihat catatan)

  [jika non-anonim] → Email: [___________]
  Catatan: kami akan mengirim kode verifikasi ke email ini.

Langkah 4/4 — Tinjau & Kirim
Ringkasan input warga (read-only, dapat diedit kembali per bagian)
[ Kirim Laporan ]
```
- Pilihan anonim ditulis sebagai **trade-off eksplisit** ("tanpa notifikasi personal"), bukan disembunyikan di fine print — menghindari dark pattern dan selaras kebutuhan transparansi Section 10 PRD.
- **Quick-Fill (FR-1.9):** tombol kecil berlabel `⚙ Isi Contoh (Demo)` muncul **hanya** bila `import.meta.env.MODE !== 'production'`, ditempatkan di pojok, gaya outline redup — sengaja dibuat tidak menonjol dan mustahil tersentuh warga nyata di produksi.

### 6.2 Warga — Verifikasi Email (FR-1.7, FR-EV.1–EV.6)

```
Masukkan kode 6 digit yang kami kirim ke a**@email.com

[ _ ][ _ ][ _ ][ _ ][ _ ][ _ ]

Kode berlaku 10 menit.
[ Kirim ulang kode ]  ← nonaktif 60 detik, tampil hitung mundur
                          (hardening FR-EV.6 dikomunikasikan sbg
                           batas waktu, bukan pesan error teknis)
```

### 6.3 Warga — Halaman Sukses & Lacak Status (FR-1.4)

Menampilkan **Kartu Tiket** (Section 4.5.b) + status timeline horizontal sederhana:

```
Menunggu Verifikasi AI ──○── Terverifikasi AI ──○── Ditindaklanjuti ──○── Selesai
        ●
```
Titik terisi menandai posisi status saat ini. Status "Perlu Verifikasi Manual" (indikasi duplikat) ditampilkan sebagai catatan tambahan berwarna netral, **bukan** warna merah alarm — karena ini bukan penilaian negatif terhadap warga, murni proses teknis (selaras catatan PRD Section 5.1 poin 4).

### 6.4 Petugas — Dashboard Antrean (FR-3.1)

```
┌──────────────────────────────────────────────────────┐
│ Antrean Laporan                    [Filter ▾] [Cari]  │
├──────────────────────────────────────────────────────┤
│ ▎● KRITIS   #LP-...0412  Kebakaran — Ps. Sekanak       │
│              Masuk 2 menit lalu · Dinas: BPBD          │
├──────────────────────────────────────────────────────┤
│ ▎● TINGGI   #LP-...0409  Kabel listrik terbuka         │
│              Masuk 14 menit lalu · Dinas: PUPR         │
├──────────────────────────────────────────────────────┤
│ ▎● SEDANG   #LP-...0403  Lampu jalan mati              │
└──────────────────────────────────────────────────────┘
```
- Garis kiri tebal (`▎`, 4px, warna urgensi) sebagai *scan anchor* — petugas bisa memindai kolom kiri tanpa membaca teks untuk menilai prioritas, mempercepat alur kerja shift padat.
- Diurutkan turun berdasarkan skor urgensi (bawaan PRD Section 5.2), petugas dapat mengubah urutan sekunder (waktu masuk) via kontrol filter, bukan drag-and-drop (menghindari kompleksitas interaksi yang rawan salah pakai di lingkungan kerja cepat).

### 6.5 Petugas — Detail Laporan & Panel AI (FR-3.2, FR-2.5)

```
┌───────────────────── Laporan #LP-2026-08-0412 ─────────┐
│ ● KRITIS · Kategori: Kebakaran · Dinas: BPBD             │
│                                                            │
│ Ringkasan AI:                                              │
│  "Kebakaran rumah warga di RT 03, dilaporkan masih         │
│   berlangsung, tidak ada korban jiwa dilaporkan."          │
│                                                            │
│ ⓘ Alasan AI (klik untuk detail lengkap)          [▾]      │
│    "Terdapat indikasi ancaman jiwa langsung dan            │
│     kejadian sedang berlangsung — sesuai kriteria          │
│     Kritis pada rubrik urgensi."                           │
│                                                            │
│ ⚠ AI menilai urgensi & kategori — bukan kebenaran laporan. │
│    Verifikasi lapangan tetap tanggung jawab petugas.       │
│                                                            │
│ Terindikasi Duplikat: Tidak                                │
│                                                            │
│ [ Setujui ]  [ Koreksi Kategori/Urgensi ]  [ Tandai Tidak  │
│                                              Relevan ]      │
└────────────────────────────────────────────────────────┘
```
Detail lengkap pola panel AI ada di Section 7.

### 6.6 Admin — Routing & SLA (FR-3.3, FR-3.4, Section 36)

Tabel editable: kolom Kategori (readonly, dari LLM) → Dinas Tujuan (dropdown, default dari lookup Section 36, dapat dioverride) → riwayat perubahan (siapa & kapan mengubah, sesuai FR-3.5 audit).

### 6.7 Supervisor — Dashboard Analitik (FR-3.6)

Tiga blok: (1) kartu ringkasan angka (total laporan, rata-rata waktu respons, % SLA terpenuhi) — angka besar tanpa gradient/ilustrasi 3D, cukup angka + label; (2) grafik tren batang/garis flat (warna dari palet urgensi bila memecah per level); (3) peta sebaran (marker warna sesuai urgensi, bukan heatmap gradient panas — demi konsistensi dengan aturan "warna urgensi konsisten di seluruh produk").

### 6.8 Auditor — Log Viewer (FR-3.5)

Tabel kronologis read-only: timestamp, aktor (AI/nama petugas), laporan terkait, aksi, versi model/prompt (selaras Section 8.3 Langkah 5 PRD — auditability). Filter per rentang tanggal & aktor, ekspor CSV.

---

## 7. Pola Interaksi Khusus: Menampilkan AI Secara Bertanggung Jawab

Ini adalah bagian paling kritis dari desain LAPOR-AI karena produk ini secara eksplisit **bukan** pemutus kebenaran (Section 2, 10 PRD). Tiga aturan wajib di seluruh antarmuka:

1. **AI selalu diberi label sebagai rekomendasi, tidak pernah sebagai fakta.** Setiap output AI (kategori, urgensi, ringkasan) memakai kata kerja "menilai"/"merekomendasikan", bukan "menentukan"/"memutuskan". Frasa baku: *"AI menilai urgensi & kategori — bukan kebenaran laporan."* muncul persisten di panel detail petugas (bukan sekali di onboarding lalu hilang).
2. **Justifikasi (FR-2.5) selalu collapsible tapi tidak pernah tersembunyi total** — tersedia satu klik, defaultnya ringkas 1 kalimat, bisa diperluas ke reasoning penuh. Ini memenuhi kebutuhan XAI (Section PRD terkait) tanpa membanjiri petugas dengan teks di tampilan awal.
3. **Indikasi duplikasi/spam memakai bahasa netral teknis**, bukan tuduhan ("Terindikasi Duplikat Teknis", bukan "Terdeteksi Spam") — konsisten dengan FR-2.6 yang menegaskan ini murni pola teknis, bukan penilaian isi.

Untuk warga, AI **tidak pernah** ditampilkan sebagai chatbot atau avatar animasi — cukup status tekstual netral ("Terverifikasi AI") agar tidak menimbulkan ekspektasi bahwa mereka sedang "mengobrol dengan AI yang menilai kebenaran laporan mereka" (risiko yang sudah diidentifikasi PRD Section 13, baris "Warga berharap sistem memverifikasi kebenaran laporan").

---

## 8. Aksesibilitas (WCAG 2.1 AA — sesuai NFR Section 7 PRD)

| Area | Standar Implementasi |
|---|---|
| Kontras warna | Semua kombinasi teks/latar pada Section 4.1 diverifikasi ≥ 4.5:1 (teks normal) / ≥ 3:1 (teks besar & elemen non-teks seperti border badge) |
| Tidak bergantung warna saja | Urgency badge selalu teks + dot, status timeline selalu berlabel teks, bukan warna titik saja |
| Navigasi keyboard | Seluruh form warga & dashboard petugas dapat dioperasikan penuh via Tab/Enter/Space; urutan fokus mengikuti urutan visual |
| Focus indicator | Outline focus 2px `color-primary`, terlihat jelas di `color-paper` maupun `color-surface` — tidak dihilangkan (`outline: none` dilarang tanpa pengganti) |
| Form warga | Label eksplisit (bukan placeholder-sebagai-label), pesan error inline di dekat field, `aria-describedby` untuk helper text batas karakter |
| Target sentuh mobile | Minimum 44×44px untuk seluruh tombol/kontrol interaktif di alur warga |
| Bahasa | Atribut `lang="id"` pada dokumen; jika ke depan UI mendukung istilah Bahasa Bangka, ditandai `lang="pkb"` pada elemen terkait |
| Reduced motion | `prefers-reduced-motion: reduce` menonaktifkan seluruh transisi non-esensial |

---

## 9. Strategi Responsif

| Breakpoint | Lebar | Perilaku |
|---|---|---|
| Mobile | < 640px | Basis desain untuk seluruh alur warga (mobile-first sesuai NFR PRD); dashboard petugas dialihkan ke ringkasan kartu vertikal, aksi utama tetap dapat dilakukan namun analitik kompleks diarahkan "buka di desktop" |
| Tablet | 640–1024px | Form warga tetap kolom tunggal terpusat (720px max), dashboard petugas mulai menampilkan tabel 2 kolom informasi |
| Desktop | > 1024px | Dashboard penuh (tabel padat, panel detail berdampingan dengan daftar antrean — pola master-detail untuk efisiensi petugas) |

Alur warga (form, lacak status) **tidak** memiliki versi "desktop mewah" terpisah — cukup dilebarkan dengan margin, karena mayoritas warga mengakses via ponsel saat melapor di lokasi kejadian (asumsi eksplisit dari konteks penggunaan darurat).

---

## 10. Microcopy & Tone of Voice

**Prinsip:** formal-institusional tapi manusiawi — bukan bahasa birokrasi kaku, bukan pula bahasa aplikasi konsumer yang terlalu santai.

| Situasi | Contoh Microcopy |
|---|---|
| Sukses submit | "Laporan Anda diterima. Simpan nomor tiket ini untuk memantau status." |
| Error validasi | "Deskripsi belum diisi. Ceritakan kejadiannya agar petugas dapat menindaklanjuti." |
| Batas karakter tercapai | "Deskripsi dibatasi 2.000 karakter agar dapat diproses sistem. Silakan ringkas bagian terpenting." |
| Kondisi kosong (antrean petugas) | "Belum ada laporan masuk. Antrean akan otomatis diperbarui." |
| Kegagalan sistem AI sementara | "Laporan tersimpan dan akan diproses ulang otomatis. Anda tidak perlu mengirim ulang." (selaras Section 8.3 Langkah 4 — laporan tidak hilang saat fallback) |
| Mode anonim | "Anda tidak akan menerima notifikasi status karena melapor secara anonim. Anda tetap dapat melacak status manual dengan nomor tiket." |

Aturan: pesan error/kosong **tidak pernah meminta maaf** dan **selalu menyertakan langkah selanjutnya** — bukan mood, tapi arah (selaras praktik penulisan produk yang baik).

---

## 11. Design Token — Ringkasan untuk Hand-off Engineering

```css
:root {
  /* Warna institusional */
  --color-ink: #1A2420;
  --color-paper: #F3F4EF;
  --color-surface: #FFFFFF;
  --color-line: #D8DAD2;
  --color-primary: #1F4E4B;
  --color-primary-hover: #163A38;
  --color-accent-stamp: #A23B2E;
  --color-muted: #5B6357;

  /* Warna semantik urgensi (fungsional, jangan dipakai dekoratif) */
  --urgency-critical: #B3261E;
  --urgency-critical-tint: #FBEAEA;
  --urgency-high: #94570A;
  --urgency-high-tint: #FCF1DC;
  --urgency-medium: #3E5C78;
  --urgency-medium-tint: #E9EEF3;
  --urgency-low: #4B564D;
  --urgency-low-tint: #EEF1EC;

  /* Tipografi */
  --font-display: "Source Serif 4", serif;
  --font-ui: "IBM Plex Sans", sans-serif;
  --font-mono: "IBM Plex Mono", monospace;

  /* Radius & spacing */
  --radius-control: 4px;
  --radius-card: 8px;
  --space-unit: 8px;
}
```

---

## 12. Traceability — Pemetaan Desain ke Requirement PRD

| Elemen Desain | FR/Section PRD Terkait |
|---|---|
| Form 4-langkah, counter karakter | FR-1.1, FR-2.9 |
| Kartu Tiket & timeline status | FR-1.4 |
| Toggle anonim eksplisit | FR-1.6 |
| Field email + layar OTP | FR-1.7, FR-EV.1–EV.6 |
| Helper text dwibahasa tanpa pilihan manual | FR-1.8, FR-2.0 |
| Tombol Quick-Fill tersembunyi di produksi | FR-1.9 |
| Panel justifikasi collapsible | FR-2.5, Section 8.5 |
| Badge "Terindikasi Duplikat Teknis" | FR-2.6 |
| Pesan "tersimpan, diproses ulang otomatis" | Section 8.3 Langkah 4 (fallback) |
| Garis kiri warna urgensi pada antrean | FR-3.1 |
| Aksi Setujui/Koreksi/Tandai Tidak Relevan | FR-3.2 |
| Tabel routing dinas editable | FR-3.3, Section 36 |
| Konfigurasi SLA | FR-3.4 |
| Log viewer read-only | FR-3.5 |
| Dashboard analitik agregat | FR-3.6 |
| Palet WCAG AA, target sentuh 44px | NFR Aksesibilitas & Responsivitas, Section 7 |

---

## 13. Pertanyaan Terbuka untuk Tim

- Apakah peta sebaran (Section 6.7) memerlukan basemap pihak ketiga (mis. OpenStreetMap) — perlu dicek lisensi & biaya untuk tetap sejalan dengan prinsip biaya operasional rendah (Section 7 PRD).
- Perlu validasi bersama penutur asli Bahasa Bangka apakah helper text & label cukup jelas bagi pelapor yang menulis dalam Bahasa Bangka (terkait Section 15 PRD, Open Question glossary).
- Apakah dashboard petugas perlu mode "dense/compact" opsional untuk shift dengan volume sangat tinggi — belum diputuskan, diusulkan sebagai eksperimen Fase 2.