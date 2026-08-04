import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ListFilter, MapPin, Clock, BarChart3, ShieldAlert, LogOut, UserCheck } from 'lucide-react';

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const role = localStorage.getItem('lapor_ai_role') || 'petugas';
  const name = localStorage.getItem('lapor_ai_nama') || 'Petugas Staff';

  const handleLogout = () => {
    localStorage.removeItem('lapor_ai_token');
    localStorage.removeItem('lapor_ai_role');
    localStorage.removeItem('lapor_ai_nama');
    navigate('/masuk');
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/dashboard/antrean', label: 'Antrean Triage', icon: ListFilter, roles: ['petugas', 'admin', 'supervisor', 'auditor'] },
    { path: '/dashboard/routing', label: 'Routing Dinas', icon: MapPin, roles: ['admin'] },
    { path: '/dashboard/sla', label: 'Manajemen SLA', icon: Clock, roles: ['admin'] },
    { path: '/dashboard/analitik', label: 'Analitik KPI', icon: BarChart3, roles: ['supervisor', 'admin'] },
    { path: '/dashboard/audit-log', label: 'Log Audit AI', icon: ShieldAlert, roles: ['auditor', 'admin', 'supervisor'] },
  ];

  return (
    <aside className="w-full md:w-64 bg-white border-r border-[#D8DAD2] shrink-0 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between">
      <div>
        {/* User Info Card */}
        <div className="bg-[#F3F4EF] p-3 rounded border border-[#D8DAD2] mb-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#1F4E4B] text-white flex items-center justify-center font-bold text-sm shrink-0">
            {name.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <div className="text-xs font-bold text-[#1A2420] truncate">{name}</div>
            <div className="text-[10px] text-[#A23B2E] font-bold uppercase tracking-wider">
              Role: {role}
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="text-[10px] font-bold uppercase tracking-widest text-[#5B6357] mb-2 px-2">
          Menu Navigasi Staff
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2.5 px-3 py-2 rounded text-xs font-semibold transition-colors ${
                  active
                    ? 'bg-[#1F4E4B] text-white'
                    : 'text-[#1A2420] hover:bg-[#F3F4EF]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout button */}
      <div className="pt-4 border-t border-[#D8DAD2]">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-[#B3261E] bg-[#FBEAEA] hover:bg-[#B3261E] hover:text-white border border-[#B3261E] rounded transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar Sesi</span>
        </button>
      </div>
    </aside>
  );
}
