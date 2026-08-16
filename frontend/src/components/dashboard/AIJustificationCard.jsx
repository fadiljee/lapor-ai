import React, { useState } from 'react';
import { Bot, ChevronDown, ChevronUp, AlertTriangle, ShieldCheck, Tag, Globe, Sparkles } from 'lucide-react';
import { UrgencyBadge } from '../common/UrgencyBadge';

export function AIJustificationCard({ report }) {
  const [isOpen, setIsOpen] = useState(true);

  if (!report) return null;

  return (
    <div className="bg-white border border-border rounded-lg p-5 shadow-sm mb-6">
      {/* Header Panel */}
      <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-primary text-white flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
              Panel Analisis AI Klasifikasi & Safeguard
            </h3>
            <p className="text-xs text-text-secondary">
              Multi-Provider Engine · Confidence: {Math.round((report.confidence_score || 0.92) * 100)}%
            </p>
          </div>
        </div>
        <UrgencyBadge level={report.skor_urgensi} />
      </div>

      {/* Mandatory Responsible AI Disclaimer Banner */}
      <div className="bg-amber-50 border-l-4 border-amber-700 p-3 rounded text-xs text-amber-700 mb-4 flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Prinsip Safeguard & Explainable AI:</span> AI menilai urgensi, kategori, dan routing berdasarkan narasi laporan — 
          <span className="font-semibold text-text-primary"> bukan pemutus kebenaran faktual</span>. Verifikasi lapangan tetap merupakan kewenangan petugas.
        </div>
      </div>

      {/* Key AI Metadata Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 text-xs">
        <div className="bg-bg-base p-2.5 rounded border border-border">
          <span className="text-text-secondary block mb-0.5">Rekomendasi Dinas Tujuan:</span>
          <span className="font-bold text-primary">{report.dinas_tujuan}</span>
        </div>
        <div className="bg-bg-base p-2.5 rounded border border-border">
          <span className="text-text-secondary block mb-0.5">Bahasa Terdeteksi:</span>
          <span className="font-semibold text-text-primary flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-primary" />
            {report.bahasa_terdeteksi || 'Bahasa Indonesia'}
          </span>
        </div>
        <div className="bg-bg-base p-2.5 rounded border border-border">
          <span className="text-text-secondary block mb-0.5">Indikasi Duplikat Teknis:</span>
          <span className={`font-semibold ${report.is_duplikat ? 'text-accent' : 'text-text-text-secondary'}`}>
            {report.is_duplikat ? 'Terindikasi Duplikat Teknis' : 'Unik (Bukan Duplikat)'}
          </span>
        </div>
      </div>

      {/* Ringkasan AI */}
      <div className="mb-4">
        <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
          Ringkasan Ekstraksi AI:
        </h4>
        <p className="text-xs text-text-primary bg-bg-base p-3 rounded border border-border italic">
          "{report.ringkasan || 'Tidak ada ringkasan.'}"
        </p>
      </div>

      {/* Collapsible Explainable AI Justification */}
      <div className="border border-border rounded overflow-hidden">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-bg-base hover:bg-border px-4 py-2 text-xs font-semibold text-primary flex items-center justify-between transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Justifikasi / Reasoning LLM Verifikasi (Klik untuk {isOpen ? 'menyembunyikan' : 'membuka'})
          </span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {isOpen && (
          <div className="p-4 bg-white text-xs text-text-primary space-y-2 border-t border-border">
            <p className="leading-relaxed">
              {report.alasan_urgensi || 'Model melakukan evaluasi rubrik urgensi berdasarkan indikator teks masukan warga.'}
            </p>
            {report.entitas && report.entitas.length > 0 && (
              <div className="pt-2 border-t border-border">
                <span className="text-text-secondary font-medium block mb-1">Entitas Kunci Diekstrak:</span>
                <div className="flex flex-wrap gap-1.5">
                  {report.entitas.map((ent, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 bg-bg-base text-primary border border-border px-2 py-0.5 rounded text-[11px]">
                      <Tag className="w-3 h-3" />
                      {ent}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
