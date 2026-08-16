import React from 'react';
import { Copy, Check, FileText } from 'lucide-react';
import { AiStampCap } from './AiStampCap';



function getStampVariant(status) {
  if (!status) return 'waiting';
  const s = status.toLowerCase();
  if (s.includes('kritis') || s.includes('eskalasi')) return 'critical';
  if (s.includes('terverifikasi')) return 'verified';
  if (s.includes('selesai') || s.includes('closed') || s.includes('resolved')) return 'verified';
  if (s.includes('menganalisis') || s.includes('menunggu verifikasi')) return 'analyzing';
  return 'waiting';
}

export function TicketStub({ ticketId, status, createdAt, pelaporEmail, isAnonim, category }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (ticketId) {
      navigator.clipboard.writeText(ticketId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const stampVariant = getStampVariant(status);

  return (
    <div className="w-full max-w-md mx-auto bg-white border border-border rounded-lg overflow-visible my-4" style={{ boxShadow: '0 1px 2px rgba(0,0,0,.06)' }}>

      
      <div className="bg-primary text-white px-5 py-3 flex items-center justify-between rounded-t-lg">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-slate-300" />
          <span className="text-[10px] font-mono-ticket font-semibold uppercase tracking-widest text-slate-300">
            LAPOR-AI · Tanda Terima Pengaduan
          </span>
        </div>
        <span className="text-[10px] bg-accent text-white px-2 py-0.5 rounded font-bold uppercase tracking-widest font-mono-ticket">
          RESMI
        </span>
      </div>

      
      <div className="px-6 pt-5 pb-4">
        <div className="text-[10px] text-text-secondary font-mono-ticket uppercase tracking-widest mb-1">
          Nomor Tiket Laporan
        </div>

        
        <div className="flex items-center justify-between gap-2 bg-bg-base p-3 rounded border border-border mb-5">
          <span className="font-mono-ticket text-lg font-bold text-text-text-primary tracking-wider">
            {ticketId || 'LPR-2026-0088231'}
          </span>
          <button
            onClick={handleCopy}
            className="p-1.5 hover:bg-slate-300 rounded transition-colors text-primary"
            title="Salin Nomor Tiket"
          >
            {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        
        <div className="ticket-perforation my-4 mx-2" />

        
        <div className="flex items-start justify-between gap-3 mt-5">
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-[11px] flex-1">
            <div>
              <span className="text-text-secondary block mb-0.5">Status Terkini:</span>
              <span className="font-semibold text-primary text-xs">{status || 'Menunggu Verifikasi AI'}</span>
            </div>
            <div>
              <span className="text-text-secondary block mb-0.5">Kategori:</span>
              <span className="font-semibold text-text-text-primary text-xs">{category || 'Umum'}</span>
            </div>
            <div>
              <span className="text-text-secondary block mb-0.5">Waktu Pengajuan:</span>
              <span className="font-mono-ticket text-text-text-primary">{createdAt || '3 Agu 2026, 14:02'}</span>
            </div>
            <div>
              <span className="text-text-secondary block mb-0.5">Tipe Pelapor:</span>
              <span className="font-medium text-text-text-primary">
                {isAnonim ? 'Mode Anonim' : pelaporEmail ? pelaporEmail : 'Terverifikasi Email'}
              </span>
            </div>
          </div>

          
          <div className="shrink-0">
            <AiStampCap variant={stampVariant} size={64} showLabel={false} />
          </div>
        </div>
      </div>
    </div>
  );
}
