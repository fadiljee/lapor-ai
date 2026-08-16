import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export function ContactPage() {
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
            <div className="bg-white border border-border rounded-lg p-5">
              <div className="w-10 h-10 rounded flex items-center justify-center bg-blue-50 text-accent mb-4">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-text-primary mb-1">Email</h3>
              <p className="text-xs text-text-secondary">bantuan@lapor-ai.web.id</p>
            </div>

            <div className="bg-white border border-border rounded-lg p-5">
              <div className="w-10 h-10 rounded flex items-center justify-center bg-green-50 text-green-600 mb-4">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-text-primary mb-1">Telepon</h3>
              <p className="text-xs text-text-secondary">1500-LAPOR (Jam Kerja)</p>
            </div>

            <div className="bg-white border border-border rounded-lg p-5">
              <div className="w-10 h-10 rounded flex items-center justify-center bg-amber-50 text-amber-600 mb-4">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-text-primary mb-1">Kantor Pusat</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Gedung Pemerintahan Terpadu Lt. 4<br />
                Pangkalpinang, Bangka Belitung
              </p>
            </div>
          </div>

          
          <div className="md:col-span-2 bg-white border border-border rounded-lg p-6 sm:p-8">
            <h2 className="font-display text-xl font-semibold text-text-primary mb-6">
              Kirim Pesan Bantuan
            </h2>
            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); alert("Pesan terkirim. Tim kami akan merespons dalam 1x24 jam."); }}>
              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1.5">Nama Lengkap</label>
                <input 
                  type="text" 
                  className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
                  placeholder="Masukkan nama Anda"
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1.5">Alamat Email</label>
                <input 
                  type="email" 
                  className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
                  placeholder="email@contoh.com"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1.5">Pesan atau Kendala</label>
                <textarea 
                  className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors h-32 resize-y"
                  placeholder="Jelaskan pertanyaan atau kendala teknis yang Anda alami..."
                  required
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="w-full bg-accent hover:bg-accent-hover text-white rounded-md px-4 py-2.5 font-bold text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <Send className="w-4 h-4" />
                Kirim Pesan
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
