import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-20 px-4">
      <div className="bg-white border border-border p-12 rounded-lg max-w-lg w-full text-center shadow-sm">
        <div className="flex justify-center mb-6 text-accent">
          <AlertTriangle className="w-16 h-16" />
        </div>
        <h1 className="font-display font-bold text-4xl md:text-5xl text-text-primary mb-4">
          404
        </h1>
        <h2 className="font-semibold text-xl text-text-primary mb-3">
          Halaman Tidak Ditemukan
        </h2>
        <p className="text-text-secondary text-sm md:text-base leading-relaxed mb-8">
          Maaf, halaman yang Anda tuju mungkin telah dihapus, namanya diubah, atau sementara tidak tersedia. Silakan periksa kembali URL yang Anda masukkan.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded font-bold transition-colors shadow-sm text-sm"
        >
          <Home className="w-4 h-4" />
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
