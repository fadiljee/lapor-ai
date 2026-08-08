import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-primary-dark text-border py-12 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between gap-12">

        {/* Brand */}
        <div className="max-w-sm">
          <h4 className="font-display font-bold text-white text-lg mb-4 tracking-wide">LAPOR-AI</h4>
          <p className="text-text-secondary leading-relaxed">
            Platform resmi pelayanan pengaduan warga berbasis
            Kecerdasan Buatan.
          </p>
        </div>

        <div className="flex gap-16">
          {/* Lembaga Terkait */}
          <div>
            <h4 className="font-mono-ticket font-bold text-white text-xs uppercase tracking-wider mb-4">Lembaga Terkait</h4>
            <ul className="space-y-2.5 text-border">
              <li><Link to="#" className="hover:text-white transition-colors">Kementerian PANRB</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Kantor Staf Presiden</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Ombudsman RI</Link></li>
            </ul>
          </div>

          {/* Dukungan */}
          <div>
            <h4 className="font-mono-ticket font-bold text-white text-xs uppercase tracking-wider mb-4">Dukungan</h4>
            <ul className="space-y-2.5 text-border">
              <li><Link to="#" className="hover:text-white transition-colors">Panduan Warga</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Keamanan Data</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Hubungi Kami</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-12 border-t border-border/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-text-secondary">
        <div className="font-mono-ticket tracking-wider uppercase">LAPOR-AI COMPLIANT · © 2026 REPUBLIK INDONESIA</div>
        <div className="mt-2 sm:mt-0">Sistem ini diawasi oleh petugas dinas dan mematuhi regulasi perlindungan data pribadi.</div>
      </div>
    </footer>
  );
}
