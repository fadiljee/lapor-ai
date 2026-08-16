import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Shield, Key, UserCheck, AlertTriangle, User } from 'lucide-react';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('petugas@lapor.go.id');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const demoAccounts = [
    { role: 'Warga Pelapor', email: 'warga@lapor.go.id', nama: 'Budi Warga' },
    { role: 'Petugas Verifikasi', email: 'petugas@lapor.go.id', nama: 'Budi Santoso' },
    { role: 'Admin Dinas PUPR', email: 'dinas.pupr@lapor.go.id', nama: 'Agus PUPR' },
    { role: 'Admin Dinas DLH', email: 'dinas.dlh@lapor.go.id', nama: 'Rini DLH' },
    { role: 'Admin Dinas Dinkes', email: 'dinas.dinkes@lapor.go.id', nama: 'Dr. Sarah Dinkes' },
    { role: 'Admin Dinas Disdukcapil', email: 'dinas.disdukcapil@lapor.go.id', nama: 'Andi Disdukcapil' },
    { role: 'Admin Dinas Dishub', email: 'dinas.dishub@lapor.go.id', nama: 'Tito Dishub' },
    { role: 'Admin Dinas Dinsos', email: 'dinas.dinsos@lapor.go.id', nama: 'Wati Dinsos' },
    { role: 'Admin Satpol PP', email: 'dinas.satpolpp@lapor.go.id', nama: 'Bambang Satpol' },
    { role: 'Admin BPBD', email: 'dinas.bpbd@lapor.go.id', nama: 'Bima BPBD' },
    { role: 'Super Admin Pusat', email: 'admin@lapor.go.id', nama: 'Siti Rahma' }
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.login({ email, password });
      localStorage.setItem('lapor_ai_token', res.access_token);
      localStorage.setItem('lapor_ai_role', res.role);
      localStorage.setItem('lapor_ai_nama', res.nama);
            
      const roleRoutes = {
        warga: '/dashboard/warga',
        petugas: '/dashboard/antrean',
        dinas: '/dashboard/tugas-dinas',
        admin: '/dashboard/admin'
      };
      navigate(roleRoutes[res.role] || '/dashboard/antrean');
    } catch (err) {
      setError(err.message || 'Login gagal. Periksa email dan password.');
    } finally {
      setLoading(false);
    }
  };

  const selectDemoAccount = (acc) => {
    setEmail(acc.email);
    setPassword('password123');
    setError('');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white border border-border rounded-lg p-8 shadow-sm" data-gsap-ignore="true">
        <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-4">
          <Shield className="w-6 h-6" />
        </div>

        <h1 className="font-serif text-2xl font-bold text-text-primary text-center mb-1">
          Masuk Akun LAPOR-AI
        </h1>
        <p className="text-xs text-text-secondary text-center mb-6">
          Akses portal LAPOR-AI untuk pengaduan publik.
        </p>

        
        <div className="bg-slate-50 border border-border p-3.5 rounded mb-6 text-xs">
          <div className="font-bold text-primary mb-1 flex items-center gap-1">
            <UserCheck className="w-4 h-4" />
            <span>Pilih Akun Demo:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-2 max-h-52 overflow-y-auto custom-scrollbar pr-1 content-start" data-lenis-prevent="true">
            {demoAccounts.map((acc) => (
              <button
                key={acc.email}
                type="button"
                onClick={() => selectDemoAccount(acc)}
                className={`text-left p-2 rounded text-[11px] min-h-[44px] flex-shrink-0 flex flex-col justify-center ${
                  email === acc.email
                    ? 'bg-primary text-white ring-1 ring-primary'
                    : 'bg-transparent text-text-primary ring-1 ring-border hover:bg-black/5'
                }`}
              >
                <div className="font-bold truncate w-full">{acc.role}</div>
                <div className="text-[10px] opacity-80 truncate w-full">{acc.nama}</div>
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-accent text-accent text-xs p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
              Email Akun
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/5 border border-border rounded px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
              Kata Sandi
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/5 border border-border rounded px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-primary"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-white py-2.5 rounded font-bold text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            <Key className="w-4 h-4" />
            <span>Masuk</span>
          </button>
        </form>
      </div>
    </div>
  );
}
