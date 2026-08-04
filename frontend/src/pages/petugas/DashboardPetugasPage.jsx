import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/dashboard/Sidebar';
import { AIJustificationCard } from '../../components/dashboard/AIJustificationCard';
import { UrgencyBadge } from '../../components/common/UrgencyBadge';
import { api } from '../../services/api';
import { ListFilter, Search, CheckCircle2, Edit3, XCircle, Clock, MapPin, Building, RefreshCw } from 'lucide-react';

export function DashboardPetugasPage() {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [urgencyFilter, setUrgencyFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [overrideModal, setOverrideModal] = useState(false);
  const [editForm, setEditForm] = useState({ kategori: '', skor_urgensi: '', dinas_tujuan: '', catatan: '' });

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await api.getReports({
        urgensi: urgencyFilter || undefined,
        search: searchQuery || undefined
      });
      setReports(data);
      if (data.length > 0 && !selectedReport) {
        setSelectedReport(data[0]);
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

  const handleSelectReport = (rpt) => {
    setSelectedReport(rpt);
  };

  const handleApprove = async () => {
    if (!selectedReport) return;
    try {
      const updated = await api.overrideReport(selectedReport.id, {
        status: 'Assigned',
        catatan: 'Disetujui oleh Petugas Verifikator'
      });
      setSelectedReport(updated);
      loadReports();
    } catch (err) {
      alert('Gagal memperbarui status laporan');
    }
  };

  const handleMarkIrrelevant = async () => {
    if (!selectedReport) return;
    try {
      const updated = await api.overrideReport(selectedReport.id, {
        status: 'Closed',
        catatan: 'Ditandai Tidak Relevan / Spam oleh Petugas'
      });
      setSelectedReport(updated);
      loadReports();
    } catch (err) {
      alert('Gagal memperbarui status laporan');
    }
  };

  const openOverrideDialog = () => {
    if (!selectedReport) return;
    setEditForm({
      kategori: selectedReport.kategori,
      skor_urgensi: selectedReport.skor_urgensi,
      dinas_tujuan: selectedReport.dinas_tujuan,
      catatan: ''
    });
    setOverrideModal(true);
  };

  const handleSaveOverride = async (e) => {
    e.preventDefault();
    try {
      const updated = await api.overrideReport(selectedReport.id, {
        ...editForm,
        status: 'Assigned'
      });
      setSelectedReport(updated);
      setOverrideModal(false);
      loadReports();
    } catch (err) {
      alert('Gagal memperbarui laporan');
    }
  };

  const getUrgencyBorderColor = (level) => {
    switch ((level || '').toUpperCase()) {
      case 'KRITIS': return 'border-l-[#B3261E]';
      case 'TINGGI': return 'border-l-[#94570A]';
      case 'SEDANG': return 'border-l-[#3E5C78]';
      default: return 'border-l-[#4B564D]';
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 bg-[#F3F4EF] overflow-x-hidden">
        {/* Top Filter Bar */}
        <div className="bg-white border border-[#D8DAD2] p-4 rounded-lg mb-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ListFilter className="w-5 h-5 text-[#1F4E4B]" />
            <h1 className="font-serif font-bold text-lg text-[#1A2420]">
              Antrean Triage Pengaduan Warga
            </h1>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className="bg-[#F3F4EF] border border-[#D8DAD2] rounded px-3 py-1.5 text-xs font-semibold text-[#1A2420]"
            >
              <option value="">Semua Urgensi</option>
              <option value="Kritis">Kritis</option>
              <option value="Tinggi">Tinggi</option>
              <option value="Sedang">Sedang</option>
              <option value="Rendah">Rendah</option>
            </select>

            <button
              onClick={loadReports}
              className="p-2 bg-[#F3F4EF] hover:bg-[#D8DAD2] rounded border border-[#D8DAD2] text-[#1F4E4B]"
              title="Refresh Antrean"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Master-Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Master List (4 Cols) */}
          <div className="lg:col-span-4 bg-white border border-[#D8DAD2] rounded-lg p-3 shadow-sm space-y-2 max-h-[700px] overflow-y-auto">
            <div className="text-[11px] font-bold text-[#5B6357] uppercase tracking-wider px-2 py-1">
              Daftar Antrean ({reports.length} Laporan)
            </div>

            {loading ? (
              <div className="p-8 text-center text-xs text-[#5B6357]">Memuat antrean...</div>
            ) : reports.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#5B6357]">Tidak ada laporan dalam antrean.</div>
            ) : (
              reports.map((rpt) => (
                <div
                  key={rpt.id}
                  onClick={() => handleSelectReport(rpt)}
                  className={`border-l-4 ${getUrgencyBorderColor(rpt.skor_urgensi)} border border-[#D8DAD2] p-3 rounded cursor-pointer transition-all ${
                    selectedReport?.id === rpt.id ? 'bg-[#EEF1EC] ring-1 ring-[#1F4E4B]' : 'bg-white hover:bg-[#F3F4EF]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[11px] font-bold text-[#1A2420]">{rpt.id}</span>
                    <UrgencyBadge level={rpt.skor_urgensi} />
                  </div>
                  <div className="text-xs font-semibold text-[#1A2420] line-clamp-1 mb-1">
                    {rpt.ringkasan || rpt.deskripsi_masked}
                  </div>
                  <div className="text-[10px] text-[#5B6357] flex items-center justify-between">
                    <span>{rpt.dinas_tujuan}</span>
                    <span className="font-mono">{rpt.created_at.split(' ')[1] || 'Baru'}</span>
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
                <div className="bg-white border border-[#D8DAD2] rounded-lg p-5 shadow-sm">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 pb-4 border-b border-[#D8DAD2]">
                    <div>
                      <div className="font-mono text-sm font-bold text-[#1F4E4B] mb-1">
                        Tiket #{selectedReport.id}
                      </div>
                      <h2 className="font-serif font-bold text-lg text-[#1A2420]">
                        {selectedReport.kategori} · {selectedReport.lokasi_alamat}
                      </h2>
                    </div>
                    <UrgencyBadge level={selectedReport.skor_urgensi} />
                  </div>

                  {/* Officer Actions */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={handleApprove}
                      className="bg-[#1F4E4B] hover:bg-[#163A38] text-white px-4 py-2 rounded text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Setujui Rekomendasi AI</span>
                    </button>

                    <button
                      onClick={openOverrideDialog}
                      className="bg-[#F3F4EF] hover:bg-[#D8DAD2] text-[#1A2420] border border-[#D8DAD2] px-4 py-2 rounded text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Edit3 className="w-4 h-4 text-[#1F4E4B]" />
                      <span>Koreksi Kategori / Urgensi</span>
                    </button>

                    <button
                      onClick={handleMarkIrrelevant}
                      className="bg-[#FBEAEA] hover:bg-[#B3261E] text-[#B3261E] hover:text-white border border-[#B3261E] px-4 py-2 rounded text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Tandai Tidak Relevan</span>
                    </button>
                  </div>
                </div>

                {/* Responsible AI Panel Component */}
                <AIJustificationCard report={selectedReport} />

                {/* Report Description Detail */}
                <div className="bg-white border border-[#D8DAD2] rounded-lg p-5 shadow-sm space-y-3">
                  <h3 className="text-xs font-bold text-[#1A2420] uppercase tracking-wider">
                    Deskripsi Lengkap Laporan Warga (PII Masked)
                  </h3>
                  <div className="bg-[#F3F4EF] p-4 rounded border border-[#D8DAD2] text-xs text-[#1A2420] leading-relaxed whitespace-pre-wrap">
                    {selectedReport.deskripsi_masked}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-[#D8DAD2] rounded-lg p-12 text-center text-xs text-[#5B6357]">
                Pilih salah satu laporan dari antrean sebelah kiri untuk melihat detail analisis AI.
              </div>
            )}
          </div>
        </div>

        {/* Override Modal Dialog */}
        {overrideModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-[#D8DAD2] rounded-lg max-w-md w-full p-6 shadow-lg">
              <h3 className="font-serif font-bold text-lg text-[#1A2420] mb-4">
                Koreksi Hasil AI (Human Override)
              </h3>
              <form onSubmit={handleSaveOverride} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#1A2420] uppercase tracking-wider mb-1">
                    Kategori Baru
                  </label>
                  <select
                    value={editForm.kategori}
                    onChange={(e) => setEditForm({ ...editForm, kategori: e.target.value })}
                    className="w-full bg-[#F3F4EF] border border-[#D8DAD2] rounded px-3 py-2 text-xs"
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
                  <label className="block text-xs font-bold text-[#1A2420] uppercase tracking-wider mb-1">
                    Skor Urgensi Baru
                  </label>
                  <select
                    value={editForm.skor_urgensi}
                    onChange={(e) => setEditForm({ ...editForm, skor_urgensi: e.target.value })}
                    className="w-full bg-[#F3F4EF] border border-[#D8DAD2] rounded px-3 py-2 text-xs"
                  >
                    <option value="Kritis">Kritis</option>
                    <option value="Tinggi">Tinggi</option>
                    <option value="Sedang">Sedang</option>
                    <option value="Rendah">Rendah</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A2420] uppercase tracking-wider mb-1">
                    Catatan Alasan Koreksi
                  </label>
                  <textarea
                    rows={3}
                    value={editForm.catatan}
                    onChange={(e) => setEditForm({ ...editForm, catatan: e.target.value })}
                    placeholder="Alasan koreksi petugas untuk catatan audit log..."
                    className="w-full bg-[#F3F4EF] border border-[#D8DAD2] rounded p-2 text-xs"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setOverrideModal(false)}
                    className="px-4 py-2 bg-[#F3F4EF] text-xs font-bold rounded"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#1F4E4B] text-white text-xs font-bold rounded"
                  >
                    Simpan Perubahan
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
