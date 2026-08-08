import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../../components/dashboard/Sidebar';
import { QuickFillPreset } from '../../components/report/QuickFillPreset';
import { LocationPicker } from '../../components/report/LocationPicker';
import { api } from '../../services/api';
import { ArrowLeft, ArrowRight, CheckCircle2, Upload, ShieldAlert, Loader2, Bot, X, FileText } from 'lucide-react';

const STEPS = [
  { num: '01', label: 'Kategori & Deskripsi' },
  { num: '02', label: 'Lokasi & Lampiran' },
  { num: '03', label: 'Identitas Pelapor' },
  { num: '04', label: 'Tinjau & Kirim' },
];

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

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];

export function SubmitReportPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fileError, setFileError] = useState('');
  const [locationError, setLocationError] = useState('');
  const [attachment, setAttachment] = useState(null);

  const [formData, setFormData] = useState({
    pelapor_email: '',
    is_anonim: false,
    kategori: 'Infrastruktur',
    deskripsi: '',
    lokasi_alamat: '',
    lokasi_lat: null,
    lokasi_lng: null
  });

  const handlePresetSelect = (presetData) => {
    setFormData((prev) => ({ ...prev, ...presetData }));
    setError('');
  };

  /* ── File upload handlers ─────────────────────────────────────── */
  const handleFileSelect = (fileList) => {
    setFileError('');
    const file = fileList?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setFileError('Format tidak didukung. Gunakan PNG, JPG, atau PDF.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setFileError('Ukuran file melebihi 10 MB.');
      return;
    }

    const previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : null;
    setAttachment({ file, previewUrl });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files);
  };

  const handleRemoveAttachment = () => {
    if (attachment?.previewUrl) URL.revokeObjectURL(attachment.previewUrl);
    setAttachment(null);
    setFileError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.deskripsi.trim()) {
        setError('Deskripsi pengaduan wajib diisi.');
        return;
      }
      if (formData.deskripsi.trim().length < 20) {
        setError('Deskripsi minimal 20 karakter agar AI dapat menganalisis urgensi.');
        return;
      }
      if (formData.deskripsi.length > 2000) {
        setError('Deskripsi tidak boleh melebihi 2.000 karakter.');
        return;
      }
    }
    if (step === 2) {
      if (!formData.lokasi_alamat.trim()) {
        setError('Lokasi kejadian wajib diisi.');
        return;
      }
    }
    if (step === 3) {
      if (!formData.is_anonim && !formData.pelapor_email.trim()) {
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
    if (!formData.is_anonim && !formData.pelapor_email.trim()) {
      setError('Email pelapor wajib diisi (atau pilih opsi Anonim).');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        kategori: formData.kategori,
        deskripsi: formData.deskripsi,
        lokasi_alamat: formData.lokasi_alamat,
        lokasi_lat: formData.lokasi_lat,
        lokasi_lng: formData.lokasi_lng,
        is_anonim: formData.is_anonim,
        pelapor_email: formData.is_anonim ? null : formData.pelapor_email
      };

      const res = await api.submitReport(payload, attachment?.file);

      if (!formData.is_anonim && formData.pelapor_email) {
        navigate('/verifikasi-email', {
          state: {
            ticketId: res.id,
            email: formData.pelapor_email,
            isAnonim: false,
            urgensi: res.skor_urgensi,
            kategori: res.kategori,
            dinas: res.dinas_tujuan,
            verified: res.email_verified
          }
        });
      } else {
        navigate('/lapor/berhasil', { state: { report: res } });
      }
    } catch (err) {
      console.error("Detail Error Submit:", err);
      let errorMsg = 'Gagal mengirim laporan. Silakan coba lagi.';
      if (typeof err === 'string') {
        errorMsg = err;
      } else if (err?.message) {
        errorMsg = err.message;
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const labelClass = 'block text-[11px] font-bold text-text-primary uppercase tracking-wider mb-2';
  const inputPrimary = 'w-full bg-bg-base border border-border rounded px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-primary transition-colors placeholder:text-text-secondary';
  const inputSecondary = 'w-full bg-bg-base border border-border rounded px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-primary transition-colors placeholder:text-text-secondary';

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 bg-bg-base overflow-x-hidden">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-text-primary mb-1">
              Formulir Pengaduan Warga
            </h1>
            <p className="text-xs text-text-secondary">
              Isi rincian masalah Anda. Laporan akan dianalisis secara otomatis oleh AI Triage untuk menentukan tingkat urgensi.
            </p>
          </div>

          {/* Step Indicator */}
          <div className="bg-white border border-border rounded-lg overflow-hidden mb-6 shadow-sm">
            <div className="grid grid-cols-4 divide-x divide-dashed divide-border">
              {STEPS.map((s) => (
                <div
                  key={s.num}
                  className={`text-center py-3 px-2 transition-colors ${
                    step === parseInt(s.num)
                      ? 'bg-primary text-white'
                      : step > parseInt(s.num)
                      ? 'bg-slate-100 text-primary'
                      : 'bg-transparent text-text-secondary'
                  }`}
                >
                  <div className={`font-mono-ticket text-lg font-bold leading-none mb-0.5 ${
                    step === parseInt(s.num) ? 'text-white' : step > parseInt(s.num) ? 'text-primary' : 'text-slate-300'
                  }`}>
                    {step > parseInt(s.num) ? '✓' : s.num}
                  </div>
                  <div className="text-[10px] font-semibold hidden sm:block leading-tight">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {step === 1 && <QuickFillPreset onSelectPreset={handlePresetSelect} />}

          {error && (
            <div className="bg-red-50 border-l-4 border-accent p-3 rounded text-xs text-accent mb-6 flex items-start gap-2 whitespace-pre-line">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white border border-border rounded-lg p-6 shadow-sm">

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
                      Deskripsi Kejadian / Masalah <span className="text-accent">*</span>
                    </label>
                    <span className={`text-[11px] font-mono-ticket ${formData.deskripsi.length > 2000 ? 'text-accent font-bold' : 'text-text-secondary'}`}>
                      {formData.deskripsi.length}/2000
                    </span>
                  </div>
                  <textarea
                    rows={6}
                    value={formData.deskripsi}
                    onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                    placeholder="Ceritakan kejadian masalah secara jelas. Dapat ditulis dalam Bahasa Indonesia atau Bahasa Bangka..."
                    className="w-full bg-bg-base border border-border rounded p-3 text-sm text-text-primary focus:outline-none focus:border-primary transition-colors placeholder:text-text-secondary resize-none"
                  />
                  <div className="flex items-center gap-1.5 mt-2">
                    <Bot className="w-3.5 h-3.5 text-primary shrink-0" />
                    <p className="text-[11px] text-text-secondary">
                      AI akan menyarankan kategori &amp; dinas tujuan berdasarkan isi laporan ini
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Lokasi & Lampiran */}
            {step === 2 && (
              <div className="space-y-5">
                <LocationPicker
                  value={formData}
                  onChange={(updated) => setFormData((prev) => ({ ...prev, ...updated }))}
                  error={locationError}
                />

                <div>
                  <label className={labelClass}>Lampiran Foto / Bukti (Maks 10 MB)</label>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".png,.jpg,.jpeg,.pdf"
                    onChange={(e) => handleFileSelect(e.target.files)}
                    className="hidden"
                  />

                  {!attachment ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDrop={handleDrop}
                      onDragOver={(e) => e.preventDefault()}
                      className="border-2 border-dashed border-border bg-bg-base p-8 rounded text-center cursor-pointer hover:border-primary transition-colors"
                    >
                      <Upload className="w-8 h-8 text-text-secondary mx-auto mb-2" />
                      <p className="text-sm font-semibold text-text-primary">Unggah Foto atau Dokumen Pendukung</p>
                      <p className="text-[11px] text-text-secondary mt-1">Format PNG, JPG, atau PDF — Opsional</p>
                    </div>
                  ) : (
                    <div className="border border-border bg-bg-base rounded p-3 flex items-center gap-3">
                      {attachment.previewUrl ? (
                        <img src={attachment.previewUrl} alt="preview" className="w-14 h-14 object-cover rounded border border-border" />
                      ) : (
                        <div className="w-14 h-14 rounded border border-border bg-white flex items-center justify-center">
                          <FileText className="w-6 h-6 text-text-secondary" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-text-primary truncate">{attachment.file.name}</p>
                        <p className="text-[11px] text-text-secondary">{(attachment.file.size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveAttachment}
                        className="p-1.5 rounded hover:bg-slate-300 transition-colors"
                      >
                        <X className="w-4 h-4 text-text-secondary" />
                      </button>
                    </div>
                  )}
                  {fileError && <p className="text-[11px] text-accent mt-1.5">{fileError}</p>}
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
                        ? 'border-primary bg-slate-100'
                        : 'border-border bg-bg-base hover:border-primary'
                    }`}>
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="identity_mode"
                          checked={!formData.is_anonim}
                          onChange={() => setFormData({ ...formData, is_anonim: false })}
                          className="mt-1 accent-primary"
                        />
                        <div>
                          <div className="text-sm font-bold text-text-primary">Melapor Dengan Identitas Email</div>
                          <p className="text-[11px] text-text-secondary mt-0.5">
                            Anda akan menerima kode verifikasi OTP dan notifikasi pergerakan status laporan. <span className="font-semibold text-primary">Direkomendasikan.</span>
                          </p>
                        </div>
                      </div>
                    </label>

                    <label className={`block border rounded-lg p-4 cursor-pointer transition-all ${
                      formData.is_anonim
                        ? 'border-primary bg-slate-100'
                        : 'border-border bg-bg-base hover:border-primary'
                    }`}>
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="identity_mode"
                          checked={formData.is_anonim}
                          onChange={() => setFormData({ ...formData, is_anonim: true, pelapor_email: '' })}
                          className="mt-1 accent-primary"
                        />
                        <div>
                          <div className="text-sm font-bold text-text-primary">Mode Anonim</div>
                          <p className="text-[11px] text-text-secondary mt-0.5">
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
                      Alamat Email Pelapor <span className="text-accent">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.pelapor_email}
                      onChange={(e) => setFormData({ ...formData, pelapor_email: e.target.value })}
                      placeholder="email.warga@example.com"
                      className={inputPrimary}
                    />
                    <p className="text-[11px] text-text-secondary mt-1.5">
                      Digunakan untuk kode OTP verifikasi saja. Tidak ditampilkan ke publik dan disamarkan sebelum diproses AI.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* STEP 4: Tinjau & Kirim */}
            {step === 4 && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-3">
                  Ringkasan Data Pengaduan
                </h3>

                <div className="bg-bg-base border border-border rounded-lg p-4 text-sm space-y-3">
                  <div className="flex gap-2">
                    <span className="text-text-secondary w-24 shrink-0 text-xs">Kategori:</span>
                    <span className="font-bold text-primary">{formData.kategori}</span>
                  </div>
                  <div className="border-t border-border pt-3">
                    <span className="text-text-secondary block text-xs mb-1">Deskripsi Masalah:</span>
                    <p className="text-text-primary text-sm leading-relaxed">{formData.deskripsi}</p>
                  </div>
                  <div className="border-t border-border pt-3 grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-text-secondary block">Lokasi:</span>
                      <span className="text-text-primary font-medium">{formData.lokasi_alamat || 'Tidak ditentukan'}</span>
                    </div>
                    <div>
                      <span className="text-text-secondary block">Mode Identitas:</span>
                      <span className="font-semibold text-text-primary">
                        {formData.is_anonim ? 'Mode Anonim' : `Non-Anonim (${formData.pelapor_email})`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-100 border border-border rounded-lg p-3 text-xs text-text-secondary flex items-start gap-2">
                  <Bot className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <p>
                    Setelah dikirim, AI Triage akan menganalisis urgensi (<span className="font-bold">Kritis/Tinggi/Sedang/Rendah</span>) &amp; merekomendasikan dinas tujuan secara otomatis.
                  </p>
                </div>
              </div>
            )}

            {/* Form Action Controls */}
            <div className="flex items-center justify-between border-t border-border pt-5 mt-6">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="border border-border text-text-primary hover:bg-bg-base px-4 py-2 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Kembali
                </button>
              ) : <div />}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  Lanjut
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-accent hover:bg-accent-hover text-white px-6 py-2.5 rounded text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50 shadow-sm"
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
      </main>
    </div>
  );
}