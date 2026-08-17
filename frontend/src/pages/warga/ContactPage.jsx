import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

export function ContactPage() {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    pesan: ''
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const res = await api.submitSupportContact(formData);
      setSuccessMessage(res.message || 'Pesan bantuan Anda telah berhasil dikirim. Tim kami akan merespons dalam 1x24 jam.');
      setFormData({ nama: '', email: '', pesan: '' });
    } catch (err) {
      console.error('Error submitting contact form:', err);
      setErrorMessage(err.message || 'Gagal mengirim pesan. Silakan periksa koneksi atau coba beberapa saat lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="max-w-3xl mx-auto">
        
        <div className="text-center mb-12">
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-text-primary mb-4">
            Hubungi Kami
          </h1>
          <p className="text-text-secondary text-sm md:text-base leading-relaxed">
            Punya pertanyaan mengenai sistem LAPOR-AI atau butuh bantuan teknis? Tim dukungan kami siap membantu Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white border border-border rounded-lg p-5 shadow-xs">
              <div className="w-10 h-10 rounded flex items-center justify-center bg-primary/10 text-primary mb-4">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-text-primary mb-1">Email Resmi Support</h3>
              <p className="text-xs text-primary font-mono font-semibold">bantuan@lapor-ai.web.id</p>
            </div>

            <div className="bg-white border border-border rounded-lg p-5 shadow-xs">
              <div className="w-10 h-10 rounded flex items-center justify-center bg-primary/10 text-primary mb-4">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-text-primary mb-1">Telepon & Hotline</h3>
              <p className="text-xs text-text-secondary">1500-LAPOR (Jam Kerja)</p>
            </div>

            <div className="bg-white border border-border rounded-lg p-5 shadow-xs">
              <div className="w-10 h-10 rounded flex items-center justify-center bg-primary/10 text-primary mb-4">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-text-primary mb-1">Kantor Pusat</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Gedung Pemerintahan Terpadu Lt. 4<br />
                Pangkalpinang, Bangka Belitung
              </p>
            </div>
          </div>

          
          <div className="md:col-span-2 bg-white border border-border rounded-lg p-6 sm:p-8 shadow-xs">
            <h2 className="font-display text-xl font-semibold text-text-primary mb-6">
              Kirim Pesan Bantuan
            </h2>

            {successMessage && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md text-xs sm:text-sm flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold mb-1">Pesan Berhasil Terkirim!</p>
                  <p className="text-emerald-700 leading-relaxed">{successMessage}</p>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-md text-xs sm:text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold mb-1">Gagal Mengirim Pesan</p>
                  <p className="text-red-700 leading-relaxed">{errorMessage}</p>
                </div>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1.5">Nama Lengkap</label>
                <input 
                  type="text" 
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  className="w-full bg-black/5 border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
                  placeholder="Masukkan nama lengkap Anda"
                  required
                  disabled={loading}
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1.5">Alamat Email</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-black/5 border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
                  placeholder="email@contoh.com"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1.5">Pesan atau Kendala</label>
                <textarea 
                  name="pesan"
                  value={formData.pesan}
                  onChange={handleChange}
                  className="w-full bg-black/5 border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors h-32 resize-y"
                  placeholder="Jelaskan pertanyaan atau kendala teknis yang Anda alami..."
                  required
                  minLength={10}
                  disabled={loading}
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-dark text-white rounded-md px-4 py-2.5 font-bold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Mengirim Pesan...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Kirim Pesan Bantuan
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
