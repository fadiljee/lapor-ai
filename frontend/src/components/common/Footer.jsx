import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#1A1D1F] text-[#D8D4C9] border-t border-[#2E3135] py-10 text-xs mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Brand */}
        <div>
          <h4 className="font-display font-bold text-white text-sm mb-3">LAPOR-AI</h4>
          <p className="text-[#6B6862] leading-relaxed">
            Platform pengaduan warga terintegrasi Large Language Model (LLM) untuk triage urgensi,
            deteksi duplikasi teknis, dan routing dinas otomatis. Memproses Bahasa Indonesia dan Bahasa Bangka.
          </p>
          <p className="text-[#6B6862] mt-3 italic leading-relaxed">
            LAPOR-AI adalah pengembangan tambahan di atas SP4N-LAPOR! dan saat ini berstatus prototipe;
            pemetaan ke dinas tujuan bersifat konseptual sampai instansi pilot ditetapkan.
          </p>
        </div>

        {/* Safeguards */}
        <div>
          <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Komitmen Safeguards</h4>
          <ul className="space-y-2 text-[#6B6862]">
            <li className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#1F3A52] shrink-0 mt-0.5" />
              <span>PII Masking Layer — Anonimisasi NIK, nomor HP, dan email sebelum diproses AI</span>
            </li>
            <li className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#1F3A52] shrink-0 mt-0.5" />
              <span>Human-in-the-Loop — Setiap rekomendasi AI harus dikonfirmasi petugas</span>
            </li>
            <li className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#1F3A52] shrink-0 mt-0.5" />
              <span>Guardrails Prompt Injection Defense</span>
            </li>
          </ul>
        </div>

        {/* Links + Competition */}
        <div>
          <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Navigasi</h4>
          <ul className="space-y-1.5 text-[#6B6862]">
            <li><Link to="/" className="hover:text-white transition-colors">Beranda</Link></li>
            <li><Link to="/lapor" className="hover:text-white transition-colors">Ajukan Laporan</Link></li>
            <li><Link to="/lacak" className="hover:text-white transition-colors">Lacak Tiket</Link></li>
            <li><Link to="/tentang-lapor-ai" className="hover:text-white transition-colors">Tentang LAPOR-AI</Link></li>
            <li><Link to="/masuk" className="hover:text-white transition-colors">Masuk Petugas</Link></li>
          </ul>
          <div className="mt-4 pt-4 border-t border-[#2E3135]">
            <p className="text-[#6B6862] leading-relaxed">
              Dikembangkan untuk FTI FEST 2026 — Kategori PIXEL (Protection Information Exploration in the Digital Era).
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 mt-6 border-t border-[#2E3135]/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#6B6862]">
        <div>© 2026 LAPOR-AI Team. Hak Cipta Dilindungi Undang-Undang.</div>
        <div className="mt-2 sm:mt-0 font-mono-ticket">v1.5 PRD · Anti-Gradient UI Specification</div>
      </div>
    </footer>
  );
}
