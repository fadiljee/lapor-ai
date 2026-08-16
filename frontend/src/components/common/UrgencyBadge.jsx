import React from 'react';

/**
 * UrgencyBadge — Badge status urgensi AI.
 * Palet warna: kritis=merah garuda, tinggi=soga/ochre,
 * sedang=hijau lumut, rendah=indigo pudar.
 * Font mono 12px uppercase per spek komponen.
 */
export function UrgencyBadge({ level }) {
  const normalized = (level || 'Rendah').toUpperCase();

  const styles = {
    KRITIS: {
      bg: 'bg-urgensi-kritis-bg',
      border: 'border-urgensi-kritis',
      text: 'text-urgensi-kritis',
      dot: 'bg-urgensi-kritis',
      label: 'KRITIS'
    },
    TINGGI: {
      bg: 'bg-urgensi-tinggi-bg',
      border: 'border-urgensi-tinggi',
      text: 'text-urgensi-tinggi',
      dot: 'bg-urgensi-tinggi',
      label: 'TINGGI'
    },
    SEDANG: {
      bg: 'bg-urgensi-sedang-bg',
      border: 'border-urgensi-sedang',
      text: 'text-urgensi-sedang',
      dot: 'bg-urgensi-sedang',
      label: 'SEDANG'
    },
    RENDAH: {
      bg: 'bg-urgensi-rendah-bg',
      border: 'border-urgensi-rendah',
      text: 'text-urgensi-rendah',
      dot: 'bg-urgensi-rendah',
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
