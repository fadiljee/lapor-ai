import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuickFillPreset } from '../../components/report/QuickFillPreset';
import { api } from '../../services/api';
import { ArrowLeft, ArrowRight, CheckCircle2, MapPin, Upload, ShieldAlert, Loader2, Bot } from 'lucide-react';

/* ── Resi step indicator strips ──────────────────────────────── */
const STEPS = [
  { num: '01', label: 'Kategori & Deskripsi' },
  { num: '02', label: 'Lokasi & Lampiran' },
  { num: '03', label: 'Identitas Pelapor' },
  { num: '04', label: 'Tinjau & Kirim' },
];

/* ── Kategori laporan per FR-1.1 ─────────────────────────────── */
const KATEGORI = [
  { value: 'Infrastruktur',      label: 'Infrastruktur (Jalan, Jembatan, Kabel, Lampu)' },
  { value: 'Keamanan/Bencana',   label: 'Keamanan / Bencana (Kebakaran, Banjir, Kecelakaan)' },
  { value: 'Layanan Publik',     label: 'Layanan Publik (Administrasi, Kantor Dinas)' },
  { value: 'Lingkungan',         label: 'Lingkungan (Sampah, Limbah, Pencemaran)' },
  { value: 'Kesehatan',          label: 'Kesehatan (Puskesmas, RS, Sanitasi)' },
  { value: 'Pendidikan',         label: 'Pendidikan (Fasilitas Sekolah)' },
  { value: 'Ketertiban Umum',    label: 'Ketertiban Umum (Satpol PP)' },
  { value: 'Lainnya',            label: 'Lainnya' },
];

