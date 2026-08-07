import React from 'react';

export function PublicStatsPage() {
  return (
    <div style={{ backgroundColor: '#ECEADF' }} className="min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-5 md:px-10 pt-12">
        {/* Header */}
        <p
          style={{
            fontFamily: '"Inter", sans-serif',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#6B6659',
            marginBottom: '12px',
          }}
        >
          TRANSPARANSI KINERJA PELAYANAN PUBLIK
        </p>

        <h1
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: '36px',
            fontWeight: 700,
            color: '#1A1A18',
            marginBottom: '12px',
          }}
        >
          Statistik Pengaduan Nasional
        </h1>

        <p
          style={{
            fontFamily: '"Inter", sans-serif',
            fontSize: '15px',
            color: '#6B6659',
            marginBottom: '40px',
            maxWidth: '680px',
          }}
        >
          Data agregat riil dari seluruh pengaduan warga yang diterima, diklasifikasi secara otomatis oleh sistem AI, serta ditindaklanjuti langsung oleh dinas terkait.
        </p>

        {/* 4 Big Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #D6D3C7', padding: '24px' }}>
            <p style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '36px', fontWeight: 900, color: '#1A1A18', lineHeight: 1 }}>
              482.109
            </p>
            <p style={{ fontFamily: '"Inter", sans-serif', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6B6659', marginTop: '10px' }}>
              TOTAL PENGADUAN MASUK
            </p>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #D6D3C7', padding: '24px' }}>
            <p style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '36px', fontWeight: 900, color: '#1A1A18', lineHeight: 1 }}>
              98,4%
            </p>
            <p style={{ fontFamily: '"Inter", sans-serif', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6B6659', marginTop: '10px' }}>
              SUKSES SELESAI DITANGGANI
            </p>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #D6D3C7', padding: '24px' }}>
            <p style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '36px', fontWeight: 900, color: '#1A1A18', lineHeight: 1 }}>
              8 detik
            </p>
            <p style={{ fontFamily: '"Inter", sans-serif', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6B6659', marginTop: '10px' }}>
              RATA-RATA PROSES TRIASE AI
            </p>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #D6D3C7', padding: '24px' }}>
            <p style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '36px', fontWeight: 900, color: '#B23A2A', lineHeight: 1 }}>
              1.042
            </p>
            <p style={{ fontFamily: '"Inter", sans-serif', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6B6659', marginTop: '10px' }}>
              LAPORAN KRITIS BULAN INI
            </p>
          </div>
        </div>

        {/* 2 Column Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column (8 cols): Charts */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {/* Pengaduan Berdasarkan Kategori */}
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #D6D3C7', padding: '28px' }}>
              <h3 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '18px', fontWeight: 700, color: '#1A1A18', marginBottom: '24px' }}>
                Pengaduan Berdasarkan Kategori
              </h3>

              <div className="flex flex-col gap-4">
                {[
                  { label: 'Infrastruktur', val: 142409, pct: '100%' },
                  { label: 'Keamanan & Bencana', val: 98124, pct: '68%' },
                  { label: 'Layanan Publik', val: 120489, pct: '84%' },
                  { label: 'Lingkungan Hidup', val: 61204, pct: '43%' },
                  { label: 'Lainnya', val: 59883, pct: '41%' },
                ].map(item => (
                  <div key={item.label} className="grid grid-cols-12 items-center gap-4">
                    <span style={{ fontFamily: '"Inter", sans-serif', fontSize: '13px', color: '#1A1A18' }} className="col-span-4 sm:col-span-3">
                      {item.label}
                    </span>
                    <div className="col-span-6 sm:col-span-7 bg-[#EBEBDF] h-4 w-full">
                      <div style={{ width: item.pct, backgroundColor: '#1F4E3E' }} className="h-full" />
                    </div>
                    <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '12px', fontWeight: 600, color: '#1A1A18' }} className="col-span-2 text-right">
                      {item.val.toLocaleString('id-ID')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Penanganan Pengaduan (Bulan Ini) */}
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #D6D3C7', padding: '28px' }}>
              <h3 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '18px', fontWeight: 700, color: '#1A1A18', marginBottom: '20px' }}>
                Status Penanganan Pengaduan (Bulan Ini)
              </h3>

              <div className="h-6 w-full flex overflow-hidden mb-6">
                <div style={{ width: '15%', backgroundColor: '#6B6659' }} title="Belum Verifikasi (15%)" />
                <div style={{ width: '30%', backgroundColor: '#3E5C74' }} title="Diproses (30%)" />
                <div style={{ width: '45%', backgroundColor: '#1F4E3E' }} title="Selesai Ditangani (45%)" />
                <div style={{ width: '10%', backgroundColor: '#B23A2A' }} title="Ditutup / Selesai (10%)" />
              </div>

              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#6B6659]" />
                  <span style={{ fontFamily: '"Inter", sans-serif', fontSize: '12px', color: '#6B6659' }}>Belum Verifikasi (15%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#3E5C74]" />
                  <span style={{ fontFamily: '"Inter", sans-serif', fontSize: '12px', color: '#6B6659' }}>Diproses (30%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#1F4E3E]" />
                  <span style={{ fontFamily: '"Inter", sans-serif', fontSize: '12px', color: '#6B6659' }}>Selesai Ditangani (45%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#B23A2A]" />
                  <span style={{ fontFamily: '"Inter", sans-serif', fontSize: '12px', color: '#6B6659' }}>Ditutup / Selesai (10%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (4 cols): Metrik Performa Triase AI */}
          <div className="lg:col-span-4">
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #D6D3C7', padding: '28px' }}>
              <h3 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '18px', fontWeight: 700, color: '#1A1A18', marginBottom: '24px' }}>
                Metrik Performa Triase AI
              </h3>

              <div className="flex flex-col gap-6">
                <div>
                  <p style={{ fontFamily: '"Inter", sans-serif', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6B6659', marginBottom: '4px' }}>
                    WAKTU RESPONS TRIASE
                  </p>
                  <p style={{ fontFamily: '"Inter", sans-serif', fontSize: '15px', fontWeight: 700, color: '#1F4E3E', marginBottom: '4px' }}>
                    &lt; 10 Detik secara Realtime
                  </p>
                  <p style={{ fontFamily: '"Inter", sans-serif', fontSize: '12px', color: '#6B6659', lineHeight: 1.5 }}>
                    Melompati proses antrean manual di dinas hingga 2 hari kerja.
                  </p>
                </div>

                <hr style={{ borderColor: '#D6D3C7' }} />

                <div>
                  <p style={{ fontFamily: '"Inter", sans-serif', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6B6659', marginBottom: '4px' }}>
                    AKURASI DISTRIBUSI LAPORAN
                  </p>
                  <p style={{ fontFamily: '"Inter", sans-serif', fontSize: '15px', fontWeight: 700, color: '#1A1A18', marginBottom: '4px' }}>
                    92,2% Pengaduan Tepat Klasifikasi
                  </p>
                  <p style={{ fontFamily: '"Inter", sans-serif', fontSize: '12px', color: '#6B6659', lineHeight: 1.5 }}>
                    Disalurkan otomatis ke dinas yang berwenang tanpa revisi dari petugas dinas terkait.
                  </p>
                </div>

                <hr style={{ borderColor: '#D6D3C7' }} />

                <div>
                  <p style={{ fontFamily: '"Inter", sans-serif', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6B6659', marginBottom: '4px' }}>
                    DETEKSI LAPORAN GANDA
                  </p>
                  <p style={{ fontFamily: '"Inter", sans-serif', fontSize: '15px', fontWeight: 700, color: '#1A1A18', marginBottom: '4px' }}>
                    847 Laporan Duplikat/Bulan
                  </p>
                  <p style={{ fontFamily: '"Inter", sans-serif', fontSize: '12px', color: '#6B6659', lineHeight: 1.5 }}>
                    Menghemat waktu verifikasi manual dengan langsung menumpuk laporan serupa.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
