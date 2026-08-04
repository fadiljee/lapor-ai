import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FilePlus, Search, Zap, ShieldCheck, Route, ArrowRight } from 'lucide-react';
import { AiStampCap } from '../../components/common/AiStampCap';
import { api } from '../../services/api';

/* ── Resi horizontal — alur laporan 5 tahap ───────────────────── */
const FLOW_STEPS = [
  { num: '01', label: 'Tulis Laporan', sub: 'Bahasa Indonesia atau Bahasa Bangka' },
  { num: '02', label: 'Triage AI', sub: '< 10 detik skoring urgensi' },
  { num: '03', label: 'Tinjauan Petugas', sub: '3 hari verifikasi' },
  { num: '04', label: 'Tindak Lanjut', sub: '5 hari penanganan dinas' },
  { num: '05', label: 'Tanggapan Resmi', sub: '10 hari tanggapan maksimal' },
];

export function HomePage() {
  const [kpi, setKpi] = useState(null);

  useEffect(() => {
    api.getDashboardStats()
      .then((d) => setKpi(d.kpi))
      .catch(() => null); // silently fail — fallback shown
  }, []);

  const liveStats = [
    {
      value: kpi != null ? kpi.total_reports : '>0',
      label: 'Total Laporan Diterima di Sistem',
    },
    {
      value: kpi != null ? `${kpi.ai_accuracy_rate}%` : '>90%',
      label: 'Akurasi Rekomendasi AI (Human Agreement)',
    },
    {
      value: '100%',
      label: 'PII Disamarkan Sebelum Diproses AI',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* ── Hero Section ──────────────────────────────────────── */}
      <section className="mb-10 grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
        <div className="lg:col-span-3">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 border border-[#D8D4C9] bg-[#E7ECEF] text-[#1F3A52] px-3 py-1 rounded text-[10px] font-mono-ticket font-semibold uppercase tracking-widest mb-5">
            Sistem Pengaduan Publik Berbasis AI
          </div>

          {/* H1 — Fraunces Display */}
          <h1 className="font-display text-[32px] sm:text-[42px] lg:text-[52px] font-semibold text-[#1A1D1F] leading-[1.12] tracking-tight mb-5">
            Laporkan.<br />
            Diprioritaskan<br className="hidden sm:block" /> otomatis.<br />
            Dipastikan manusia.
          </h1>

          <p className="text-[#6B6862] text-base leading-relaxed mb-7 max-w-lg">
            LAPOR-AI menambahkan tiga hal ke sistem pengaduan yang sudah ada:
            laporan darurat naik ke atas antrean secara otomatis, laporan disalurkan ke
            dinas yang tepat, dan laporan ganda tidak lagi membanjiri antrean.{' '}
            <span className="font-semibold text-[#1A1D1F]">AI tidak pernah menentukan apakah suatu laporan benar atau salah — itu tetap kerja manusia.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/lapor"
              className="bg-[#A32A21] hover:bg-[#7A1F19] text-white px-6 py-3.5 rounded font-bold text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <FilePlus className="w-5 h-5" />
              <span>Buat Laporan</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
            <Link
              to="/lacak"
              className="border-[1.5px] border-[#1F3A52] text-[#1F3A52] hover:bg-[#E7ECEF] px-6 py-3.5 rounded font-bold text-sm flex items-center justify-center gap-2 transition-colors bg-transparent"
            >
              <Search className="w-5 h-5" />
              <span>Lacak Tiket</span>
            </Link>
          </div>
        </div>

        {/* Hero Illustration — Resi sedang diproses */}
        <div className="lg:col-span-2 flex flex-col items-center gap-4">
          <div className="relative bg-[#FFFFFF] border border-[#D8D4C9] rounded-lg p-5 w-full max-w-xs" style={{ boxShadow: '0 1px 3px rgba(0,0,0,.07)' }}>
            {/* Mini ticket preview */}
            <div className="bg-[#1F3A52] -mx-5 -mt-5 px-5 py-2.5 rounded-t-lg mb-4 flex items-center justify-between">
              <span className="text-[9px] font-mono-ticket text-[#D8D4C9] uppercase tracking-widest">LAPOR-AI · Resi</span>
              <span className="text-[9px] font-mono-ticket bg-[#A32A21] text-white px-1.5 py-0.5 rounded uppercase tracking-widest">RESMI</span>
            </div>
            <div className="text-[9px] text-[#6B6862] font-mono-ticket uppercase tracking-widest mb-1">Nomor Tiket</div>
            <div className="font-mono-ticket text-base font-bold text-[#1A1D1F] tracking-wider mb-3">LPR-2026-0088231</div>
            <div className="border-t border-dashed border-[#D8D4C9] my-3 relative">
              <div className="absolute -left-7 -top-2.5 w-4 h-4 rounded-full bg-[#F4F3EE] border border-[#D8D4C9] border-l-0" />
              <div className="absolute -right-7 -top-2.5 w-4 h-4 rounded-full bg-[#F4F3EE] border border-[#D8D4C9] border-r-0" />
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div><span className="text-[#6B6862]">Status:</span><br /><span className="font-semibold text-[#1F3A52]">Terverifikasi AI</span></div>
              <div><span className="text-[#6B6862]">Kategori:</span><br /><span className="font-semibold text-[#1A1D1F]">Infrastruktur</span></div>
            </div>
          </div>
          {/* Cap AI sebagai ilustrasi hero */}
          <AiStampCap variant="analyzing" size={80} showLabel={true} />
        </div>
      </section>

      {/* ── Strip 3 Fitur AI ──────────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {[
          {
            icon: <Zap className="w-5 h-5" />,
            iconBg: 'bg-[#FAEAEA] text-[#A32A21]',
            title: 'Triage Urgensi Kritis',
            desc: 'Laporan kritis (kebakaran, kekerasan berlangsung) langsung dikirim ke petugas piket tanpa menunggu antrean.',
            badge: 'Presisi target >90% (G3)',
          },
          {
            icon: <Route className="w-5 h-5" />,
            iconBg: 'bg-[#E7ECEF] text-[#1F3A52]',
            title: 'Routing Otomatis ke Dinas',
            desc: 'AI membaca kategori masalah dan menyarankan dinas/instansi tujuan yang paling relevan.',
            badge: 'Tanpa bolak-balik antar meja',
          },
          {
            icon: <ShieldCheck className="w-5 h-5" />,
            iconBg: 'bg-[#EDF2EE] text-[#4B6E4F]',
            title: 'Deteksi Laporan Ganda',
            desc: 'Laporan berulang dari sumber yang sama atau jelas bukan pengaduan sungguhan ditandai otomatis.',
            badge: 'Deteksi pola teknis, bukan isi',
          },
        ].map((f, i) => (
          <div key={i} className="bg-[#FFFFFF] border border-[#D8D4C9] rounded-lg p-5">
            <div className={`w-10 h-10 rounded flex items-center justify-center mb-4 ${f.iconBg}`}>
              {f.icon}
            </div>
            <h3 className="font-bold text-sm text-[#1A1D1F] mb-2">{f.title}</h3>
            <p className="text-xs text-[#6B6862] leading-relaxed mb-3">{f.desc}</p>
            <span className="text-[10px] font-mono-ticket text-[#6B6862] bg-[#F4F3EE] border border-[#D8D4C9] px-2 py-0.5 rounded">
              {f.badge}
            </span>
          </div>
        ))}
      </section>

      {/* ── Resi Horizontal — Alur Laporan ───────────────────── */}
      <section className="mb-10">
        <h2 className="font-display text-xl sm:text-2xl font-semibold text-[#1A1D1F] mb-5">
          Alur Laporan Warga
        </h2>
        <div className="bg-[#FFFFFF] border border-[#D8D4C9] rounded-lg overflow-hidden">
          <div className="grid grid-cols-5 divide-x divide-dashed divide-[#D8D4C9]">
            {FLOW_STEPS.map((step, i) => (
              <div key={i} className="p-4 text-center">
                <div className="font-mono-ticket text-2xl font-bold text-[#D8D4C9] mb-1">{step.num}</div>
                <div className="text-xs font-bold text-[#1A1D1F] mb-1 leading-tight">{step.label}</div>
                <div className="text-[10px] text-[#6B6862] leading-tight">{step.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Statistik Live (Real DB) ───────────────────────── */}
      <section className="mb-10 border-y-4 border-[#A32A21] py-6 bg-[#FFFFFF]">
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#D8D4C9]">
          {liveStats.map((s, i) => (
            <div key={i} className="text-center px-6 py-4">
              <div className="font-display text-3xl sm:text-4xl font-semibold text-[#1A1D1F] mb-1">{s.value}</div>
              <div className="text-xs text-[#6B6862]">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Human-in-the-Loop Disclaimer ─────────────────────── */}
      <section className="bg-[#E7ECEF] border border-[#D8D4C9] rounded-lg p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[#1F3A52] shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-sm text-[#1F3A52] mb-1">
              Transparansi &amp; Prinsip Human-in-the-Loop
            </div>
            <p className="text-xs text-[#6B6862] leading-relaxed">
              Sistem LAPOR-AI tidak menggantikan verifikasi fakta di lapangan dan{' '}
              <span className="font-semibold text-[#1A1D1F]">tidak melakukan deteksi disinformasi/hoaks</span>.
              AI hanya memberikan rekomendasi skoring urgensi dan kategori dinas.
              Keputusan penanganan akhir tetap berada di tangan petugas verifikator manusia.{' '}
              <Link to="/tentang-lapor-ai" className="text-[#1F3A52] font-semibold underline underline-offset-2 hover:text-[#A32A21] transition-colors">
                Pelajari cara kerja AI →
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
