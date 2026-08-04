import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Mail, ShieldCheck, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';

export function EmailVerificationPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || 'warga@example.com';
  const ticketId = location.state?.ticketId || 'LP-2026-08-0000412';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendMessage, setResendMessage] = useState('');
  const [cooldown, setCooldown] = useState(60);

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value[0];
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) {
      setError('Masukkan 6 digit kode OTP verifikasi.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.verifyOTP({ email, otp_code: code });
      navigate('/lapor/berhasil', {
        state: {
          report: {
            id: ticketId,
            pelapor_email: email,
            status: 'Terverifikasi AI',
            kategori: 'Pengaduan Warga',
            created_at: 'Baru Saja'
          }
        }
      });
    } catch (err) {
      setError(err.message || 'Kode OTP salah atau kedaluwarsa.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    setError('');
    setResendMessage('');

    try {
      const res = await api.resendOTP({ email });
      setResendMessage('Kode OTP baru telah dikirimkan ke email Anda.');
      setCooldown(res.cooldown_seconds || 60);
    } catch (err) {
      setError(err.message || 'Gagal mengirim ulang OTP.');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white border border-[#D8DAD2] rounded-lg p-8 shadow-sm text-center">
        <div className="w-12 h-12 rounded-full bg-[#EEF1EC] text-[#1F4E4B] flex items-center justify-center mx-auto mb-4 border border-[#D8DAD2]">
          <Mail className="w-6 h-6" />
        </div>

        <h1 className="font-serif text-2xl font-bold text-[#1A2420] mb-2">
          Verifikasi Email Pelapor
        </h1>
        <p className="text-xs text-[#5B6357] mb-6">
          Masukkan 6 digit kode OTP yang telah dikirimkan ke <span className="font-bold text-[#1A2420]">{email}</span>
        </p>

        {error && (
          <div className="bg-[#FBEAEA] border border-[#B3261E] text-[#B3261E] text-xs p-3 rounded mb-4 text-left">
            {error}
          </div>
        )}

        {resendMessage && (
          <div className="bg-[#EEF1EC] border border-[#1F4E4B] text-[#1F4E4B] text-xs p-3 rounded mb-4 text-left">
            {resendMessage}
          </div>
        )}

        {/* OTP Input 6 Digits */}
        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex justify-center gap-2">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                id={`otp-input-${idx}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                className="w-10 h-12 text-center text-lg font-mono font-bold border border-[#D8DAD2] bg-[#F3F4EF] rounded focus:outline-none focus:border-[#1F4E4B] focus:bg-white"
              />
            ))}
          </div>

          <div className="text-[11px] text-[#5B6357] bg-[#F3F4EF] p-2 rounded border border-[#D8DAD2]">
            💡 Kode OTP demo default: <span className="font-mono font-bold text-[#1F4E4B]">123456</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1F4E4B] hover:bg-[#163A38] text-white py-2.5 rounded font-bold text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Verifikasi & Lanjutkan</span>
          </button>
        </form>

        {/* Resend Cooldown Section */}
        <div className="mt-6 pt-4 border-t border-[#D8DAD2]">
          <p className="text-xs text-[#5B6357] mb-2">Tidak menerima kode OTP?</p>
          <button
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1F4E4B] hover:underline disabled:opacity-50 disabled:no-underline"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            {cooldown > 0 ? `Kirim ulang dalam ${cooldown} detik` : 'Kirim Ulang Kode OTP'}
          </button>
        </div>
      </div>
    </div>
  );
}
