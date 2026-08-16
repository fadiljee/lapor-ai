import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/dashboard/Sidebar';
import { api } from '../../services/api';
import { ShieldAlert, Search, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

export function AuditLogPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const loadAuditLogs = async () => {
    setLoading(true);
    try {
      const data = await api.getAuditLogs();
      setLogs(data || []);
    } catch (err) {
      console.error('Error fetching audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuditLogs();
  }, []);

  
  const filteredLogs = logs.filter((log) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      (log.report_id && log.report_id.toLowerCase().includes(term)) ||
      (log.actor && log.actor.toLowerCase().includes(term)) ||
      (log.action && log.action.toLowerCase().includes(term)) ||
      (log.details && log.details.toLowerCase().includes(term)) ||
      (log.model_version && log.model_version.toLowerCase().includes(term))
    );
  });

  
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  
  const totalItems = filteredLogs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentLogs = filteredLogs.slice(startIndex, endIndex);

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 bg-bg-base">
        
        <div className="bg-white border border-border p-6 rounded-lg mb-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldAlert className="w-5 h-5 text-primary" />
              <h1 className="font-serif font-bold text-xl text-text-primary">
                Log Transparansi Audit AI &amp; Keputusan Manusia
              </h1>
            </div>
            <p className="text-xs text-text-secondary">
              Jejak audit kronologis dari setiap klasifikasi AI, prompt version, dan override yang dilakukan oleh petugas.
            </p>
          </div>

          <button
            onClick={loadAuditLogs}
            className="p-2 bg-bg-base hover:bg-border border border-border rounded text-primary flex items-center gap-1.5 text-xs font-semibold shrink-0 transition-colors"
            title="Refresh Audit Logs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        
        <div className="bg-white border border-border rounded-lg p-4 mb-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-text-secondary absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nomor tiket, aktor, atau aksi..."
              className="w-full bg-bg-base border border-border rounded pl-9 pr-3 py-2 text-xs text-text-primary focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-text-secondary">Tampilkan per halaman:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="bg-bg-base border border-border rounded px-2.5 py-1.5 text-xs font-semibold text-text-primary focus:outline-none focus:border-primary"
            >
              <option value={5}>5 log</option>
              <option value={10}>10 log</option>
              <option value={20}>20 log</option>
              <option value={50}>50 log</option>
            </select>
          </div>
        </div>

        
        <div className="bg-white border border-border rounded-lg overflow-hidden shadow-sm mb-4">
          <div className="overflow-x-auto" data-lenis-prevent="true">
            <table className="w-full text-left border-collapse text-xs min-w-[700px]">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="p-3 font-bold uppercase">Waktu Timestamp</th>
                  <th className="p-3 font-bold uppercase">Nomor Tiket</th>
                  <th className="p-3 font-bold uppercase">Aktor (AI / Manusia)</th>
                  <th className="p-3 font-bold uppercase">Aksi / Event</th>
                  <th className="p-3 font-bold uppercase">Rincian Perubahan</th>
                  <th className="p-3 font-bold uppercase">Versi Model</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-text-secondary">Memuat log audit...</td>
                  </tr>
                ) : currentLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-text-secondary">
                      {searchTerm ? 'Tidak ada log audit yang cocok dengan pencarian.' : 'Belum ada log audit tercatat.'}
                    </td>
                  </tr>
                ) : (
                  currentLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-bg-base transition-colors">
                      <td className="p-3 font-mono text-[11px] text-text-secondary whitespace-nowrap">{log.timestamp}</td>
                      <td className="p-3 font-mono font-bold text-primary whitespace-nowrap">{log.report_id || 'SYSTEM'}</td>
                      <td className="p-3 font-semibold text-text-primary">{log.actor}</td>
                      <td className="p-3 font-mono text-[11px] uppercase font-bold text-accent whitespace-nowrap">{log.action}</td>
                      <td className="p-3 text-text-primary">{log.details}</td>
                      <td className="p-3 font-mono text-[11px] text-text-secondary whitespace-nowrap">{log.model_version}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        
        {!loading && totalItems > 0 && (
          <div className="bg-white border border-border rounded-lg p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="text-text-secondary">
              Menampilkan <span className="font-bold text-text-primary">{totalItems === 0 ? 0 : startIndex + 1}</span> -{' '}
              <span className="font-bold text-text-primary">{endIndex}</span> dari{' '}
              <span className="font-bold text-text-primary">{totalItems}</span> log audit
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded border border-border text-text-primary hover:bg-bg-base disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Halaman Sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .map((page, i, arr) => {
                  const showEllipsis = i > 0 && page - arr[i - 1] > 1;
                  return (
                    <React.Fragment key={page}>
                      {showEllipsis && <span className="px-1 text-text-secondary">...</span>}
                      <button
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded font-mono font-bold text-xs transition-colors ${
                          currentPage === page
                            ? 'bg-primary text-white'
                            : 'border border-border hover:bg-bg-base text-text-primary'
                        }`}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  );
                })}

              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded border border-border text-text-primary hover:bg-bg-base disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Halaman Selanjutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
