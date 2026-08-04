import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/dashboard/Sidebar';
import { api } from '../../services/api';
import { BarChart3, TrendingUp, AlertTriangle, ShieldCheck, CheckCircle2, MapPin } from 'lucide-react';

export function AnalyticsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await api.getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const kpi = stats?.kpi || {
    total_reports: 48,
    open_cases: 12,
    critical_cases: 3,
    high_cases: 8,
    medium_cases: 22,
    low_cases: 15,
    avg_response_mins: 8.4,
    sla_compliance_rate: 96.5,
    ai_accuracy_rate: 94.2
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 bg-[#F3F4EF]">
        <div className="bg-white border border-[#D8DAD2] p-6 rounded-lg mb-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-5 h-5 text-[#1F4E4B]" />
            <h1 className="font-serif font-bold text-xl text-[#1A2420]">
              Dashboard Analitik Executif & KPI Agregat
            </h1>
          </div>
          <p className="text-xs text-[#5B6357]">
            Visualisasi statistik performa triage AI, kepatuhan SLA, dan distribusi laporan warga per wilayah/dinas.
          </p>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-[#D8DAD2] p-4 rounded-lg shadow-sm">
            <div className="text-[11px] text-[#5B6357] font-semibold uppercase">Total Laporan Masuk</div>
            <div className="font-mono font-bold text-2xl text-[#1A2420] mt-1">{kpi.total_reports}</div>
            <div className="text-[10px] text-[#1F4E4B] mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +12% dari pekan lalu
            </div>
          </div>

          <div className="bg-white border border-[#D8DAD2] p-4 rounded-lg shadow-sm border-l-4 border-l-[#B3261E]">
            <div className="text-[11px] text-[#5B6357] font-semibold uppercase">Kasus Kritis Aktif</div>
            <div className="font-mono font-bold text-2xl text-[#B3261E] mt-1">{kpi.critical_cases}</div>
            <div className="text-[10px] text-[#B3261E] mt-1 font-semibold">Triage Real-Time Notified</div>
          </div>

          <div className="bg-white border border-[#D8DAD2] p-4 rounded-lg shadow-sm">
            <div className="text-[11px] text-[#5B6357] font-semibold uppercase">Akurasi Rekomendasi AI</div>
            <div className="font-mono font-bold text-2xl text-[#1F4E4B] mt-1">{kpi.ai_accuracy_rate}%</div>
            <div className="text-[10px] text-[#5B6357] mt-1">Evaluasi Human Agreement</div>
          </div>

          <div className="bg-white border border-[#D8DAD2] p-4 rounded-lg shadow-sm">
            <div className="text-[11px] text-[#5B6357] font-semibold uppercase">Kepatuhan Target SLA</div>
            <div className="font-mono font-bold text-2xl text-[#1A2420] mt-1">{kpi.sla_compliance_rate}%</div>
            <div className="text-[10px] text-[#1F4E4B] mt-1">Avg Response: {kpi.avg_response_mins} menit</div>
          </div>
        </div>

        {/* Urgency Distribution Chart Representation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white border border-[#D8DAD2] p-5 rounded-lg shadow-sm">
            <h3 className="text-xs font-bold text-[#1A2420] uppercase tracking-wider mb-4">
              Distribusi Urgensi Laporan
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-bold text-[#B3261E]">Kritis (Darurat Jiwa/Kebakaran)</span>
                  <span className="font-mono">{kpi.critical_cases} laporan</span>
                </div>
                <div className="w-full bg-[#F3F4EF] rounded h-2">
                  <div className="bg-[#B3261E] h-2 rounded" style={{ width: '25%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-bold text-[#94570A]">Tinggi (Bahasa Infrastruktur 24 Jam)</span>
                  <span className="font-mono">{kpi.high_cases} laporan</span>
                </div>
                <div className="w-full bg-[#F3F4EF] rounded h-2">
                  <div className="bg-[#94570A] h-2 rounded" style={{ width: '45%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-bold text-[#3E5C78]">Sedang (Gangguan Layanan)</span>
                  <span className="font-mono">{kpi.medium_cases} laporan</span>
                </div>
                <div className="w-full bg-[#F3F4EF] rounded h-2">
                  <div className="bg-[#3E5C78] h-2 rounded" style={{ width: '65%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-bold text-[#4B564D]">Rendah (Saran/Administratif)</span>
                  <span className="font-mono">{kpi.low_cases} laporan</span>
                </div>
                <div className="w-full bg-[#F3F4EF] rounded h-2">
                  <div className="bg-[#4B564D] h-2 rounded" style={{ width: '35%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Department Distribution */}
          <div className="bg-white border border-[#D8DAD2] p-5 rounded-lg shadow-sm">
            <h3 className="text-xs font-bold text-[#1A2420] uppercase tracking-wider mb-4">
              Disposisi per Dinas Tujuan (Section 36)
            </h3>
            <div className="space-y-2 text-xs">
              {[
                { name: 'Dinas Pekerjaan Umum (PUPR)', count: 18, pct: '40%' },
                { name: 'Badan Penanggulangan Bencana (BPBD)', count: 9, pct: '20%' },
                { name: 'Dinas Lingkungan Hidup (DLH)', count: 12, pct: '25%' },
                { name: 'Disposisi Manual (Antrean Admin)', count: 6, pct: '15%' },
              ].map((d, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-[#F3F4EF] rounded border border-[#D8DAD2]">
                  <span className="font-semibold text-[#1A2420]">{d.name}</span>
                  <span className="font-mono font-bold text-[#1F4E4B]">{d.count} ({d.pct})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hotspot Location Map Representation */}
        <div className="bg-white border border-[#D8DAD2] p-5 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-[#1A2420] uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#1F4E4B]" />
              Peta Sebaran Laporan & Hotspot Wilayah
            </h3>
            <span className="text-[11px] text-[#5B6357] font-mono">Pangkalpinang & Kepulauan Bangka Belitung</span>
          </div>

          <div className="bg-[#EEF1EC] border border-[#D8DAD2] h-64 rounded flex items-center justify-center relative overflow-hidden">
            {/* Visual Hotspot Markers */}
            <div className="absolute top-1/3 left-1/4 bg-[#B3261E] text-white text-[10px] font-bold px-2 py-1 rounded shadow flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
              Pasar Sekanak (KRITIS - Kebakaran)
            </div>

            <div className="absolute top-1/2 left-1/2 bg-[#94570A] text-white text-[10px] font-bold px-2 py-1 rounded shadow">
              Jl. Merdeka (TINGGI - Kabel Terkelupas)
            </div>

            <div className="absolute bottom-1/4 right-1/3 bg-[#3E5C78] text-white text-[10px] font-bold px-2 py-1 rounded shadow">
              Gang Mawar (SEDANG - Lampu Mati)
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
