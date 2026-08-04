import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/dashboard/Sidebar';
import { api } from '../../services/api';
import { BarChart3, TrendingUp, AlertTriangle, RefreshCw, Building } from 'lucide-react';

// ─── Helpers ─────────────────────────────────────────────────────────────────
function calcPct(value, total) {
  if (!total || total === 0) return 0;
  return Math.min(100, Math.round((value / total) * 100));
}

function StatCard({ label, value, sub, accentClass = '', leftBorder = '' }) {
  return (
    <div className={`bg-white border border-[#D8DAD2] p-4 rounded-lg shadow-sm ${leftBorder}`}>
      <div className="text-[11px] text-[#5B6357] font-semibold uppercase">{label}</div>
      <div className={`font-mono font-bold text-2xl mt-1 ${accentClass}`}>{value ?? '—'}</div>
      {sub && <div className="text-[10px] text-[#5B6357] mt-1">{sub}</div>}
    </div>
  );
}

function UrgencyBar({ label, count, total, colorBg, colorText }) {
  const pct = calcPct(count, total);
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className={`font-bold ${colorText}`}>{label}</span>
        <span className="font-mono">{count ?? 0} laporan</span>
      </div>
      <div className="w-full bg-[#F3F4EF] rounded h-2">
        <div className={`${colorBg} h-2 rounded transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export function AnalyticsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadStats = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Gagal memuat data analitik dari server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const kpi = stats?.kpi || {};
  const byDept = stats?.by_department || {};
  const totalReports = kpi.total_reports || 0;
  const totalDeptEntries = Object.values(byDept).reduce((s, v) => s + v, 0);

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 bg-[#F3F4EF]">

        {/* Page Header */}
        <div className="bg-white border border-[#D8DAD2] p-6 rounded-lg mb-6 shadow-sm flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-5 h-5 text-[#1F4E4B]" />
              <h1 className="font-serif font-bold text-xl text-[#1A2420]">
                Dashboard Analitik Executif &amp; KPI Agregat
              </h1>
            </div>
            <p className="text-xs text-[#5B6357]">
              Statistik performa triage AI, kepatuhan SLA, dan distribusi laporan warga per dinas — data real-time dari database.
            </p>
          </div>
          <button
            onClick={loadStats}
            disabled={loading}
            className="p-2 bg-[#F3F4EF] hover:bg-[#D8DAD2] border border-[#D8DAD2] rounded text-[#1F4E4B] disabled:opacity-50"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {error && (
          <div className="bg-[#FBEAEA] border border-[#B3261E] text-[#B3261E] text-xs p-3 rounded mb-6 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            label="Total Laporan Masuk"
            value={loading ? '...' : totalReports}
            sub={
              <span className="flex items-center gap-1 text-[#1F4E4B]">
                <TrendingUp className="w-3 h-3" />
                {kpi.open_cases ?? 0} masih aktif
              </span>
            }
          />
          <StatCard
            label="Kasus Kritis Aktif"
            value={loading ? '...' : kpi.critical_cases ?? 0}
            sub="Triage Real-Time Notified"
            accentClass="text-[#B3261E]"
            leftBorder="border-l-4 border-l-[#B3261E]"
          />
          <StatCard
            label="Akurasi Rekomendasi AI"
            value={loading ? '...' : `${kpi.ai_accuracy_rate ?? '—'}%`}
            sub="Evaluasi Human Agreement"
            accentClass="text-[#1F4E4B]"
          />
          <StatCard
            label="Kepatuhan Target SLA"
            value={loading ? '...' : `${kpi.sla_compliance_rate ?? '—'}%`}
            sub={`Avg Response: ${kpi.avg_response_mins ?? '—'} menit`}
          />
        </div>

        {/* Urgensi Distribution + Department */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

          {/* Urgensi Distribution — bars calculated from real data */}
          <div className="bg-white border border-[#D8DAD2] p-5 rounded-lg shadow-sm">
            <h3 className="text-xs font-bold text-[#1A2420] uppercase tracking-wider mb-4">
              Distribusi Urgensi Laporan
            </h3>
            {loading ? (
              <div className="text-xs text-[#5B6357] text-center py-8">Memuat data...</div>
            ) : (
              <div className="space-y-3 text-xs">
                <UrgencyBar
                  label="Kritis (Darurat Jiwa/Kebakaran)"
                  count={kpi.critical_cases}
                  total={totalReports}
                  colorBg="bg-[#B3261E]"
                  colorText="text-[#B3261E]"
                />
                <UrgencyBar
                  label="Tinggi (Infrastruktur Bahaya)"
                  count={kpi.high_cases}
                  total={totalReports}
                  colorBg="bg-[#94570A]"
                  colorText="text-[#94570A]"
                />
                <UrgencyBar
                  label="Sedang (Gangguan Layanan)"
                  count={kpi.medium_cases}
                  total={totalReports}
                  colorBg="bg-[#3E5C78]"
                  colorText="text-[#3E5C78]"
                />
                <UrgencyBar
                  label="Rendah (Saran/Administratif)"
                  count={kpi.low_cases}
                  total={totalReports}
                  colorBg="bg-[#4B564D]"
                  colorText="text-[#4B564D]"
                />
              </div>
            )}
          </div>

          {/* Department Distribution — real from DB */}
          <div className="bg-white border border-[#D8DAD2] p-5 rounded-lg shadow-sm">
            <h3 className="text-xs font-bold text-[#1A2420] uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Building className="w-4 h-4 text-[#1F4E4B]" />
              Disposisi per Dinas Tujuan
            </h3>
            {loading ? (
              <div className="text-xs text-[#5B6357] text-center py-8">Memuat data...</div>
            ) : Object.keys(byDept).length === 0 ? (
              <div className="text-xs text-[#5B6357] text-center py-8">Belum ada laporan terdisposisi.</div>
            ) : (
              <div className="space-y-2 text-xs">
                {Object.entries(byDept)
                  .sort(([, a], [, b]) => b - a)
                  .map(([dept, count], i) => {
                    const pct = calcPct(count, totalDeptEntries);
                    return (
                      <div key={i} className="flex items-center justify-between p-2 bg-[#F3F4EF] rounded border border-[#D8DAD2]">
                        <span className="font-semibold text-[#1A2420] flex-1 mr-2 leading-tight">{dept}</span>
                        <span className="font-mono font-bold text-[#1F4E4B] shrink-0">
                          {count} ({pct}%)
                        </span>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>

        {/* Duplicate Detection Card */}
        <div className="bg-white border border-[#D8DAD2] p-5 rounded-lg shadow-sm">
          <h3 className="text-xs font-bold text-[#1A2420] uppercase tracking-wider mb-3">
            Deteksi Duplikat & Statistik Tambahan
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="bg-[#F3F4EF] p-3 rounded border border-[#D8DAD2]">
              <div className="text-[#5B6357] mb-1">Total Laporan Masuk</div>
              <div className="font-mono font-bold text-lg text-[#1A2420]">{loading ? '...' : totalReports}</div>
            </div>
            <div className="bg-[#F3F4EF] p-3 rounded border border-[#D8DAD2]">
              <div className="text-[#5B6357] mb-1">Kasus Aktif / Open</div>
              <div className="font-mono font-bold text-lg text-[#1F4E4B]">{loading ? '...' : kpi.open_cases ?? 0}</div>
            </div>
            <div className="bg-[#F3F4EF] p-3 rounded border border-[#D8DAD2]">
              <div className="text-[#5B6357] mb-1">Terindikasi Duplikat</div>
              <div className="font-mono font-bold text-lg text-[#94570A]">{loading ? '...' : kpi.duplicate_count ?? 0}</div>
            </div>
            <div className="bg-[#F3F4EF] p-3 rounded border border-[#D8DAD2]">
              <div className="text-[#5B6357] mb-1">Diselesaikan / Closed</div>
              <div className="font-mono font-bold text-lg text-[#4B564D]">
                {loading ? '...' : Math.max(0, totalReports - (kpi.open_cases ?? 0))}
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
