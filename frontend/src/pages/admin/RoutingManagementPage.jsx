import React from 'react';
import { Sidebar } from '../../components/dashboard/Sidebar';
import { MapPin, ShieldCheck, Edit } from 'lucide-react';

export function RoutingManagementPage() {
  const routingMatrix = [
    { kategori: 'Infrastruktur', ciri: 'Jalan berlubang/ambles, jembatan rusak, drainase mampet, lampu jalan mati, kabel listrik', dinas: 'Dinas Pekerjaan Umum dan Penataan Ruang (PUPR)', prioritas: 'Tinggi jika berpotensi bahaya' },
    { kategori: 'Keamanan/Bencana', ciri: 'Kebakaran, kecelakaan massal, kekerasan berlangsung, bencana alam (banjir, longsor)', dinas: 'Badan Penanggulangan Bencana Daerah (BPBD)', prioritas: 'Selalu Kritis/Tinggi' },
    { kategori: 'Layanan Publik', ciri: 'Pelayanan administrasi lambat/dipersulit, fasilitas kantor pelayanan publik rusak', dinas: 'Dinas Penanaman Modal dan Pelayanan Terpadu Satu Pintu (DPMPTSP)', prioritas: 'Sedang' },
    { kategori: 'Lingkungan', ciri: 'Sampah menumpuk, pencemaran air/udara, penebangan liar', dinas: 'Dinas Lingkungan Hidup (DLH)', prioritas: 'Sedang–Tinggi' },
    { kategori: 'Kesehatan', ciri: 'Fasilitas puskesmas/rumah sakit bermasalah, sanitasi buruk, indikasi wabah', dinas: 'Dinas Kesehatan (Dinkes)', prioritas: 'Tinggi jika wabah' },
    { kategori: 'Pendidikan', ciri: 'Fasilitas sekolah rusak, dugaan pungutan liar di sekolah', dinas: 'Dinas Pendidikan (Disdik)', prioritas: 'Sedang' },
    { kategori: 'Ketertiban Umum', ciri: 'PKL/bangunan liar, gangguan ketertiban non-darurat', dinas: 'Satuan Polisi Pamong Praja (Satpol PP)', prioritas: 'Rendah–Sedang' },
    { kategori: 'Lainnya', ciri: 'Tidak sesuai kategori di atas atau confidence rendah (<80%)', dinas: 'Disposisi Manual (Antrean Admin)', prioritas: 'Sesuai Urgensi' }
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 bg-[#F3F4EF]">
        <div className="bg-white border border-[#D8DAD2] p-6 rounded-lg mb-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-5 h-5 text-[#1F4E4B]" />
            <h1 className="font-serif font-bold text-xl text-[#1A2420]">
              Matriks Pemetaan Dinas Tujuan (PRD Section 36)
            </h1>
          </div>
          <p className="text-xs text-[#5B6357]">
            Tabel lookup deterministik untuk menentukan rekomendasi awal dinas tujuan berdasarkan hasil klasifikasi kategori AI.
          </p>
        </div>

        <div className="bg-white border border-[#D8DAD2] rounded-lg overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#1F4E4B] text-white">
                <th className="p-3 font-bold uppercase">Kategori LLM</th>
                <th className="p-3 font-bold uppercase">Ciri / Sub-Isu Indikator</th>
                <th className="p-3 font-bold uppercase">Dinas Tujuan (Deterministik)</th>
                <th className="p-3 font-bold uppercase">Prioritas Default</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8DAD2]">
              {routingMatrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#F3F4EF]">
                  <td className="p-3 font-bold text-[#1F4E4B]">{row.kategori}</td>
                  <td className="p-3 text-[#5B6357]">{row.ciri}</td>
                  <td className="p-3 font-semibold text-[#1A2420]">{row.dinas}</td>
                  <td className="p-3 font-mono text-[11px]">{row.prioritas}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
