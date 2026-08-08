import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/dashboard/Sidebar';
import { AIJustificationCard } from '../../components/dashboard/AIJustificationCard';
import { UrgencyBadge } from '../../components/common/UrgencyBadge';
import { api } from '../../services/api';
import { ListFilter, Search, CheckCircle2, Edit3, XCircle, Clock, MapPin, Building, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';

const DEPARTMENT_MAP = {
  'Infrastruktur': 'Dinas Pekerjaan Umum dan Penataan Ruang (PUPR)',
  'Keamanan/Bencana': 'Badan Penanggulangan Bencana Daerah (BPBD)',
  'Layanan Publik': 'Dinas Penanaman Modal dan Pelayanan Terpadu Satu Pintu (DPMPTSP)',
  'Lingkungan': 'Dinas Lingkungan Hidup (DLH)',
  'Kesehatan': 'Dinas Kesehatan (Dinkes)',
  'Pendidikan': 'Dinas Pendidikan (Disdik)',
  'Ketertiban Umum': 'Satuan Polisi Pamong Praja (Satpol PP)',
  'Lainnya': 'Disposisi Manual (Antrean Admin)'
};

export function DashboardPetugasPage() {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [urgencyFilter, setUrgencyFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [overrideModal, setOverrideModal] = useState(false);
  const [actionNotice, setActionNotice] = useState(null);
  const [actionError, setActionError] = useState('');

  const [editForm, setEditForm] = useState({
    kategori: '',
    skor_urgensi: '',
    dinas_tujuan: '',
    catatan: ''
  });

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await api.getReports({
        urgensi: urgencyFilter || undefined,
        search: searchQuery || undefined
      });
      setReports(data);
      if (data.length > 0) {
        // If current selectedReport is in data, update it. Otherwise select first.
        const found = data.find((r) => r.id === selectedReport?.id);
        setSelectedReport(found || data[0]);
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
  }, [urgencyFilter]);

  // Real-time search filtering across ticket ID, description, category, department, location
  const filteredReports = reports.filter((rpt) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (rpt.id && rpt.id.toLowerCase().includes(q)) ||
      (rpt.deskripsi_masked && rpt.deskripsi_masked.toLowerCase().includes(q)) ||
      (rpt.ringkasan && rpt.ringkasan.toLowerCase().includes(q)) ||
      (rpt.kategori && rpt.kategori.toLowerCase().includes(q)) ||
      (rpt.dinas_tujuan && rpt.dinas_tujuan.toLowerCase().includes(q)) ||
      (rpt.lokasi_alamat && rpt.lokasi_alamat.toLowerCase().includes(q))
    );
  });

  const handleSelectReport = (rpt) => {
    setSelectedReport(rpt);
    setActionNotice(null);
    setActionError('');
  };

  /* ──────────────────────────────────────────────────────────────
     ✅ FIX 1: Setuju Rekomendasi AI (Approve AI Recommendation)
     ────────────────────────────────────────────────────────────── */
  const handleApprove = async () => {
    if (!selectedReport) return;
    setActionNotice(null);
    setActionError('');

    try {
      const updated = await api.overrideReport(selectedReport.id, {
        status: 'Assigned',
        dinas_tujuan: selectedReport.dinas_tujuan,
        catatan: `Disetujui oleh Petugas Verifikator: Rekomendasi AI (${selectedReport.kategori} -> ${selectedReport.dinas_tujuan}) valid.`
      });
      setSelectedReport(updated);
      setActionNotice({
        type: 'success',
        msg: `✓ Rekomendasi AI untuk Tiket #${selectedReport.id} berhasil disetujui! Status laporan diubah menjadi 'Assigned' (${updated.dinas_tujuan}).`
      });
      loadReports();
    } catch (err) {
      console.error('Error approving AI recommendation:', err);
      setActionError(err.message || 'Gagal menyetujui rekomendasi AI.');
    }
  };

  /* ──────────────────────────────────────────────────────────────
     ✅ FIX 2: Tandai Tidak Relevan (Mark Irrelevant / Closed)
     ────────────────────────────────────────────────────────────── */
  const handleMarkIrrelevant = async () => {
    if (!selectedReport) return;
    if (!window.confirm(`Konfirmasi: Tandai Tiket #${selectedReport.id} sebagai Tidak Relevan / Spam?`)) return;

    setActionNotice(null);
    setActionError('');

    try {
      const updated = await api.overrideReport(selectedReport.id, {
        status: 'Closed',
        catatan: 'Ditandai Tidak Relevan / Informasi Kurang oleh Petugas Verifikator.'
      });
      setSelectedReport(updated);
      setActionNotice({
        type: 'warning',
        msg: `✓ Tiket #${selectedReport.id} berhasil ditandai 'Tidak Relevan' dan statusnya ditutup.`
      });
      loadReports();
    } catch (err) {
      console.error('Error marking report as irrelevant:', err);
      setActionError(err.message || 'Gagal menandai laporan sebagai tidak relevan.');
    }
  };

  /* ──────────────────────────────────────────────────────────────
     ✅ FIX 3: Koreksi Kategori / Urgensi (Human Override Modal)
     ────────────────────────────────────────────────────────────── */
  const openOverrideDialog = () => {
    if (!selectedReport) return;
    setActionNotice(null);
    setActionError('');

    setEditForm({
      kategori: selectedReport.kategori || 'Infrastruktur',
      skor_urgensi: selectedReport.skor_urgensi || 'Sedang',
      dinas_tujuan: selectedReport.dinas_tujuan || DEPARTMENT_MAP[selectedReport.kategori] || 'Disposisi Manual (Antrean Admin)',
      catatan: ''
    });
    setOverrideModal(true);
  };

  const handleKategoriChange = (newKategori) => {
    const autoDept = DEPARTMENT_MAP[newKategori] || 'Disposisi Manual (Antrean Admin)';
    setEditForm((prev) => ({
      ...prev,
      kategori: newKategori,
      dinas_tujuan: autoDept
    }));
  };

  const handleSaveOverride = async (e) => {
    e.preventDefault();
    setActionNotice(null);
    setActionError('');

    try {
      const updated = await api.overrideReport(selectedReport.id, {
        kategori: editForm.kategori,
        skor_urgensi: editForm.skor_urgensi,
        dinas_tujuan: editForm.dinas_tujuan,
        status: 'Assigned',
        catatan: editForm.catatan.trim() || `Koreksi Petugas: Kategori diubah ke ${editForm.kategori}, Urgensi ke ${editForm.skor_urgensi}`
      });
      setSelectedReport(updated);
      setOverrideModal(false);
      setActionNotice({
        type: 'success',
        msg: `✓ Kategori & Urgensi Tiket #${selectedReport.id} berhasil dikoreksi! Terdisposisi ke ${updated.dinas_tujuan}.`
      });
      loadReports();
    } catch (err) {
      console.error('Error saving human override:', err);
      alert(err.message || 'Gagal menyimpan koreksi laporan');
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
        {/* Top Filter Bar */}
        <div className="bg-white border border-border p-4 rounded-lg mb-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ListFilter className="w-5 h-5 text-primary" />
            <h1 className="font-serif font-bold text-lg text-text-primary">
              Antrean Triage Pengaduan Warga
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            {/* Real-time Search Input Box */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-text-secondary absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari tiket, deskripsi, dinas..."
                className="w-full bg-bg-base border border-border rounded pl-9 pr-8 py-1.5 text-xs text-text-primary focus:outline-none focus:border-primary transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-text-secondary hover:text-text-primary"
                  title="Bersihkan pencarian"
                >
                  <XCircle className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className="bg-bg-base border border-border rounded px-3 py-1.5 text-xs font-semibold text-text-primary w-full sm:w-auto"
            >
              <option value="">Semua Urgensi</option>
              <option value="Kritis">Kritis</option>
              <option value="Tinggi">Tinggi</option>
              <option value="Sedang">Sedang</option>
              <option value="Rendah">Rendah</option>
            </select>

            <button
              onClick={loadReports}
              className="p-2 bg-bg-base hover:bg-border rounded border border-border text-primary shrink-0"
              title="Refresh Antrean"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Global Action Notices */}
        {actionNotice && (
          <div className={`p-4 rounded-lg mb-6 border text-xs flex items-center gap-2.5 shadow-sm ${
            actionNotice.type === 'warning'
              ? 'bg-amber-50 border-text-amber-700 text-text-amber-700'
              : 'bg-bg-base border-primary text-primary'
          }`}>
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

        {/* Master-Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Master List (4 Cols) */}
          <div className="lg:col-span-4 bg-white border border-border rounded-lg p-3 shadow-sm space-y-2 max-h-[700px] overflow-y-auto">
            <div className="text-[11px] font-bold text-text-secondary uppercase tracking-wider px-2 py-1 flex items-center justify-between">
              <span>Daftar Antrean</span>
              <span className="font-mono text-primary font-bold">({filteredReports.length} Laporan)</span>
            </div>

            {loading ? (
              <div className="p-8 text-center text-xs text-text-secondary">Memuat antrean...</div>
            ) : filteredReports.length === 0 ? (
              <div className="p-8 text-center text-xs text-text-secondary">
                {searchQuery ? 'Tidak ada laporan yang cocok dengan pencarian.' : 'Tidak ada laporan dalam antrean.'}
              </div>
            ) : (
              filteredReports.map((rpt) => (
                <div
                  key={rpt.id}
                  onClick={() => handleSelectReport(rpt)}
                  className={`border-l-4 ${getUrgencyBorderColor(rpt.skor_urgensi)} border border-border p-3 rounded cursor-pointer transition-all ${
                    selectedReport?.id === rpt.id ? 'bg-bg-base ring-1 ring-primary' : 'bg-white hover:bg-bg-base'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[11px] font-bold text-text-primary">{rpt.id}</span>
                    <UrgencyBadge level={rpt.skor_urgensi} />
                  </div>
                  <div className="text-xs font-semibold text-text-primary line-clamp-1 mb-1">
                    {rpt.ringkasan || rpt.deskripsi_masked}
                  </div>
                  <div className="text-[10px] text-text-secondary flex items-center justify-between">
                    <span className="truncate max-w-[140px]">{rpt.dinas_tujuan}</span>
                    <span className="font-mono text-[10px] font-semibold text-primary">
                      {rpt.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right Detail Panel (8 Cols) */}
          <div className="lg:col-span-8">
            {selectedReport ? (
              <div className="space-y-6">
                {/* Header Actions Card */}
                <div className="bg-white border border-border rounded-lg p-5 shadow-sm">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 pb-4 border-b border-border">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm font-bold text-primary">
                          Tiket #{selectedReport.id}
                        </span>
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

                  {/* Officer Actions Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={handleApprove}
                      className="bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Setujui Rekomendasi AI</span>
                    </button>

                    <button
                      type="button"
                      onClick={openOverrideDialog}
                      className="bg-bg-base hover:bg-border text-text-primary border border-border px-4 py-2.5 rounded text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Edit3 className="w-4 h-4 text-primary" />
                      <span>Koreksi Kategori / Urgensi</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleMarkIrrelevant}
                      className="bg-red-50 hover:bg-accent text-accent hover:text-white border border-accent px-4 py-2.5 rounded text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Tandai Tidak Relevan</span>
                    </button>
                  </div>
                </div>

                {/* Responsible AI Panel Component */}
                <AIJustificationCard report={selectedReport} />

                {/* Report Description Detail */}
                <div className="bg-white border border-border rounded-lg p-5 shadow-sm space-y-3">
                  <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">
                    Deskripsi Lengkap Laporan Warga (PII Masked)
                  </h3>
                  <div className="bg-bg-base p-4 rounded border border-border text-xs text-text-primary leading-relaxed whitespace-pre-wrap font-mono">
                    {selectedReport.deskripsi_masked}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-border rounded-lg p-12 text-center text-xs text-text-secondary">
                Pilih salah satu laporan dari antrean sebelah kiri untuk melihat detail analisis AI.
              </div>
            )}
          </div>
        </div>

        {/* Override Modal Dialog */}
        {overrideModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-border rounded-lg max-w-md w-full p-6 shadow-xl space-y-4">
              <h3 className="font-serif font-bold text-lg text-text-primary pb-2 border-b border-border">
                Koreksi Hasil AI (Human Override)
              </h3>
              <form onSubmit={handleSaveOverride} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
                    Kategori Baru
                  </label>
                  <select
                    value={editForm.kategori}
                    onChange={(e) => handleKategoriChange(e.target.value)}
                    className="w-full bg-bg-base border border-border rounded px-3 py-2 text-xs font-semibold text-text-primary"
                  >
                    <option value="Infrastruktur">Infrastruktur</option>
                    <option value="Keamanan/Bencana">Keamanan/Bencana</option>
                    <option value="Layanan Publik">Layanan Publik</option>
                    <option value="Lingkungan">Lingkungan</option>
                    <option value="Kesehatan">Kesehatan</option>
                    <option value="Pendidikan">Pendidikan</option>
                    <option value="Ketertiban Umum">Ketertiban Umum</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
                    Skor Urgensi Baru
                  </label>
                  <select
                    value={editForm.skor_urgensi}
                    onChange={(e) => setEditForm({ ...editForm, skor_urgensi: e.target.value })}
                    className="w-full bg-bg-base border border-border rounded px-3 py-2 text-xs font-semibold text-text-primary"
                  >
                    <option value="Kritis">Kritis</option>
                    <option value="Tinggi">Tinggi</option>
                    <option value="Sedang">Sedang</option>
                    <option value="Rendah">Rendah</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
                    Dinas Tujuan Disposisi
                  </label>
                  <input
                    type="text"
                    value={editForm.dinas_tujuan}
                    onChange={(e) => setEditForm({ ...editForm, dinas_tujuan: e.target.value })}
                    className="w-full bg-bg-base border border-border rounded px-3 py-2 text-xs text-text-primary"
                    placeholder="Contoh: Dinas PUPR"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
                    Catatan Alasan Koreksi Petugas
                  </label>
                  <textarea
                    rows={3}
                    value={editForm.catatan}
                    onChange={(e) => setEditForm({ ...editForm, catatan: e.target.value })}
                    placeholder="Alasan koreksi petugas untuk pencatatan audit log..."
                    className="w-full bg-bg-base border border-border rounded p-2 text-xs text-text-primary"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setOverrideModal(false)}
                    className="px-4 py-2 bg-bg-base text-xs font-bold rounded hover:bg-border"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-white text-xs font-bold rounded hover:bg-primary-dark"
                  >
                    Simpan Perubahan Koreksi
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
