import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FilePlus, Search, LogIn, LayoutDashboard, Menu, X, Info, LogOut, Shield } from 'lucide-react';
import { LogoutModal } from './LogoutModal';

import logo from '../../assets/lapor-ai.png';

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('lapor_ai_token');
  const userRole = localStorage.getItem('lapor_ai_role') || 'warga';
  const userName = localStorage.getItem('lapor_ai_nama') || 'Pengguna';
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const isActive = (path) => location.pathname === path;
  const isDashboardRoute = location.pathname.startsWith('/dashboard');

  const navLinks = [
    { to: '/tentang-lapor-ai', icon: <Info className="w-4 h-4" />, label: 'Tentang LAPOR-AI' },
  ];

  const handleLogoutConfirm = () => {
    localStorage.removeItem('lapor_ai_token');
    localStorage.removeItem('lapor_ai_role');
    localStorage.removeItem('lapor_ai_nama');
    setLogoutModalOpen(false);
    navigate('/masuk');
  };

  const getRoleLabel = (role) => {
    const roleTitles = {
      warga: 'Warga Pelapor',
      petugas: 'Petugas Verifikasi',
      dinas: 'Admin Dinas',
      admin: 'Super Admin Pusat'
    };
    return roleTitles[role] || role;
  };

  const getDashboardTarget = () => {
    const roleRedirectMap = {
      warga: '/dashboard/warga',
      petugas: '/dashboard/antrean',
      dinas: '/dashboard/tugas-dinas',
      admin: '/dashboard/routing'
    };
    return roleRedirectMap[userRole] || '/dashboard/antrean';
  };

  return (
    <>
      <header className="bg-primary text-white border-b border-primary-dark sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

          
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <img src={logo} alt="LAPOR-AI Logo" className="h-10 w-auto rounded-md object-contain" />
          </Link>

          
          <nav className="hidden md:flex items-center gap-1">
            
            {!isDashboardRoute && (
              <>
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors relative ${
                      isActive(link.to)
                        ? 'text-white after:absolute after:bottom-0 after:left-3 after:right-3 after:h-[2px] after:bg-accent after:rounded-full'
                        : 'text-border hover:text-white hover:bg-primary-dark'
                    }`}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </Link>
                ))}

                {token ? (
                  <Link
                    to={getDashboardTarget()}
                    className="ml-3 bg-white hover:bg-bg text-primary px-3.5 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard ({getRoleLabel(userRole)})</span>
                  </Link>
                ) : (
                  <Link
                    to="/masuk"
                    className="ml-3 border border-border hover:bg-white hover:text-primary text-white px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Masuk</span>
                  </Link>
                )}
              </>
            )}

            
            {isDashboardRoute && (
              <div className="flex items-center gap-3">
                <div className="bg-primary-dark border border-border/20 px-3 py-1 rounded text-xs flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-border" />
                  <span className="text-white font-bold">{userName}</span>
                  <span className="bg-accent text-white text-[10px] uppercase px-1.5 py-0.5 rounded font-mono font-semibold">
                    {getRoleLabel(userRole)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setLogoutModalOpen(true)}
                  className="bg-accent hover:opacity-90 text-white px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                  title="Keluar Sesi"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar Sesi</span>
                </button>
              </div>
            )}
          </nav>

          
          <button
            className="md:hidden p-2 rounded hover:bg-primary-dark transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        
        {mobileOpen && (
          <div className="md:hidden border-t border-primary-dark bg-primary px-4 pb-4 pt-2 space-y-2">
            {!isDashboardRoute && (
              <>
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2 rounded text-sm font-semibold transition-colors ${
                      isActive(link.to)
                        ? 'bg-primary-dark text-white border-l-2 border-accent'
                        : 'text-border hover:bg-primary-dark hover:text-white'
                    }`}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                ))}
                <div className="pt-2 border-t border-primary-dark">
                  {token ? (
                    <Link
                      to={getDashboardTarget()}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded text-sm font-bold bg-white text-primary"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard ({getRoleLabel(userRole)})
                    </Link>
                  ) : (
                    <Link
                      to="/masuk"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded text-sm font-semibold border border-border text-white hover:bg-white hover:text-primary"
                    >
                      <LogIn className="w-4 h-4" />
                      Masuk
                    </Link>
                  )}
                </div>
              </>
            )}

            {isDashboardRoute && (
              <div className="space-y-2">
                <div className="bg-primary-dark p-3 rounded text-xs text-white border border-border/20">
                  <div className="font-bold">{userName}</div>
                  <div className="text-[10px] text-border uppercase mt-0.5">Role: {getRoleLabel(userRole)}</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    setLogoutModalOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded text-sm font-bold bg-accent hover:opacity-90 text-white"
                >
                  <LogOut className="w-4 h-4" />
                  Keluar Sesi
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      
      <LogoutModal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
      />
    </>
  );
}
