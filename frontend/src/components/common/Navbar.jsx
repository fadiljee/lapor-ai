import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FilePlus, Search, LogIn, LayoutDashboard, Menu, X, Info } from 'lucide-react';

export function Navbar() {
  const location = useLocation();
  const token = localStorage.getItem('lapor_ai_token');
  const userRole = localStorage.getItem('lapor_ai_role');
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: '/lapor', icon: <FilePlus className="w-4 h-4" />, label: 'Ajukan Laporan' },
    { to: '/lacak', icon: <Search className="w-4 h-4" />, label: 'Lacak Tiket' },
    { to: '/tentang-lapor-ai', icon: <Info className="w-4 h-4" />, label: 'Tentang LAPOR-AI' },
  ];

  return (
    <header className="bg-[#1F3A52] text-white border-b border-[#162C3E] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-9 h-9 rounded bg-[#A32A21] text-white flex items-center justify-center font-display font-bold text-lg">
            L
          </div>
          <div>
            <span className="font-display font-bold text-lg tracking-tight block leading-none text-white">
              LAPOR-AI
            </span>
            <span className="text-[10px] text-[#D8D4C9] font-mono-ticket tracking-wider block mt-0.5 uppercase">
              Sistem Triage Pengaduan
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors relative ${
                isActive(link.to)
                  ? 'text-white after:absolute after:bottom-0 after:left-3 after:right-3 after:h-[2px] after:bg-[#A32A21] after:rounded-full'
                  : 'text-[#D8D4C9] hover:text-white hover:bg-[#162C3E]'
              }`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}

          {token ? (
            <Link
              to="/dashboard/antrean"
              className="ml-3 bg-[#A32A21] hover:bg-[#7A1F19] text-white px-3.5 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard ({userRole || 'petugas'})</span>
            </Link>
          ) : (
            <Link
              to="/masuk"
              className="ml-3 border border-[#D8D4C9] hover:bg-white hover:text-[#1F3A52] text-white px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk Petugas</span>
            </Link>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 rounded hover:bg-[#162C3E] transition-colors"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#162C3E] bg-[#1F3A52] px-4 pb-4 pt-2 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded text-sm font-semibold transition-colors ${
                isActive(link.to)
                  ? 'bg-[#162C3E] text-white border-l-2 border-[#A32A21]'
                  : 'text-[#D8D4C9] hover:bg-[#162C3E] hover:text-white'
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-[#162C3E]">
            {token ? (
              <Link
                to="/dashboard/antrean"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded text-sm font-bold bg-[#A32A21] text-white"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard ({userRole || 'petugas'})
              </Link>
            ) : (
              <Link
                to="/masuk"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded text-sm font-semibold border border-[#D8D4C9] text-white"
              >
                <LogIn className="w-4 h-4" />
                Masuk Petugas
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
