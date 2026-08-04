import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Shield, Key, UserCheck, AlertTriangle } from 'lucide-react';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('petugas@lapor.go.id');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const demoAccounts = [
    { role: 'Petugas Triage', email: 'petugas@lapor.go.id', nama: 'Budi Santoso' },
    { role: 'Admin Instansi', email: 'admin@lapor.go.id', nama: 'Siti Rahma' },
    { role: 'Supervisor / Pimpinan', email: 'supervisor@lapor.go.id', nama: 'Drs. Hendra' },
    { role: 'Auditor Compliance', email: 'auditor@lapor.go.id', nama: 'Rina Wijaya, S.H.' }
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
      navigate('/dashboard/antrean');
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
      <div className="bg-white border border-[#D8DAD2] rounded-lg p-8 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-[#1F4E4B] text-white flex items-center justify-center mx-auto mb-4">
          <Shield className="w-6 h-6" />
        </div>

        <h1 className="font-serif text-2xl font-bold text-[#1A2420] text-center mb-1">
          Login Staff & Verifikator
        </h1>
        <p className="text-xs text-[#5B6357] text-center mb-6">
          Akses khusus petugas triage, admin instansi, supervisor, dan auditor LAPOR-AI
        </p>

        {/* Quick Demo Account Selector */}
        <div className="bg-[#EEF1EC] border border-[#D8DAD2] p-3 rounded mb-6 text-xs">
          <div className="font-bold text-[#1F4E4B] mb-1 flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Pilih Akun Demo Penjurian:</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 mt-2">
            {demoAccounts.map((acc) => (
              <button
                key={acc.email}
                type="button"
                onClick={() => selectDemoAccount(acc)}
                className={`text-left p-1.5 rounded border text-[11px] transition-colors ${
                  email === acc.email
                    ? 'bg-[#1F4E4B] text-white border-[#1F4E4B]'
                    : 'bg-white text-[#1A2420] border-[#D8DAD2] hover:bg-[#F3F4EF]'
                }`}
              >
                <div className="font-bold truncate">{acc.role}</div>
                <div className="text-[10px] opacity-80 truncate">{acc.nama}</div>
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-[#FBEAEA] border border-[#B3261E] text-[#B3261E] text-xs p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#1A2420] uppercase tracking-wider mb-1">
              Email Kedinasan
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#F3F4EF] border border-[#D8DAD2] rounded px-3 py-2 text-xs text-[#1A2420] focus:outline-none focus:border-[#1F4E4B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1A2420] uppercase tracking-wider mb-1">
              Kata Sandi
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#F3F4EF] border border-[#D8DAD2] rounded px-3 py-2 text-xs text-[#1A2420] focus:outline-none focus:border-[#1F4E4B]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1F4E4B] hover:bg-[#163A38] text-white py-2.5 rounded font-bold text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            <Key className="w-4 h-4" />
            <span>Masuk ke Dashboard</span>
          </button>
        </form>
      </div>
    </div>
  );
}
