import React from 'react';
import { TrendingUp, Calendar, Activity } from 'lucide-react';

export function ReportTrendChart({ dailyData = [] }) {
  
  const data = dailyData.length > 0 ? dailyData : [
    { date: '2026-08-02', display: '02 Aug', total: 12, kritis: 2 },
    { date: '2026-08-03', display: '03 Aug', total: 19, kritis: 5 },
    { date: '2026-08-04', display: '04 Aug', total: 28, kritis: 8 },
    { date: '2026-08-05', display: '05 Aug', total: 22, kritis: 4 },
    { date: '2026-08-06', display: '06 Aug', total: 35, kritis: 11 },
    { date: '2026-08-07', display: '07 Aug', total: 31, kritis: 7 },
    { date: '2026-08-08', display: '08 Aug', total: 42, kritis: 14 },
  ];

  const maxVal = Math.max(...data.map((d) => d.total), 10);
  const chartHeight = 180;

  return (
    <div className="bg-white border border-border rounded-lg p-5 shadow-sm space-y-4">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-border pb-3">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h3 className="font-serif font-bold text-base text-text-primary">
              Grafik Tren Jumlah Laporan per Hari
            </h3>
          </div>
          <p className="text-xs text-text-secondary">
            Volume harian laporan pengaduan masuk dan rasio pengaduan berurgensi Kritis
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-primary inline-block" />
            <span className="text-text-secondary">Total Laporan</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-accent inline-block" />
            <span className="text-text-secondary">Kasus Kritis</span>
          </div>
        </div>
      </div>

      
      <div className="pt-4 pb-2">
        <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-[200px] border-b border-border px-2">
          {data.map((item, idx) => {
            const barHeightPct = Math.round((item.total / maxVal) * 100);
            const kritisHeightPct = Math.round((item.kritis / maxVal) * 100);

            return (
              <div key={idx} className="flex flex-col items-center h-full justify-end group relative">
                
                <div className="absolute -top-12 bg-primary text-white text-[10px] font-mono px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 whitespace-nowrap shadow-md">
                  <div className="font-bold">{item.display}</div>
                  <div>Total: {item.total} | Kritis: {item.kritis}</div>
                </div>

                
                <div className="w-full max-w-[36px] bg-bg-base rounded-t overflow-hidden relative flex flex-col justify-end transition-all group-hover:bg-slate-200" style={{ height: `${Math.max(barHeightPct, 8)}%` }}>
                  
                  <div
                    className="w-full bg-primary/80 group-hover:bg-primary transition-all rounded-t relative"
                    style={{ height: '100%' }}
                  >
                    
                    <div
                      className="w-full bg-accent absolute bottom-0 left-0 transition-all"
                      style={{ height: `${item.total > 0 ? (item.kritis / item.total) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                
                <span className="font-mono text-[10px] font-bold text-text-primary mt-1.5">
                  {item.total}
                </span>

                
                <span className="text-[10px] font-medium text-text-secondary truncate max-w-full">
                  {item.display}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      
      <div className="flex items-center justify-between text-[11px] text-text-secondary pt-1">
        <div className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-primary" />
          <span>Periode: 7 Hari Terakhir</span>
        </div>
        <div className="font-mono font-semibold text-primary">
          Rata-rata: {Math.round(data.reduce((a, b) => a + b.total, 0) / data.length)} laporan/hari
        </div>
      </div>
    </div>
  );
}
