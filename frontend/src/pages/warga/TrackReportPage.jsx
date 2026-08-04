import React, { useState } from 'react';
import { api } from '../../services/api';
import { TicketStub } from '../../components/common/TicketStub';
import { UrgencyBadge } from '../../components/common/UrgencyBadge';
import { AiStampCap } from '../../components/common/AiStampCap';
import { Search, Loader2, CheckCircle2 } from 'lucide-react';

/* ── Alur status laporan ─────────────────────────────────────── */
const STATUS_STEPS = [
  { key: 'Pending Email Verification', label: 'Verifikasi Email' },
  { key: 'Menunggu Verifikasi AI',     label: 'Antrean AI' },
  { key: 'Terverifikasi AI',           label: 'Terverifikasi AI' },
  { key: 'Assigned',                   label: 'Disposisi Dinas' },
  { key: 'In Progress',                label: 'Penanganan' },
  { key: 'Closed',                     label: 'Selesai' },
];

const STATUS_ORDER = [
  'Pending Email Verification',
  'Menunggu Verifikasi AI',
  'Terverifikasi AI',
  'Perlu Verifikasi Manual',
  'Assigned',
  'In Progress',
  'Resolved',
  'Closed',
];

function getStepStatus(stepKey, currentStatus) {
  const currentIndex = STATUS_ORDER.indexOf(currentStatus);
  const stepIndex = STATUS_ORDER.indexOf(stepKey);
  if (stepIndex < currentIndex) return 'completed';
  if (stepIndex === currentIndex) return 'current';
  return 'upcoming';
}

function getStampVariant(status) {
  if (!status) return 'waiting';
  const s = status.toLowerCase();
  if (s.includes('kritis') || s.includes('eskalasi')) return 'critical';
  if (s.includes('terverifikasi')) return 'verified';
  if (s.includes('selesai') || s.includes('closed') || s.includes('resolved')) return 'verified';
  if (s.includes('menganalisis') || s.includes('menunggu verifikasi')) return 'analyzing';
  return 'waiting';
}

export function TrackReportPage() {
  const [ticketInput, setTicketInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [report, setReport] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!ticketInput.trim()) return;

    setLoading(true);
    setError('');
    setReport(null);

    try {
      const res = await api.getReportDetail(ticketInput.trim());
      setReport(res);
    } catch (err) {
      setError(err.message || 'Nomor tiket tidak ditemukan dalam basis data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* ── Search Section ─────────────────────────────────────── */}
      <div className="bg-[#FFFFFF] border border-[#D8D4C9] rounded-lg p-6 mb-8 text-center">
        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#1A1D1F] mb-2">
          Lacak Status Pengaduan Warga
        </h1>
        <p className="text-xs text-[#6B6862] mb-6 max-w-md mx-auto">
          Masukkan nomor tiket pengaduan resmi Anda (contoh:{' '}
          <span className="font-mono-ticket font-bold text-[#1F3A52]">LPR-2026-0088231</span>
          ) untuk memantau status terkini.
        </p>

        <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mx-auto">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#6B6862] absolute left-3 top-3" />
            <input
              type="text"
              value={ticketInput}
              onChange={(e) => setTicketInput(e.target.value)}
              placeholder="LPR-2026-XXXXXXX"
              className="w-full bg-[#F4F3EE] border border-[#D8D4C9] rounded pl-9 pr-3 py-2.5 text-sm font-mono-ticket font-bold text-[#1A1D1F] focus:outline-none focus:border-[#1F3A52] transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#A32A21] hover:bg-[#7A1F19] text-white px-5 py-2.5 rounded text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50 shrink-0"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Cari Tiket'}
          </button>
        </form>

        {error && (
          <div className="bg-[#FAEAEA] border border-[#A32A21] text-[#A32A21] text-xs p-3 rounded mt-4 max-w-lg mx-auto text-left">
            {error}
          </div>
        )}
      </div>

      {/* ── Report Result ──────────────────────────────────────── */}
      {report && (
        <div className="space-y-6">

          {/* Status Timeline — Resi horizontal */}
          <div className="bg-[#FFFFFF] border border-[#D8D4C9] rounded-lg overflow-hidden">
            <div className="px-5 py-3 border-b border-[#D8D4C9] flex items-center justify-between">
              <h3 className="text-[11px] font-bold text-[#1A1D1F] uppercase tracking-wider">
                Siklus Hidup Status Laporan
              </h3>
              <div className="flex items-center gap-2">
                <AiStampCap
                  variant={getStampVariant(report.status)}
                  size={48}
                  showLabel={false}
                />
                <div className="text-right">
                  <div className="text-[9px] text-[#6B6862] font-mono-ticket">Status AI</div>
                  <div className="text-[11px] font-bold text-[#1F3A52]">{report.status}</div>
                </div>
              </div>
            </div>

            {/* Resi strip steps */}
            <div className="grid grid-cols-3 sm:grid-cols-6 divide-x divide-dashed divide-[#D8D4C9]">
              {STATUS_STEPS.map((stepItem, idx) => {
                const st = getStepStatus(stepItem.key, report.status);
                return (
                  <div
                    key={idx}
                    className={`text-center py-4 px-2 transition-colors ${
                      st === 'current'
                        ? 'bg-[#1F3A52] text-white'
                        : st === 'completed'
                        ? 'bg-[#E7ECEF]'
                        : 'bg-transparent'
                    }`}
                  >
                    <div className={`font-mono-ticket text-base font-bold mb-1 ${
                      st === 'current' ? 'text-white' : st === 'completed' ? 'text-[#1F3A52]' : 'text-[#D8D4C9]'
                    }`}>
                      {st === 'completed' ? <CheckCircle2 className="w-4 h-4 mx-auto" /> : `0${idx + 1}`}
                    </div>
                    <span className={`text-[10px] font-medium ${
                      st === 'current' ? 'text-[#D8D4C9]' : st === 'completed' ? 'text-[#1F3A52]' : 'text-[#6B6862]'
                    }`}>
                      {stepItem.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ticket Stub & Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TicketStub
              ticketId={report.id}
              status={report.status}
              createdAt={report.created_at}
              pelaporEmail={report.pelapor_email}
              isAnonim={report.is_anonim}
              category={report.kategori}
            />

            <div className="bg-[#FFFFFF] border border-[#D8D4C9] rounded-lg p-5 space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-[#D8D4C9] pb-3">
                <span className="font-bold text-sm text-[#1A1D1F]">Detail Pengaduan</span>
                <UrgencyBadge level={report.skor_urgensi} />
              </div>

              <div>
                <span className="text-[#6B6862] block mb-1 font-medium">Ringkasan Laporan:</span>
                <p className="text-[#1A1D1F] bg-[#F4F3EE] p-3 rounded border border-[#D8D4C9] leading-relaxed">
                  {report.deskripsi_masked}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[#6B6862] block mb-0.5">Dinas Tujuan:</span>
                  <span className="font-bold text-[#1F3A52]">{report.dinas_tujuan}</span>
                </div>
                <div>
                  <span className="text-[#6B6862] block mb-0.5">Lokasi:</span>
                  <span className="font-semibold text-[#1A1D1F]">{report.lokasi_alamat}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
