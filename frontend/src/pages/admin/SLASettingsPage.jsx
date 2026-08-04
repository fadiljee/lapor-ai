import React from 'react';
import { Sidebar } from '../../components/dashboard/Sidebar';
import { Clock, ShieldCheck } from 'lucide-react';
import { UrgencyBadge } from '../../components/common/UrgencyBadge';

export function SLASettingsPage() {
  const slaMatrix = [
    { level: 'KRITIS', targetResponse: '≤ 15 menit', targetResolution: '≤ 2 jam', action: 'Notifikasi Real-Time Push / Email ke Petugas Piket' },
    { level: 'TINGGI', targetResponse: '≤ 2 jam', targetResolution: '≤ 1 hari', action: 'Eskalasi ke Kepala Unit Teknis' },
    { level: 'SEDANG', targetResponse: '≤ 8 jam', targetResolution: '≤ 3 hari', action: 'Antrean Operasional Normal' },
    { level: 'RENDAH', targetResponse: '≤ 1 hari', targetResolution: '≤ 7 hari', action: 'Peninjauan Terjadwal Pekanan' }
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 bg-[#F3F4EF]">
        <div className="bg-white border border-[#D8DAD2] p-6 rounded-lg mb-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-[#1F4E4B]" />
            <h1 className="font-serif font-bold text-xl text-[#1A2420]">
              Matriks Konfigurasi SLA Penanganan (PRD Section 25)
            </h1>
          </div>
          <p className="text-xs text-[#5B6357]">
            Target Service Level Agreement (SLA) untuk waktu respons pertama (Response) dan penyelesaian kasus (Resolution) berdasarkan level urgensi.
          </p>
        </div>

        <div className="bg-white border border-[#D8DAD2] rounded-lg overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#1F4E4B] text-white">
                <th className="p-3 font-bold uppercase">Level Urgensi</th>
                <th className="p-3 font-bold uppercase">Target Waktu Respons (Initial)</th>
                <th className="p-3 font-bold uppercase">Target Waktu Penyelesaian (Resolution)</th>
                <th className="p-3 font-bold uppercase">Mekanisme Eskalasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8DAD2]">
              {slaMatrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#F3F4EF]">
                  <td className="p-3"><UrgencyBadge level={row.level} /></td>
                  <td className="p-3 font-mono font-bold text-[#1F4E4B]">{row.targetResponse}</td>
                  <td className="p-3 font-mono font-bold text-[#1A2420]">{row.targetResolution}</td>
                  <td className="p-3 text-[#5B6357]">{row.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
