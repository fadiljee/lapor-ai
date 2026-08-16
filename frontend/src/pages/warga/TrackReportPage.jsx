import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from '../../components/dashboard/Sidebar';
import { api } from '../../services/api';
import { TicketStub } from '../../components/common/TicketStub';
import { UrgencyBadge } from '../../components/common/UrgencyBadge';
import { AiStampCap } from '../../components/common/AiStampCap';
import { Search, Loader2, CheckCircle2, Image, Paperclip, ExternalLink } from 'lucide-react';


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
  if (currentStatus === 'Closed' && stepKey === 'Closed') return 'completed';
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
  const location = useLocation();
  const [ticketInput, setTicketInput] = useState(location.state?.ticketId || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [report, setReport] = useState(null);

  useEffect(() => {
    const targetId = location.state?.ticketId;
    if (targetId) {
      setTicketInput(targetId);
      setLoading(true);
      setError('');
      api.getReportDetail(targetId)
        .then((res) => setReport(res))
        .catch((err) => setError(err.message || 'Nomor tiket tidak ditemukan.'))
        .finally(() => setLoading(false));
    }
  }, [location.state]);

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
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 bg-bg-base overflow-x-hidden">
        <div className="max-w-4xl mx-auto space-y-6">

      
      <div className="bg-white border border-border rounded-lg p-6 mb-8 text-center">
        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-text-primary mb-2">
          Lacak Status Pengaduan Warga
        </h1>
        <p className="text-xs text-text-secondary mb-6 max-w-md mx-auto">
          Masukkan nomor tiket pengaduan resmi Anda (contoh:{' '}
          <span className="font-mono-ticket font-bold text-primary">LPR-2026-0088231</span>
          ) untuk memantau status terkini.
        </p>

        <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mx-auto">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-text-secondary absolute left-3 top-3" />
            <input
              type="text"
              value={ticketInput}
              onChange={(e) => setTicketInput(e.target.value)}
              placeholder="LPR-2026-XXXXXXX"
              className="w-full bg-bg-base border border-border rounded pl-9 pr-3 py-2.5 text-sm font-mono-ticket font-bold text-text-primary focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-accent hover:bg-accent-hover text-white px-5 py-2.5 rounded text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50 shrink-0"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Cari Tiket'}
          </button>
        </form>

        {error && (
          <div className="bg-red-50 border border-accent text-accent text-xs p-3 rounded mt-4 max-w-lg mx-auto text-left">
            {error}
          </div>
        )}
      </div>

      
      {report && (
        <div className="space-y-6">

          
          <div className="bg-white border border-border rounded-lg overflow-hidden">
            <div className="px-5 py-3 border-b border-border flex items-center justify-between">
              <h3 className="text-[11px] font-bold text-text-primary uppercase tracking-wider">
                Siklus Hidup Status Laporan
              </h3>
              <div className="flex items-center gap-2">
                <AiStampCap
                  variant={getStampVariant(report.status)}
                  size={48}
                  showLabel={false}
                />
                <div className="text-right">
                  <div className="text-[9px] text-text-secondary font-mono-ticket">Status AI</div>
                  <div className="text-[11px] font-bold text-primary">{report.status}</div>
                </div>
              </div>
            </div>

            
            <div className="grid grid-cols-3 sm:grid-cols-6 divide-x divide-dashed divide-border">
              {STATUS_STEPS.map((stepItem, idx) => {
                const st = getStepStatus(stepItem.key, report.status);
                return (
                  <div
                    key={idx}
                    className={`text-center py-4 px-2 transition-colors ${
                      st === 'current'
                        ? 'bg-primary text-white'
                        : st === 'completed'
                        ? 'bg-slate-100'
                        : 'bg-transparent'
                    }`}
                  >
                    <div className={`font-mono-ticket text-base font-bold mb-1 ${
                      st === 'current' ? 'text-white' : st === 'completed' ? 'text-primary' : 'text-slate-300'
                    }`}>
                      {st === 'completed' ? <CheckCircle2 className="w-4 h-4 mx-auto" /> : `0${idx + 1}`}
                    </div>
                    <span className={`text-[10px] font-medium ${
                      st === 'current' ? 'text-slate-200' : st === 'completed' ? 'text-primary' : 'text-text-secondary'
                    }`}>
                      {stepItem.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TicketStub
              ticketId={report.id}
              status={report.status}
              createdAt={report.created_at}
              pelaporEmail={report.pelapor_email}
              isAnonim={report.is_anonim}
              category={report.kategori}
            />

            <div className="bg-white border border-border rounded-lg p-5 space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="font-bold text-sm text-text-primary">Detail Pengaduan</span>
                <UrgencyBadge level={report.skor_urgensi} />
              </div>

              <div>
                <span className="text-text-secondary block mb-1 font-medium">Ringkasan Laporan:</span>
                <p className="text-text-primary bg-bg-base p-3 rounded border border-border leading-relaxed">
                  {report.deskripsi_masked}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-text-secondary block mb-0.5">Dinas Tujuan:</span>
                  <span className="font-bold text-primary">{report.dinas_tujuan}</span>
                </div>
                <div>
                  <span className="text-text-secondary block mb-0.5">Lokasi:</span>
                  <span className="font-semibold text-text-primary">{report.lokasi_alamat}</span>
                </div>
              </div>

              {report.lampiran_path && (
                <div className="pt-2 border-t border-border">
                  <span className="text-text-secondary block mb-2 font-medium flex items-center gap-1.5">
                    <Image className="w-3.5 h-3.5 text-primary" />
                    Lampiran Foto Bukti Terlampir:
                  </span>
                  <div className="flex items-center gap-3 bg-bg-base p-2.5 rounded border border-border">
                    <img
                      src={report.lampiran_path}
                      alt="Bukti Pengaduan"
                      className="w-16 h-16 object-cover rounded border border-border cursor-pointer shrink-0"
                      onClick={() => window.open(report.lampiran_path, '_blank')}
                    />
                    <div className="text-[11px] space-y-1">
                      <div className="font-bold text-text-primary">Foto Bukti Pengaduan</div>
                      <a
                        href={report.lampiran_path}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary font-semibold hover:underline inline-flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Buka Foto Asli
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
        </div>
      </main>
    </div>
  );
}
