import React, { useState } from 'react';
import { Bot, ChevronDown, ChevronUp, AlertTriangle, ShieldCheck, Tag, Globe, Sparkles } from 'lucide-react';
import { UrgencyBadge } from '../common/UrgencyBadge';

export function AIJustificationCard({ report }) {
  const [isOpen, setIsOpen] = useState(true);

  if (!report) return null;

  return (
    <div className="bg-white border border-[#D8DAD2] rounded-lg p-5 shadow-sm mb-6">
      {/* Header Panel */}
      <div className="flex items-center justify-between border-b border-[#D8DAD2] pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-[#1F4E4B] text-white flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#1A2420] flex items-center gap-2">
              Panel Analisis AI Triage & Safeguard
            </h3>
            <p className="text-xs text-[#5B6357]">
              Multi-Provider Engine · Confidence: {Math.round((report.confidence_score || 0.92) * 100)}%
            </p>
          </div>
        </div>
        <UrgencyBadge level={report.skor_urgensi} />
      </div>

      {/* Mandatory Responsible AI Disclaimer Banner */}
      <div className="bg-[#FCF1DC] border-l-4 border-[#94570A] p-3 rounded text-xs text-[#94570A] mb-4 flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Prinsip Safeguard & Explainable AI:</span> AI menilai urgensi, kategori, dan routing berdasarkan narasi laporan — 
          <span className="font-semibold text-[#1A2420]"> bukan pemutus kebenaran faktual</span>. Verifikasi lapangan tetap merupakan kewenangan petugas.
        </div>
      </div>

      {/* Key AI Metadata Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 text-xs">
        <div className="bg-[#F3F4EF] p-2.5 rounded border border-[#D8DAD2]">
          <span className="text-[#5B6357] block mb-0.5">Rekomendasi Dinas Tujuan:</span>
          <span className="font-bold text-[#1F4E4B]">{report.dinas_tujuan}</span>
        </div>
        <div className="bg-[#F3F4EF] p-2.5 rounded border border-[#D8DAD2]">
          <span className="text-[#5B6357] block mb-0.5">Bahasa Terdeteksi:</span>
          <span className="font-semibold text-[#1A2420] flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-[#1F4E4B]" />
            {report.bahasa_terdeteksi || 'Bahasa Indonesia'}
          </span>
        </div>
        <div className="bg-[#F3F4EF] p-2.5 rounded border border-[#D8DAD2]">
          <span className="text-[#5B6357] block mb-0.5">Indikasi Duplikat Teknis:</span>
          <span className={`font-semibold ${report.is_duplikat ? 'text-[#B3261E]' : 'text-[#4B564D]'}`}>
            {report.is_duplikat ? 'Terindikasi Duplikat Teknis' : 'Unik (Bukan Duplikat)'}
          </span>
        </div>
      </div>

      {/* Ringkasan AI */}
      <div className="mb-4">
        <h4 className="text-xs font-bold text-[#1A2420] uppercase tracking-wider mb-1">
          Ringkasan Ekstraksi AI:
        </h4>
        <p className="text-xs text-[#1A2420] bg-[#F3F4EF] p-3 rounded border border-[#D8DAD2] italic">
          "{report.ringkasan || 'Tidak ada ringkasan.'}"
        </p>
      </div>

      {/* Collapsible Explainable AI Justification */}
      <div className="border border-[#D8DAD2] rounded overflow-hidden">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-[#F3F4EF] hover:bg-[#D8DAD2] px-4 py-2 text-xs font-semibold text-[#1F4E4B] flex items-center justify-between transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Justifikasi / Reasoning LLM Triage (Klik untuk {isOpen ? 'menyembunyikan' : 'membuka'})
          </span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {isOpen && (
          <div className="p-4 bg-white text-xs text-[#1A2420] space-y-2 border-t border-[#D8DAD2]">
            <p className="leading-relaxed">
              {report.alasan_urgensi || 'Model melakukan evaluasi rubrik urgensi berdasarkan indikator teks masukan warga.'}
            </p>
            {report.entitas && report.entitas.length > 0 && (
              <div className="pt-2 border-t border-[#D8DAD2]">
                <span className="text-[#5B6357] font-medium block mb-1">Entitas Kunci Diekstrak:</span>
                <div className="flex flex-wrap gap-1.5">
                  {report.entitas.map((ent, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 bg-[#EEF1EC] text-[#1F4E4B] border border-[#D8DAD2] px-2 py-0.5 rounded text-[11px]">
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