export function SubmitReportPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    kategori: 'Infrastruktur',
    deskripsi: '',
    lokasi_alamat: '',
    lokasi_lat: -2.1316,
    lokasi_lng: 106.1169,
    is_anonim: false,
    email: '',
    lampiran_path: '',
    preset_type: ''
  });

  const handlePresetSelect = (presetData) => {
    setFormData((prev) => ({ ...prev, ...presetData }));
    setError('');
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.deskripsi.trim()) {
        setError('Deskripsi pengaduan wajib diisi.');
        return;
      }
      if (formData.deskripsi.length > 2000) {
        setError('Deskripsi tidak boleh melebihi 2.000 karakter.');
        return;
      }
    }
    if (step === 3) {
      if (!formData.is_anonim && !formData.email.trim()) {
        setError('Email wajib diisi jika melapor dengan identitas.');
        return;
      }
    }
    setError('');
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const handlePrevStep = () => {
    setError('');
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.createReport(formData);
      if (!formData.is_anonim && formData.email) {
        navigate('/verifikasi-email', { state: { email: formData.email, ticketId: res.id } });
      } else {
        navigate('/lapor/berhasil', { state: { report: res } });
      }
    } catch (err) {
      setError(err.message || 'Gagal mengirim laporan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const labelClass = 'block text-[11px] font-bold text-[#1A1D1F] uppercase tracking-wider mb-2';
  /* Field utama (Deskripsi) pakai border lebih tegas saat fokus */
  const inputPrimary = 'w-full bg-[#F4F3EE] border border-[#D8D4C9] rounded px-3 py-2.5 text-sm text-[#1A1D1F] focus:outline-none focus:border-[1.5px] focus:border-[#1A1D1F] transition-colors placeholder:text-[#6B6862]';
  /* Field opsional tetap --line tipis */
  const inputSecondary = 'w-full bg-[#F4F3EE] border border-[#D8D4C9] rounded px-3 py-2.5 text-sm text-[#1A1D1F] focus:outline-none focus:border-[#1F3A52] transition-colors placeholder:text-[#6B6862]';

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#1A1D1F] mb-1">
          Formulir Pengaduan Warga
        </h1>
        <p className="text-xs text-[#6B6862]">
          Isi rincian masalah Anda. Laporan akan dianalisis secara otomatis oleh AI Triage untuk menentukan tingkat urgensi.
        </p>
      </div>

      {/* ── Resi Step Indicator ─────────────────────────────────── */}
      <div className="bg-[#FFFFFF] border border-[#D8D4C9] rounded-lg overflow-hidden mb-6">
        <div className="grid grid-cols-4 divide-x divide-dashed divide-[#D8D4C9]">
          {STEPS.map((s) => (
            <div
              key={s.num}
              className={`text-center py-3 px-2 transition-colors ${
                step === parseInt(s.num)
                  ? 'bg-[#1F3A52] text-white'
                  : step > parseInt(s.num)
                  ? 'bg-[#E7ECEF] text-[#1F3A52]'
                  : 'bg-transparent text-[#6B6862]'
              }`}
            >
              <div className={`font-mono-ticket text-lg font-bold leading-none mb-0.5 ${
                step === parseInt(s.num) ? 'text-white' : step > parseInt(s.num) ? 'text-[#1F3A52]' : 'text-[#D8D4C9]'
              }`}>
                {step > parseInt(s.num) ? '✓' : s.num}
              </div>
              <div className="text-[10px] font-semibold hidden sm:block leading-tight">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Fill Preset (FR-1.9 Demo Mode) */}
      {step === 1 && <QuickFillPreset onSelectPreset={handlePresetSelect} />}

      {/* Error Alert */}
      {error && (
        <div className="bg-[#FAEAEA] border-l-4 border-[#A32A21] p-3 rounded text-xs text-[#A32A21] mb-6 flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* ── Form Content ─────────────────────────────────────────── */}
      <form onSubmit={handleSubmit} className="bg-[#FFFFFF] border border-[#D8D4C9] rounded-lg p-6">

        {/* STEP 1: Kategori & Deskripsi */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <label className={labelClass}>Kategori Masalah</label>
              <select
                value={formData.kategori}
                onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                className={inputSecondary}
              >
                {KATEGORI.map((k) => (
                  <option key={k.value} value={k.value}>{k.label}</option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between items-end mb-2">
                <label className={`${labelClass} mb-0`}>
                  Deskripsi Kejadian / Masalah <span className="text-[#A32A21]">*</span>
                </label>
                <span className={`text-[11px] font-mono-ticket ${formData.deskripsi.length > 2000 ? 'text-[#A32A21] font-bold' : 'text-[#6B6862]'}`}>
                  {formData.deskripsi.length}/2000
                </span>
              </div>
              {/* Primary field — border lebih tegas saat fokus */}
              <textarea
                rows={6}
                value={formData.deskripsi}
                onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                placeholder="Ceritakan kejadian masalah secara jelas. Dapat ditulis dalam Bahasa Indonesia atau Bahasa Bangka..."
                className="w-full bg-[#F4F3EE] border-[1.5px] border-[#D8D4C9] rounded p-3 text-sm text-[#1A1D1F] focus:outline-none focus:border-[#1A1D1F] transition-colors placeholder:text-[#6B6862] resize-none"
              />
              {/* AI hint indicator */}
              <div className="flex items-center gap-1.5 mt-2">
                <Bot className="w-3.5 h-3.5 text-[#1F3A52] shrink-0" />
                <p className="text-[11px] text-[#6B6862]">
                  AI akan menyarankan kategori &amp; dinas tujuan berdasarkan isi laporan ini
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Lokasi & Lampiran */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <label className={labelClass}>Lokasi Kejadian (Alamat / Patokan)</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-[#6B6862] absolute left-3 top-3.5" />
                <input
                  type="text"
                  value={formData.lokasi_alamat}
                  onChange={(e) => setFormData({ ...formData, lokasi_alamat: e.target.value })}
                  placeholder="Contoh: Jl. Merdeka No. 12, di depan SD 01..."
                  className={`${inputSecondary} pl-9`}
                />
              </div>
              <p className="text-[11px] text-[#6B6862] mt-1.5">Opsional — membantu petugas dinas menentukan lokasi kejadian</p>
            </div>

            <div>
              <label className={labelClass}>Lampiran Foto / Bukti (Maks 10 MB)</label>
              <div className="border-2 border-dashed border-[#D8D4C9] bg-[#F4F3EE] p-8 rounded text-center cursor-pointer hover:border-[#1F3A52] transition-colors">
                <Upload className="w-8 h-8 text-[#6B6862] mx-auto mb-2" />
                <p className="text-sm font-semibold text-[#1A1D1F]">Unggah Foto atau Dokumen Pendukung</p>
                <p className="text-[11px] text-[#6B6862] mt-1">Format PNG, JPG, atau PDF — Opsional</p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Identitas Pelapor */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <label className={labelClass}>Pilih Mode Pelaporan Identitas</label>

              <div className="space-y-3">
                <label className={`block border rounded-lg p-4 cursor-pointer transition-all ${
                  !formData.is_anonim
                    ? 'border-[#1F3A52] bg-[#E7ECEF]'
                    : 'border-[#D8D4C9] bg-[#F4F3EE] hover:border-[#1F3A52]'
                }`}>
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="identity_mode"
                      checked={!formData.is_anonim}
                      onChange={() => setFormData({ ...formData, is_anonim: false })}
                      className="mt-1 accent-[#1F3A52]"
                    />
                    <div>
                      <div className="text-sm font-bold text-[#1A1D1F]">Melapor Dengan Identitas Email</div>
                      <p className="text-[11px] text-[#6B6862] mt-0.5">
                        Anda akan menerima kode verifikasi OTP dan notifikasi pergerakan status laporan. <span className="font-semibold text-[#1F3A52]">Direkomendasikan.</span>
                      </p>
                    </div>
                  </div>
                </label>

                <label className={`block border rounded-lg p-4 cursor-pointer transition-all ${
                  formData.is_anonim
                    ? 'border-[#1F3A52] bg-[#E7ECEF]'
                    : 'border-[#D8D4C9] bg-[#F4F3EE] hover:border-[#1F3A52]'
                }`}>
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="identity_mode"
                      checked={formData.is_anonim}
                      onChange={() => setFormData({ ...formData, is_anonim: true, email: '' })}
                      className="mt-1 accent-[#1F3A52]"
                    />
                    <div>
                      <div className="text-sm font-bold text-[#1A1D1F]">Mode Anonim</div>
                      <p className="text-[11px] text-[#6B6862] mt-0.5">
                        Identitas email tidak dicatat. Simpan nomor tiket secara manual untuk melacak status — tidak ada notifikasi personal.
                      </p>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {!formData.is_anonim && (
              <div>
                <label className={labelClass}>
                  Alamat Email Pelapor <span className="text-[#A32A21]">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email.warga@example.com"
                  className={inputPrimary}
                />
                <p className="text-[11px] text-[#6B6862] mt-1.5">
                  Digunakan untuk kode OTP verifikasi saja. Tidak ditampilkan ke publik dan disamarkan sebelum diproses AI.
                </p>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: Tinjau & Kirim */}
        {step === 4 && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-[#1A1D1F] uppercase tracking-wider mb-3">
              Ringkasan Data Pengaduan
            </h3>

            <div className="bg-[#F4F3EE] border border-[#D8D4C9] rounded-lg p-4 text-sm space-y-3">
              <div className="flex gap-2">
                <span className="text-[#6B6862] w-24 shrink-0 text-xs">Kategori:</span>
                <span className="font-bold text-[#1F3A52]">{formData.kategori}</span>
              </div>
              <div className="border-t border-[#D8D4C9] pt-3">
                <span className="text-[#6B6862] block text-xs mb-1">Deskripsi Masalah:</span>
                <p className="text-[#1A1D1F] text-sm leading-relaxed">{formData.deskripsi}</p>
              </div>
              <div className="border-t border-[#D8D4C9] pt-3 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[#6B6862] block">Lokasi:</span>
                  <span className="text-[#1A1D1F] font-medium">{formData.lokasi_alamat || 'Tidak ditentukan'}</span>
                </div>
                <div>
                  <span className="text-[#6B6862] block">Mode Identitas:</span>
                  <span className="font-semibold text-[#1A1D1F]">
                    {formData.is_anonim ? 'Mode Anonim' : `Non-Anonim (${formData.email})`}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 bg-[#E7ECEF] border border-[#D8D4C9] rounded p-3 text-[11px] text-[#1F3A52]">
              <Bot className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Dengan mengklik Kirim, laporan Anda akan diteruskan ke pipeline AI Triage untuk evaluasi skoring urgensi. Setiap rekomendasi AI harus dikonfirmasi petugas sebelum menjadi keputusan final.</span>
            </div>
          </div>
        )}

        {/* ── Navigation Buttons ─────────────────────────────────── */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-[#D8D4C9]">
          {step > 1 ? (
            <button
              type="button"
              onClick={handlePrevStep}
              className="bg-[#F4F3EE] hover:bg-[#D8D4C9] text-[#1A1D1F] border border-[#D8D4C9] px-4 py-2.5 rounded text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </button>
          ) : <div />}

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="bg-[#1F3A52] hover:bg-[#162C3E] text-white px-5 py-2.5 rounded text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              Lanjut
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="bg-[#A32A21] hover:bg-[#7A1F19] text-white px-6 py-2.5 rounded text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Memproses AI Triage...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Kirim Laporan Pengaduan
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
