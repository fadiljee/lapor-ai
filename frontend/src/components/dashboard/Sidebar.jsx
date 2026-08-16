import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ListFilter, MapPin, Clock, BarChart3, ShieldAlert, LogOut, FilePlus, Search, Home, Users, Inbox } from 'lucide-react';
import { LogoutModal } from '../common/LogoutModal';

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const role = localStorage.getItem('lapor_ai_role') || 'warga';
  const name = localStorage.getItem('lapor_ai_nama') || 'Pengguna LAPOR-AI';

  const handleLogoutConfirm = () => {
    localStorage.removeItem('lapor_ai_token');
    localStorage.removeItem('lapor_ai_role');
    localStorage.removeItem('lapor_ai_nama');
    setLogoutModalOpen(false);
    navigate('/masuk');
  };

  const isActive = (path) => location.pathname === path;

  const allNavItems = [
    { path: '/dashboard/warga', label: 'Ringkasan Laporan Saya', icon: Home, roles: ['warga'] },
    { path: '/dashboard/lapor', label: 'Ajukan Laporan Pengaduan', icon: FilePlus, roles: ['warga'] },
    { path: '/dashboard/lacak', label: 'Lacak Tiket Laporan', icon: Search, roles: ['warga'] },

    { path: '/dashboard/antrean', label: 'Antrean Verifikasi AI', icon: ListFilter, roles: ['petugas'] },
    { path: '/dashboard/tugas-dinas', label: 'Daftar Tugas Dinas', icon: Inbox, roles: ['dinas'] },
    
    { path: '/dashboard/routing', label: 'Routing Unit Kerja / Dinas', icon: MapPin, roles: ['admin'] },
    { path: '/dashboard/sla', label: 'Manajemen SLA Operasional', icon: Clock, roles: ['admin'] },
    { path: '/dashboard/users', label: 'Manajemen User', icon: Users, roles: ['admin'] },
    { path: '/dashboard/analitik', label: 'Analitik Agregat & Hotspot', icon: BarChart3, roles: ['admin'] },
    { path: '/dashboard/audit-log', label: 'Log Transparansi Audit AI', icon: ShieldAlert, roles: ['admin'] },
  ];

  
  const allowedNavItems = allNavItems.filter((item) => item.roles.includes(role));

  const roleTitles = {
    warga: 'Warga Pelapor',
    petugas: 'Petugas Verifikasi',
    dinas: 'Admin Dinas',
    admin: 'Super Admin Pusat'
  };

  return (
    <>
      <aside className="w-full md:w-[220px] bg-white border-r border-border shrink-0 md:h-[calc(100vh-4rem)] md:sticky md:top-16 overflow-y-auto p-4 flex flex-col justify-between">
        <div>
          
          <div className="bg-black/5 p-3.5 rounded border border-border mb-6 flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0">
              {name.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-text-primary truncate">{name}</div>
              <div className="text-[10px] text-accent font-bold uppercase tracking-wider truncate">
                Role: {roleTitles[role] || role}
              </div>
            </div>
          </div>

          
          <div className="text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-2 px-2">
            Menu Navigasi
          </div>
          <nav className="space-y-1">
            {allowedNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded text-xs transition-colors ${
                    active
                      ? 'bg-black/5 font-bold text-text-primary'
                      : 'text-text-primary hover:bg-black/5'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        
        <div className="pt-4 border-t border-border mt-6">
          <button
            type="button"
            onClick={() => setLogoutModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-accent bg-transparent hover:bg-accent/10 border border-accent rounded transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar Sesi</span>
          </button>
        </div>
      </aside>

      <LogoutModal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
      />
    </>
  );
}
