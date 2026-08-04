import React from 'react';

/**
 * AiStampCap — "Cap AI" signature component (PRD §3).
 * Badge bulat bergaya stempel dinas, dirotasi 3-5°.
 * SELALU disertai sub-label "Rekomendasi AI, keputusan akhir oleh petugas"
 * untuk menegakkan prinsip human-in-the-loop (PRD §10).
 *
 * Varian (variant prop):
 *   'verified'  → TERVERIFIKASI AI  (navy)
 *   'waiting'   → MENUNGGU PETUGAS  (ochre/soga)
 *   'critical'  → KRITIS — ESKALASI (merah garuda)
 *   'analyzing' → MENGANALISIS...   (muted)
 */

const VARIANTS = {
  verified: {
    color: '#1F3A52',       /* navy-dinas */
    bgColor: '#E7ECEF',
    line1: 'TERVERIFIKASI',
    line2: 'AI',
    rotate: '-4deg',
  },
  waiting: {
    color: '#B5732A',       /* soga/ochre */
    bgColor: '#FDF3E0',
    line1: 'MENUNGGU',
    line2: 'PETUGAS',
    rotate: '3deg',
  },
  critical: {
    color: '#A32A21',       /* merah garuda */
    bgColor: '#FAEAEA',
    line1: 'KRITIS',
    line2: 'ESKALASI',
    rotate: '-5deg',
  },
  analyzing: {
    color: '#6B6862',       /* muted */
    bgColor: '#F4F3EE',
    line1: 'MENGANA',
    line2: 'LISIS...',
    rotate: '4deg',
  },
};

export function AiStampCap({ variant = 'verified', size = 72, showLabel = true, className = '' }) {
  const v = VARIANTS[variant] || VARIANTS.verified;

  return (
    <div className={`inline-flex flex-col items-center gap-1.5 ${className}`}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          border: `1.5px solid ${v.color}`,
          backgroundColor: v.bgColor,
          transform: `rotate(${v.rotate})`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: `${Math.round(size * 0.115)}px`,
          fontWeight: 600,
          color: v.color,
          letterSpacing: '0.05em',
          textAlign: 'center',
          lineHeight: 1.15,
          userSelect: 'none',
        }}
        aria-label={`${v.line1} ${v.line2}`}
        role="img"
      >
        <span>{v.line1}</span>
        <span
          style={{
            display: 'block',
            width: '80%',
            borderTop: `1px solid ${v.color}`,
            margin: '2px 0',
            opacity: 0.5,
          }}
        />
        <span>{v.line2}</span>
      </div>

      {showLabel && (
        <p
          className="text-center leading-tight"
          style={{
            fontSize: 9,
            color: '#6B6862',
            fontFamily: 'IBM Plex Mono, monospace',
            letterSpacing: '0.02em',
            maxWidth: size + 8,
          }}
        >
          Rekomendasi AI,<br />keputusan akhir oleh petugas
        </p>
      )}
    </div>
  );
}
