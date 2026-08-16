import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { TicketStub } from '../../components/common/TicketStub';
import { AiStampCap } from '../../components/common/AiStampCap';
import { CheckCircle2, Search, FilePlus } from 'lucide-react';

export function ReportSuccessPage() {
  const location = useLocation();
  const report = location.state?.report || {
    id: 'LPR-2026-0088231',
    status: 'Menunggu Verifikasi AI',
    created_at: '3 Agu 2026, 14:02',
    kategori: 'Infrastruktur',
    pelapor_email: 'warga@example.com',
    is_anonim: false
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">

      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-full bg-green-50 text-primary flex items-center justify-center mx-auto mb-4 border border-border">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <h1 className="font-display text-3xl font-semibold text-text-text-primary mb-2">
          Pengaduan Berhasil Diterima
        </h1>
        <p className="text-xs text-text-secondary max-w-sm mx-auto">
          Laporan Anda telah masuk ke sistem LAPOR-AI dan sedang diproses melalui pipeline verifikasi otomatis. Simpan tanda terima di bawah ini.
        </p>
      </div>

      {/* AI Stamp + Ticket — side by side on sm+ */}
      <div className="flex flex-col sm:flex-row items-start justify-center gap-4 mb-8">
        {/* Cap AI */}
        <div className="flex flex-col items-center justify-center sm:pt-6">
          <AiStampCap variant="analyzing" size={80} showLabel={true} />
        </div>

        {/* Ticket Stub */}
        <div className="flex-1 w-full">
          <TicketStub
            ticketId={report.id}
            status={report.status}
            createdAt={report.created_at}
            pelaporEmail={report.pelapor_email}
            isAnonim={report.is_anonim}
            category={report.kategori}
          />
        </div>
      </div>

      {/* Note */}
      <p className="text-center text-[11px] text-text-secondary mb-6 italic">
        Nomor tiket di atas adalah satu-satunya cara melacak status laporan Anda. Simpan baik-baik.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-3">
        <Link
          to="/dashboard/lacak"
          className="bg-accent hover:bg-accent-hover text-white px-5 py-2.5 rounded font-bold text-xs flex items-center justify-center gap-2 transition-colors"
        >
          <Search className="w-4 h-4" />
          Lacak Status Tiket Laporan
        </Link>
        <Link
          to="/dashboard/lapor"
          className="border-[1.5px] border-primary text-primary hover:bg-slate-100 px-5 py-2.5 rounded font-bold text-xs flex items-center justify-center gap-2 transition-colors"
        >
          <FilePlus className="w-4 h-4" />
          Buat Pengaduan Lainnya
        </Link>
      </div>
    </div>
  );
}
