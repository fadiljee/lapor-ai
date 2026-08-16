import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/dashboard/Sidebar';
import { AIJustificationCard } from '../../components/dashboard/AIJustificationCard';
import { UrgencyBadge } from '../../components/common/UrgencyBadge';
import { api } from '../../services/api';
import { Inbox, CheckCircle2, MessageSquare, AlertCircle, RefreshCw, CheckCircle, Image, ExternalLink, Paperclip } from 'lucide-react';

export function DashboardDinasPage() {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionNotice, setActionNotice] = useState(null);
  const [actionError, setActionError] = useState('');
  const [closeNote, setCloseNote] = useState('');
  const [showCloseModal, setShowCloseModal] = useState(false);

  const instansiName = localStorage.getItem('lapor_ai_instansi');

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await api.getReports();
      // Only show reports that are Assigned or in Progress
      let active = data.filter(r => ['Assigned', 'Diproses'].includes(r.status));
      
      // If the admin belongs to a specific instansi, filter it
      if (instansiName) {
        active = active.filter(r => r.dinas_tujuan === instansiName);
      }
      
      setReports(active);
      if (active.length > 0) {
        const found = active.find((r) => r.id === selectedReport?.id);
        setSelectedReport(found || active[0]);
      } else {
        setSelectedReport(null);
      }
    } catch (err) {
      console.error('Error loading reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleSelectReport = (rpt) => {
    setSelectedReport(rpt);
    setActionNotice(null);
    setActionError('');
  };

  const handleProcessReport = async () => {
    if (!selectedReport) return;
    try {
      const updated = await api.overrideReport(selectedReport.id, {
        status: 'Diproses',
        catatan: 'Laporan sedang ditindaklanjuti oleh instansi.'
      });
      setSelectedReport(updated);
      setActionNotice({
        type: 'success',
        msg: `✓ Laporan #${selectedReport.id} sedang diproses.`
      });
      loadReports();
    } catch (err) {
      setActionError(err.message || 'Gagal mengubah status.');
    }
  };

  const submitCloseReport = async (e) => {
    e.preventDefault();
    if (!selectedReport) return;
    setActionNotice(null);
    setActionError('');

    try {
      const updated = await api.overrideReport(selectedReport.id, {
        status: 'Selesai',
        catatan: closeNote || 'Laporan telah diselesaikan oleh pihak berwenang.'
      });
      setSelectedReport(updated);
      setShowCloseModal(false);
      setCloseNote('');
      setActionNotice({
        type: 'success',
        msg: `✓ Laporan #${selectedReport.id} berhasil ditandai SELESAI!`
      });
      loadReports();
    } catch (err) {
      console.error('Error closing report:', err);
      setActionError(err.message || 'Gagal menutup laporan.');
    }
  };

  const getUrgencyBorderColor = (level) => {
    switch ((level || '').toUpperCase()) {
      case 'KRITIS': return 'border-l-accent';
      case 'TINGGI': return 'border-l-text-amber-700';
      case 'SEDANG': return 'border-l-primary';
      default: return 'border-l-text-text-secondary';
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 bg-bg-base overflow-x-hidden">
        {/* Header */}
        <div className="bg-white border border-border p-4 rounded-lg mb-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Inbox className="w-5 h-5 text-primary" />
            <h1 className="font-serif font-bold text-lg text-text-primary">
              Daftar Tugas Dinas
            </h1>
          </div>
          <button
            onClick={loadReports}
            className="p-2 bg-bg-base hover:bg-border rounded border border-border text-primary shrink-0 flex items-center gap-2 text-xs font-bold transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Muat Ulang
          </button>
        </div>

        {/* Notices */}
        {actionNotice && (
          <div className="bg-bg-base border border-primary text-primary p-4 rounded-lg mb-6 text-xs flex items-center gap-2.5 shadow-sm">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span className="font-semibold">{actionNotice.msg}</span>
          </div>
        )}
        {actionError && (
          <div className="bg-red-50 border border-accent text-accent p-4 rounded-lg mb-6 text-xs flex items-center gap-2.5 shadow-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="font-semibold">{actionError}</span>
          </div>
        )}

        {/* Master-Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Panel */}
          <div className="lg:col-span-4 bg-white border border-border rounded-lg p-3.5 shadow-sm flex flex-col max-h-[calc(100vh-6rem)] sticky top-4 overflow-hidden">
            <div className="text-[11px] font-bold text-text-secondary uppercase tracking-wider px-1 py-1 pb-2.5 mb-1 border-b border-border flex items-center justify-between shrink-0">
              <span>Antrean Tugas</span>
              <span className="font-mono text-primary font-bold">({reports.length})</span>
            </div>
            <div data-lenis-prevent className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1 pt-1">
              {loading ? (
                <div className="p-8 text-center text-xs text-text-secondary">Memuat data...</div>
              ) : reports.length === 0 ? (
                <div className="p-8 text-center text-xs text-text-secondary">Tidak ada laporan yang ditugaskan saat ini.</div>
              ) : (
                reports.map((rpt) => (
                  <div
                    key={rpt.id}
                    onClick={() => handleSelectReport(rpt)}
                    className={`border-l-4 ${getUrgencyBorderColor(rpt.skor_urgensi)} border border-border p-3 rounded cursor-pointer transition-all ${
                      selectedReport?.id === rpt.id ? 'bg-bg-base ring-1 ring-primary' : 'bg-white hover:bg-bg-base'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-mono text-[11px] font-bold text-text-primary shrink-0">{rpt.id}</span>
                      <div className="shrink-0 scale-95 origin-right">
                        <UrgencyBadge level={rpt.skor_urgensi} />
                      </div>
                    </div>
                    <div className="text-xs font-semibold text-text-primary line-clamp-2 mb-1 break-words">
                      {rpt.ringkasan || rpt.deskripsi_masked}
                    </div>
                    <div className="text-[10px] text-text-secondary">
                      Status: <span className="font-bold text-primary">{rpt.status}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-8">
            {selectedReport ? (
              <div className="space-y-6">
                <div className="bg-white border border-border rounded-lg p-5 shadow-sm">
                  <div className="flex flex-col justify-between items-start mb-4 pb-4 border-b border-border">
                    <div className="flex w-full justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-sm font-bold text-primary">Tiket #{selectedReport.id}</span>
                          <span className="bg-slate-100 text-primary text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-border">
                            Status: {selectedReport.status}
                          </span>
                        </div>
                        <h2 className="font-serif font-bold text-lg text-text-primary">
                          {selectedReport.kategori} · {selectedReport.lokasi_alamat}
                        </h2>
                      </div>
                      <UrgencyBadge level={selectedReport.skor_urgensi} />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    {selectedReport.status === 'Assigned' && (
                      <button
                        onClick={handleProcessReport}
                        className="bg-bg-base hover:bg-border text-text-primary border border-border px-4 py-2.5 rounded text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <RefreshCw className="w-4 h-4 text-primary" />
                        <span>Tandai Sedang Diproses</span>
                      </button>
                    )}
                    <button
                      onClick={() => setShowCloseModal(true)}
                      className="bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Tandai Selesai / Tutup Laporan</span>
                    </button>
                  </div>
                </div>

                <div className="bg-white border border-border rounded-lg p-5 shadow-sm space-y-3">
                  <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">Deskripsi Laporan</h3>
                  <div className="bg-bg-base p-4 rounded border border-border text-xs text-text-primary leading-relaxed whitespace-pre-wrap font-mono">
                    {selectedReport.deskripsi_masked}
                  </div>
                </div>

                {selectedReport.lampiran_path && (
                  <div className="bg-white border border-border rounded-lg p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
                        <Image className="w-4 h-4 text-primary" />
                        Lampiran Foto / Bukti
                      </h3>
                      <a href={selectedReport.lampiran_path} target="_blank" rel="noreferrer" className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
                        <ExternalLink className="w-3.5 h-3.5" />Buka Ukuran Penuh
                      </a>
                    </div>
                    <div className="bg-bg-base p-4 rounded border border-border">
                      <div className="w-full h-48 bg-slate-200 rounded overflow-hidden border border-border flex items-center justify-center">
                        <img src={selectedReport.lampiran_path} alt="Lampiran" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* AI Justification (Read-Only) */}
                <AIJustificationCard report={selectedReport} />

              </div>
            ) : (
              <div className="bg-white border border-border rounded-lg p-12 text-center text-xs text-text-secondary">
                Pilih laporan untuk meninjau detail dan menyelesaikan tugas.
              </div>
            )}
          </div>
        </div>

        {/* Modal Tutup Laporan */}
        {showCloseModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-border rounded-lg max-w-md w-full p-6 shadow-xl space-y-4">
              <h3 className="font-serif font-bold text-lg text-text-primary pb-2 border-b border-border">
                Penyelesaian Laporan
              </h3>
              <form onSubmit={submitCloseReport} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-2">
                    Catatan Penyelesaian (Publik)
                  </label>
                  <p className="text-[10px] text-text-secondary mb-2">
                    Berikan catatan penyelesaian, tindakan yang telah diambil, atau alasan penutupan tiket ini. Catatan ini akan dicatat dalam Audit Log.
                  </p>
                  <textarea
                    rows={4}
                    value={closeNote}
                    onChange={(e) => setCloseNote(e.target.value)}
                    placeholder="Misal: Jalan berlubang di lokasi tersebut telah diperbaiki pada tanggal..."
                    className="w-full bg-bg-base border border-border rounded p-3 text-xs text-text-primary focus:outline-none focus:border-primary transition-colors"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setShowCloseModal(false)}
                    className="px-4 py-2 bg-bg-base text-xs font-bold rounded hover:bg-border transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-white text-xs font-bold rounded hover:bg-primary-dark flex items-center gap-1.5 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Konfirmasi Selesai
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
