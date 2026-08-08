import React from 'react';
import { Zap, Sparkles } from 'lucide-react';

export function QuickFillPreset({ onSelectPreset }) {
  const presets = [
    {
      id: 'bangka_kritis',
      label: '🔴 Kritis (Bahasa Bangka)',
      desc: 'Kebakaran di Pasar Sekanak',
      data: {
        kategori: 'Keamanan/Bencana',
        deskripsi: 'Ada kebakaran di Pasar Sekanak RT 03! Api makin gede nak keno uma warga dide jauh dari lokasi!',
        lokasi_alamat: 'Pasar Sekanak, Pangkalpinang, Bangka Belitung',
        is_anonim: false,
        email: 'warga.bangka@example.com',
        preset_type: 'kritis_bangka'
      }
    },
    {
      id: 'indo_tinggi',
      label: '🟠 Tinggi (Bahasa Indonesia)',
      desc: 'Kabel Listrik Menjuntai & Ambles',
      data: {
        kategori: 'Infrastruktur',
        deskripsi: 'Kabel listrik PLN terkelupas menjuntai ke jalan dan tiang hampir roboh di Jalan Merdeka depan SD 01.',
        lokasi_alamat: 'Jl. Merdeka No. 12, Pangkalpinang',
        is_anonim: false,
        email: 'pelapor.tinggi@example.com',
        preset_type: 'tinggi_indo'
      }
    },
    {
      id: 'indo_sedang',
      label: '🔵 Sedang (Bahasa Indonesia)',
      desc: 'Lampu Jalan Mati',
      data: {
        kategori: 'Infrastruktur',
        deskripsi: 'Lampu penerangan jalan umum mati total sepanjang 500m di Gang Mawar sejak 3 hari lalu.',
        lokasi_alamat: 'Gang Mawar, Pangkalpinang',
        is_anonim: true,
        email: '',
        preset_type: 'sedang_indo'
      }
    },
    {
      id: 'indo_rendah',
      label: '🟢 Rendah (Bahasa Indonesia)',
      desc: 'Usulan Bak Sampah',
      data: {
        kategori: 'Lingkungan',
        deskripsi: 'Usulan penambahan tempat sampah pilah di area Alun-alun Taman Merdeka.',
        lokasi_alamat: 'Alun-alun Taman Merdeka',
        is_anonim: false,
        email: 'saran.warga@example.com',
        preset_type: 'rendah_indo'
      }
    }
  ];

  return (
    <div className="bg-bg-base border border-border p-4 rounded-lg mb-6">
      <div className="flex items-center gap-2 mb-2">
        <Zap className="w-4 h-4 text-primary" />
        <span className="text-xs font-semibold uppercase tracking-wider text-primary">
          Mode Demo: Quick-Fill Preset (FR-1.9)
        </span>
        <span className="bg-primary text-white text-[10px] px-1.5 py-0.5 rounded">Preset Presentasi</span>
      </div>
      <p className="text-xs text-text-secondary mb-3">
        Pilih salah satu skenario preset pengaduan di bawah ini untuk mengisi formulir secara instan saat simulasi demo presentasi:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {presets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => onSelectPreset(preset.data)}
            className="text-left bg-white hover:bg-bg-base border border-border p-2.5 rounded transition-all flex flex-col justify-center group"
          >
            <div className="text-xs font-bold text-text-primary group-hover:text-primary">
              {preset.label}
            </div>
            <div className="text-[11px] text-text-secondary truncate">
              {preset.desc}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
