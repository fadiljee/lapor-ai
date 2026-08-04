import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/dashboard/Sidebar';
import { api } from '../../services/api';
import { ShieldAlert, FileText, Search, RefreshCw } from 'lucide-react';

export function AuditLogPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAuditLogs = async () => {
    setLoading(true);
    try {
      const data = await api.getAuditLogs();
      setLogs(data);
    } catch (err) {
      console.error('Error fetching audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuditLogs();
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 bg-[#F3F4EF]">
        <div className="bg-white border border-[#D8DAD2] p-6 rounded-lg mb-6 shadow-sm flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldAlert className="w-5 h-5 text-[#1F4E4B]" />
              <h1 className="font-serif font-bold text-xl text-[#1A2420]">
                Jejak Rekam Log Audit AI & Keputusan Manusia (Read-Only)
              </h1>
            </div>
            <p className="text-xs text-[#5B6357]">
              Jejak audit kronologis dari setiap klasifikasi AI, prompt version, dan override yang dilakukan oleh petugas.
            </p>
          </div>

          <button
            onClick={loadAuditLogs}
            className="p-2 bg-[#F3F4EF] hover:bg-[#D8DAD2] border border-[#D8DAD2] rounded text-[#1F4E4B]"
            title="Refresh Audit Logs"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-white border border-[#D8DAD2] rounded-lg overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#1F4E4B] text-white">
                <th className="p-3 font-bold uppercase">Waktu Timestamp</th>
                <th className="p-3 font-bold uppercase">Nomor Tiket</th>
                <th className="p-3 font-bold uppercase">Aktor (AI / Manusia)</th>
                <th className="p-3 font-bold uppercase">Aksi / Event</th>
                <th className="p-3 font-bold uppercase">Rincian Perubahan</th>
                <th className="p-3 font-bold uppercase">Versi Model</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8DAD2]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#5B6357]">Memuat log audit...</td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#5B6357]">Belum ada log audit tercatat.</td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#F3F4EF]">
                    <td className="p-3 font-mono text-[11px] text-[#5B6357]">{log.timestamp}</td>
                    <td className="p-3 font-mono font-bold text-[#1F4E4B]">{log.report_id}</td>
                    <td className="p-3 font-semibold text-[#1A2420]">{log.actor}</td>
                    <td className="p-3 font-mono text-[11px] uppercase font-bold text-[#A23B2E]">{log.action}</td>
                    <td className="p-3 text-[#1A2420]">{log.details}</td>
                    <td className="p-3 font-mono text-[11px] text-[#5B6357]">{log.model_version}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
