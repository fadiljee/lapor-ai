import React from 'react';
import { LogOut, AlertTriangle } from 'lucide-react';

export function LogoutModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white border border-border rounded-lg max-w-sm w-full p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-50 text-accent flex items-center justify-center shrink-0">
            <LogOut className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base text-text-primary">
              Konfirmasi Keluar Sesi
            </h3>
            <p className="text-xs text-text-secondary mt-0.5">
              Apakah Anda yakin ingin keluar dari akun LAPOR-AI?
            </p>
          </div>
        </div>

        <div className="bg-bg-base p-3 rounded text-[11px] text-text-secondary flex items-start gap-2 border border-border">
          <AlertTriangle className="w-4 h-4 text-text-amber-700 shrink-0 mt-0.5" />
          <span>Sesi login Anda akan dihapus dari peramban ini. Anda dapat masuk kembali kapan saja.</span>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-bg-base hover:bg-border text-text-primary text-xs font-bold rounded transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 bg-accent hover:bg-accent-hover text-white text-xs font-bold rounded transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Ya, Keluar Sesi</span>
          </button>
        </div>
      </div>
    </div>
  );
}
