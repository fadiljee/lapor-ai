import React from 'react';

/**
 * UrgencyBadge — Badge status urgensi AI.
 * Palet warna dari PRD §2.1: kritis=merah garuda, tinggi=soga/ochre,
 * sedang=hijau lumut, rendah=indigo pudar.
 * Font mono 12px uppercase per spek komponen §5.
 */
export function UrgencyBadge({ level }) {
  const normalized = (level || 'Rendah').toUpperCase();

  const styles = {
    KRITIS: {
      bg: 'bg-[#FAEAEA]',
      border: 'border-[#A32A21]',
      text: 'text-[#A32A21]',
      dot: 'bg-[#A32A21]',
      label: 'KRITIS'
    },
    TINGGI: {
      bg: 'bg-[#FDF3E0]',
      border: 'border-[#B5732A]',
      text: 'text-[#B5732A]',
      dot: 'bg-[#B5732A]',
      label: 'TINGGI'
    },
    SEDANG: {
      bg: 'bg-[#EDF2EE]',
      border: 'border-[#4B6E4F]',
      text: 'text-[#4B6E4F]',
      dot: 'bg-[#4B6E4F]',
      label: 'SEDANG'
    },
    RENDAH: {
      bg: 'bg-[#E8EDF2]',
      border: 'border-[#3E5C74]',
      text: 'text-[#3E5C74]',
      dot: 'bg-[#3E5C74]',
      label: 'RENDAH'
    }
  };

  const style = styles[normalized] || styles.RENDAH;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border font-mono-ticket text-[11px] font-semibold uppercase tracking-wider ${style.bg} ${style.border} ${style.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />
      {style.label}
    </span>
  );
}
