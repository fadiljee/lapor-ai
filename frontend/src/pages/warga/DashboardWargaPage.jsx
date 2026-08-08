import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sidebar } from '../../components/dashboard/Sidebar';
import { UrgencyBadge } from '../../components/common/UrgencyBadge';
import { api } from '../../services/api';
import { FilePlus, Search, ShieldCheck, Bot, Clock, ArrowRight, CheckCircle, Sparkles, FileText } from 'lucide-react';

export function DashboardWargaPage() {
  const userName = localStorage.getItem('lapor_ai_nama') || 'Warga Pelapor';
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getReports()
      .then((data) => {
        setRecentReports(data.slice(0, 5));
      })
      .catch((err) => console.error('Error fetching citizen reports:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 bg-bg-base overflow-x-hidden">
        {/* Welcome Banner */}
        <div className="bg-primary text-white p-6 rounded-lg mb-6 shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <span className="bg-accent text-white text-[10px] uppercase tracking-widest px-2 py-0.5 rounded font-mono font-bold">
              Portal Warga Pelapor
            </span>
            <h1 className="font-display font-bold text-2xl mt-2 mb-1">
              Selamat datang, {userName}!
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Platform layanan pengaduan publik berbasis AI Triage. Sampaikan permasalahan infrastruktur, pelayanan publik, lingkungan, hingga keamanan wilayah Anda secara mudah dan transparan.
            </p>
          </div>
        </div>

        {/* Action Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white border border-border p-6 rounded-lg shadow-sm hover:border-primary transition-colors flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded bg-primary text-white flex items-center justify-center mb-4">
                <FilePlus className="w-5 h-5" />
              </div>
              <h2 className="font-serif font-bold text-lg text-text-primary mb-2">
                Ajukan Laporan Baru
              </h2>
              <p className="text-xs text-text-secondary leading-relaxed mb-4">
                Melaporkan masalah jalan berlubang, sampah, lampu padam, fasilitas umum rusak, atau masalah pelayanan publik lainnya dengan foto & titik GPS otomatis.
              </p>
            </div>
            <Link
              to="/lapor"
              className="inline-flex items-center justify-between bg-accent hover:bg-accent-hover text-white px-4 py-2.5 rounded text-xs font-bold transition-colors w-full sm:w-auto"
            >
              <span>Mulai Formulir Pengaduan</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-white border border-border p-6 rounded-lg shadow-sm hover:border-primary transition-colors flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded bg-primary-dark text-white flex items-center justify-center mb-4">
                <Search className="w-5 h-5" />
              </div>
              <h2 className="font-serif font-bold text-lg text-text-primary mb-2">
                Lacak Status Tiket
              </h2>
              <p className="text-xs text-text-secondary leading-relaxed mb-4">
                Masukkan Kode Tiket (Contoh: LP-2026-08-1234) untuk memantau progres verifikasi AI, disposisi dinas, hingga penyelesaian oleh petugas di lapangan.
              </p>
            </div>
            <Link
              to="/lacak"
              className="inline-flex items-center justify-between bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded text-xs font-bold transition-colors w-full sm:w-auto"
            >
              <span>Lacak Progres Laporan</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Live Recent Reports Section (Real Data from PostgreSQL) */}
        <div className="bg-white border border-border p-6 rounded-lg shadow-sm mb-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <h3 className="font-serif font-bold text-base text-text-primary">
                Daftar Pengaduan Masuk Real-Time
              </h3>
            </div>
            <span className="text-xs text-text-secondary font-mono">Real PostgreSQL Database</span>
          </div>

          {loading ? (
            <div className="text-center text-xs text-text-secondary py-6">Memuat pengaduan real-time...</div>
          ) : recentReports.length === 0 ? (
            <div className="text-center text-xs text-text-secondary py-6">Belum ada pengaduan. Silakan ajukan laporan pertama Anda!</div>
          ) : (
            <div className="divide-y divide-border text-xs">
              {recentReports.map((rpt) => (
                <div key={rpt.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Link
                        to="/lacak"
                        state={{ ticketId: rpt.id }}
                        className="font-mono font-bold text-primary hover:text-accent hover:underline transition-colors"
                        title="Klik untuk lacak rincian tiket ini"
                      >
                        {rpt.id}
                      </Link>
                      <UrgencyBadge level={rpt.skor_urgensi} />
                      <span className="text-[10px] text-text-secondary">· {rpt.created_at}</span>
                    </div>
                    <p className="text-text-primary font-medium line-clamp-1 mb-0.5">{rpt.ringkasan || rpt.deskripsi_masked}</p>
                    <span className="text-[11px] text-text-secondary">{rpt.lokasi_alamat} → <span className="font-semibold text-text-primary">{rpt.dinas_tujuan}</span></span>
                  </div>
                  <Link
                    to="/lacak"
                    state={{ ticketId: rpt.id }}
                    className="inline-flex items-center justify-center gap-1.5 bg-primary text-white hover:bg-primary-dark px-3 py-1.5 rounded text-xs font-bold transition-colors shrink-0 shadow-sm"
                  >
                    <span>Lacak Tiket Ini →</span>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Information & Safeguard Panel */}
        <div className="bg-white border border-border p-6 rounded-lg shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Sparkles className="w-5 h-5 text-primary" />
            <h3 className="font-serif font-bold text-base text-text-primary">
              Bagaimana LAPOR-AI Memproses Laporan Anda?
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-bg-base p-4 rounded border border-border space-y-1.5">
              <div className="font-bold text-primary flex items-center gap-1.5">
                <Bot className="w-4 h-4" />
                <span>1. Masking PII &amp; AI Triage</span>
              </div>
              <p className="text-text-secondary">
                Identitas pribadi Anda disamarkan secara otomatis. AI mengekstrak kategori, lokasi, dan menentukan tingkat urgensi awal.
              </p>
            </div>

            <div className="bg-bg-base p-4 rounded border border-border space-y-1.5">
              <div className="font-bold text-primary flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>2. Validasi Petugas Triage</span>
              </div>
              <p className="text-text-secondary">
                Petugas verifikator meninjau hasil evaluasi AI untuk memastikan keakuratan klasifikasi sebelum diteruskan ke dinas teknis.
              </p>
            </div>

            <div className="bg-bg-base p-4 rounded border border-border space-y-1.5">
              <div className="font-bold text-primary flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>3. Tindak Lanjut SLA</span>
              </div>
              <p className="text-text-secondary">
                Dinas tujuan memproses laporan sesuai target batas waktu (SLA) dan memperbarui bukti penyelesaian masalah.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
