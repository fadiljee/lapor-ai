import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FilePlus, BarChart2, CheckCircle2, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { AiStampCap } from '../../components/common/AiStampCap';

/* ── Alur singkat 4 tahap ─────────────────────────────────────── */
const FLOW = [
  { label: 'Warga menulis', sub: 'Bahasa Indonesia atau Bahasa Bangka' },
  { label: 'AI menandai urgensi & kategori', sub: '< 10 detik, otomatis' },
  { label: 'Petugas meninjau', sub: 'Setiap rekomendasi wajib dikonfirmasi' },
  { label: 'Warga dapat kabar', sub: 'Notifikasi email pergerakan status' },
];

/* ── FAQ baru ───────────────────────────────────── */
const FAQ_ITEMS = [
  {
    q: 'Apakah AI bisa membuat kesalahan?',
    a: 'Ya. Model bahasa memiliki keterbatasan — terutama untuk konteks lokal, laporan ambigu, atau situasi yang belum pernah ditemui sebelumnya. Itulah mengapa setiap rekomendasi AI (skor urgensi, kategori, tanda duplikat) harus disetujui atau dikoreksi oleh petugas verifikator sebelum menjadi keputusan final.'
  },
  {
    q: 'Apa yang terjadi kalau saya tidak setuju dengan klasifikasi AI?',
    a: 'Anda dapat mengajukan klarifikasi melalui sistem. Petugas berwenang mengubah kategori, skor urgensi, atau penugasan dinas kapan saja. Rekomendasi AI bukan keputusan — petugas manusia yang memutuskan.'
  },
  {
    q: 'Apakah data laporan saya dipakai melatih AI lain?',
    a: 'Tidak. Data laporan warga tidak digunakan untuk melatih ulang model AI mana pun. Data disimpan sesuai ketentuan retensi UU PDP Indonesia dan tidak dibagikan ke pihak ketiga di luar keperluan penanganan laporan.'
  },
  {
    q: 'Siapa yang bisa melihat isi laporan saya?',
    a: 'Petugas yang ditugaskan menangani laporan, dan atasan mereka dalam rantai disposisi. AI memproses versi laporan yang sudah disamarkan — nama, NIK, nomor HP, dan email otomatis diredaksi sebelum teks dikirim ke model.'
  },
  {
    q: 'Berapa lama laporan saya akan diproses?',
    a: 'Klasifikasi AI berlangsung dalam hitungan detik setelah pengiriman. Verifikasi petugas ditargetkan dalam 3 hari kerja, tindak lanjut dinas dalam 5 hari kerja, dan tanggapan resmi maksimal 10 hari kerja — sesuai target standar pelayanan publik.'
  },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-none">
      <button
        className="w-full text-left flex items-center justify-between py-4 gap-3 group"
        onClick={() => setOpen((v) => !v)}
      >
        <span className={`text-sm font-semibold transition-colors ${open ? 'text-primary' : 'text-text-text-primary group-hover:text-primary'}`}>
          {q}
        </span>
        {open
          ? <ChevronUp className="w-4 h-4 text-primary shrink-0" />
          : <ChevronDown className="w-4 h-4 text-text-secondary shrink-0" />
        }
      </button>
      {open && (
        <p className="pb-4 text-sm text-text-secondary leading-relaxed">
          {a}
        </p>
      )}
    </div>
  );
}

export function AboutLaporAiPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="mb-12 grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
        <div className="md:col-span-3">
          {/* Eyebrow */}
          <div className="text-[10px] font-mono-ticket text-primary uppercase tracking-[0.2em] mb-4">
            Sistem Pengaduan Publik Berbasis AI
          </div>

          {/* H1 — Fraunces */}
          <h1 className="font-display text-[28px] sm:text-[36px] font-semibold text-text-text-primary leading-[1.15] mb-5">
            Setiap laporan dibaca dalam hitungan detik.
            Setiap keputusan tetap di tangan petugas.
          </h1>

          <p className="text-text-secondary text-sm leading-relaxed">
            LAPOR-AI menambahkan tiga hal ke sistem pengaduan yang sudah ada: laporan darurat naik ke atas antrean secara otomatis, laporan disalurkan ke dinas yang tepat tanpa menunggu petugas membacanya satu per satu, dan laporan ganda/spam tidak lagi membanjiri antrean.{' '}
            <span className="font-semibold text-text-text-primary">AI tidak pernah menentukan apakah suatu laporan benar atau salah. Hal tersebut tetap menjadi tugas manusia.</span>
          </p>
        </div>

        {/* Hero Illustration — Resi + Cap AI */}
        <div className="md:col-span-2 flex flex-col items-center gap-5">
          <div className="relative bg-white border border-border rounded-lg p-5 w-full" style={{ boxShadow: '0 1px 3px rgba(0,0,0,.07)' }}>
            <div className="bg-primary -mx-5 -mt-5 px-5 py-2.5 rounded-t-lg mb-4 flex items-center justify-between">
              <span className="text-[9px] font-mono-ticket text-slate-300 uppercase tracking-widest">LAPOR-AI · Resi Laporan</span>
              <span className="text-[9px] font-mono-ticket bg-accent text-white px-1.5 py-0.5 rounded uppercase tracking-widest">RESMI</span>
            </div>
            <div className="text-[9px] text-text-secondary font-mono-ticket uppercase tracking-widest mb-1">Nomor Tiket</div>
            <div className="font-mono-ticket text-base font-bold text-text-text-primary tracking-wider mb-3">LPR-2026-0088231</div>
            <div className="border-t border-dashed border-border my-3 relative mx-2">
              <div className="absolute -left-6 -top-2 w-3.5 h-3.5 rounded-full bg-bg-base border border-border border-l-0" />
              <div className="absolute -right-6 -top-2 w-3.5 h-3.5 rounded-full bg-bg-base border border-border border-r-0" />
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div><span className="text-text-secondary">Status:</span><br /><span className="font-semibold text-primary">Menunggu Petugas</span></div>
              <div><span className="text-text-secondary">Urgensi:</span><br /><span className="font-semibold text-amber-700">TINGGI</span></div>
            </div>
          </div>
          <AiStampCap variant="analyzing" size={72} showLabel={true} />
        </div>
      </section>

      <hr className="border-border mb-12" />

      {/* ── Tiga Hal yang Dikerjakan AI ───────────────────────── */}
      <section className="mb-12">
        <h2 className="font-display text-2xl sm:text-[28px] font-semibold text-text-text-primary mb-6">
          Tiga hal yang dikerjakan AI
        </h2>
        <p className="text-xs text-text-secondary mb-6">
          Ketiganya berjalan paralel, bukan tahapan berurutan.
        </p>

        <div className="space-y-4">
          {[
            {
              title: 'Triase urgensi',
              badge: 'Presisi target >90%',
              body: 'Setiap laporan yang masuk diberi skor Kritis/Tinggi/Sedang/Rendah berdasarkan isi laporannya. Laporan berlabel Kritis (misalnya indikasi kebakaran atau kekerasan yang sedang terjadi) langsung dikirim ke petugas piket, tanpa menunggu giliran antrean.',
            },
            {
              title: 'Routing otomatis ke dinas',
              badge: 'Tanpa bolak-balik antar meja',
              body: 'AI membaca kategori masalah dan menyarankan dinas/instansi tujuan yang paling relevan, supaya laporan tidak nyasar dan bolak-balik dipindah antar meja.',
            },
            {
              title: 'Deteksi laporan ganda & spam teknis',
              badge: 'Deteksi pola, bukan isi',
              body: 'Laporan yang dikirim berulang-ulang dari sumber yang sama, atau jelas bukan pengaduan sungguhan, ditandai otomatis supaya tidak membanjiri antrean petugas. Ini murni deteksi pola teknis pengiriman — bukan penilaian benar-salahnya isi laporan.',
            },
          ].map((item, i) => (
            <div key={i} className="bg-white border border-border rounded-lg p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <h3 className="font-bold text-base text-text-text-primary">{item.title}</h3>
                <span className="text-[10px] font-mono-ticket text-text-secondary bg-bg-base border border-border px-2 py-0.5 rounded shrink-0">
                  {item.badge}
                </span>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-border mb-12" />

      {/* ── Yang TIDAK Dilakukan AI ───────────────────────────── */}
      <section className="mb-12">
        <h2 className="font-display text-2xl sm:text-[28px] font-semibold text-text-text-primary mb-2">
          Yang <em>tidak</em> dilakukan AI
        </h2>
        <p className="text-xs text-text-secondary mb-6">
          Bagian ini yang membuat sistem ini kredibel, bukan sekadar promosi.
        </p>

        <div className="space-y-3">
          {[
            'AI tidak memutuskan apakah suatu laporan benar atau bohong. Menentukan kebenaran memerlukan verifikasi lapangan oleh manusia, bukan sesuatu yang bisa diandalkan dari model bahasa saja.',
            'AI tidak menutup kasus atau menolak laporan atas namanya sendiri. Setiap rekomendasi AI (skor urgensi, kategori, tanda duplikat) harus disetujui atau dikoreksi oleh petugas sebelum menjadi keputusan final.',
            'Identitas pelapor anonim disembunyikan bahkan dari sistem AI itu sendiri. Nama, NIK, nomor HP, dan email disamarkan secara otomatis sebelum teks laporan diproses.',
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 bg-bg-base border border-border rounded-lg px-5 py-4">
              <XCircle className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <p className="text-sm text-text-text-primary leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-border mb-12" />

      {/* ── Alur Singkat — Resi Horizontal ───────────────────── */}
      <section className="mb-12">
        <h2 className="font-display text-2xl sm:text-[28px] font-semibold text-text-text-primary mb-5">
          Alur singkat
        </h2>
        <div className="bg-white border border-border rounded-lg overflow-hidden">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-dashed divide-slate-300">
            {FLOW.map((step, i) => (
              <div key={i} className="p-4 sm:p-5">
                <div className="font-mono-ticket text-2xl font-bold text-slate-300 mb-2">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="text-xs font-bold text-text-text-primary mb-1 leading-tight">{step.label}</div>
                <div className="text-[10px] text-text-secondary leading-tight">{step.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="border-border mb-12" />

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section className="mb-12">
        <h2 className="font-display text-2xl sm:text-[28px] font-semibold text-text-text-primary mb-6">
          Pertanyaan yang sering ditanyakan
        </h2>
        <div className="bg-white border border-border rounded-lg px-5">
          {FAQ_ITEMS.map((item, i) => (
            <FaqItem key={i} q={item.q} a={item.a} />
          ))}
        </div>
      </section>

      {/* ── CTA Penutup ──────────────────────────────────────── */}
      <section className="bg-white border border-border rounded-lg p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="flex-1">
          <h3 className="font-display text-xl font-semibold text-text-text-primary mb-2">
            Siap mencoba?
          </h3>
          <p className="text-sm text-text-secondary">
            Sampaikan laporan Anda, biarkan sistem memprioritaskan penyelesaiannya.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 shrink-0 justify-end">
          <Link
            to="/dashboard/lapor"
            className="bg-accent hover:bg-accent-hover text-white px-5 py-2.5 rounded font-bold text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <FilePlus className="w-4 h-4" />
            Buat Laporan
          </Link>
        </div>
      </section>
      
    </div>
  );
}
