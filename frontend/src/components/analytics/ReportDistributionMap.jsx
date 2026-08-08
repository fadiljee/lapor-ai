import React, { useEffect, useRef } from 'react';
import { MapPin, AlertCircle, Layers } from 'lucide-react';

export function ReportDistributionMap({ locations = [] }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Default sample locations if empty
  const points = locations.length > 0 ? locations : [
    { id: 'LP-2026-08-04-6518', lat: -2.1316, lng: 106.1169, alamat: 'Pasar Sekanak, Pangkalpinang', urgensi: 'Kritis', kategori: 'Keamanan/Bencana', dinas: 'BPBD', status: 'Assigned', ringkasan: 'Kebakaran hebat dekat permukiman warga.' },
    { id: 'LP-2026-08-04-9812', lat: -2.1245, lng: 106.1088, alamat: 'Jl. Jenderal Sudirman, Pangkalpinang', urgensi: 'Tinggi', kategori: 'Infrastruktur', dinas: 'PUPR', status: 'In Progress', ringkasan: 'Jalan utama ambles dan berbahaya bagi pengendara.' },
    { id: 'LP-2026-08-05-1102', lat: -2.1401, lng: 106.1255, alamat: 'Kawasan Pelabuhan Pangkalbalam', urgensi: 'Sedang', kategori: 'Lingkungan', dinas: 'DLH', status: 'Assigned', ringkasan: 'Penumpukan sampah liar di area dermaga.' },
    { id: 'LP-2026-08-06-4431', lat: -2.1550, lng: 106.1010, alamat: 'Simpang Empat Ramayana', urgensi: 'Kritis', kategori: 'Infrastruktur', dinas: 'PUPR', status: 'In Progress', ringkasan: 'Lampu lalu lintas padam total pemicu kemacetan parah.' },
    { id: 'LP-2026-08-07-2299', lat: -2.1180, lng: 106.1340, alamat: 'Kawasan Industri Selindung', urgensi: 'Rendah', kategori: 'Layanan Publik', dinas: 'Satpol PP', status: 'Resolved', ringkasan: 'Penertiban PKL di trotoar umum.' },
  ];

  const getUrgencyColor = (urgensi) => {
    switch ((urgensi || '').toUpperCase()) {
      case 'KRITIS': return '#B3382B'; // Merah
      case 'TINGGI': return '#B9832E'; // Amber
      case 'SEDANG': return '#4A6C93'; // Biru
      default: return '#6E7259';        // Olive/Green
    }
  };

  const initMap = () => {
    if (!window.L || !mapRef.current || mapInstanceRef.current) return;

    const L = window.L;
    const centerLat = points[0]?.lat || -2.1316;
    const centerLng = points[0]?.lng || 106.1169;

    const map = L.map(mapRef.current).setView([centerLat, centerLng], 12);
    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(map);

    // Plot location markers
    points.forEach((pt) => {
      const color = getUrgencyColor(pt.urgensi);
      
      const customIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `<div style="
          background-color: ${color};
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 10px;
        ">!</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker([pt.lat, pt.lng], { icon: customIcon }).addTo(map);

      const popupContent = `
        <div style="font-family: sans-serif; font-size: 12px; max-width: 200px;">
          <div style="font-weight: bold; color: ${color}; font-size: 11px; margin-bottom: 2px;">
            [${pt.urgensi.toUpperCase()}] ${pt.id}
          </div>
          <div style="font-weight: bold; color: #1E3D36; margin-bottom: 4px;">${pt.alamat}</div>
          <div style="color: #6B6F63; margin-bottom: 4px;">${pt.ringkasan || pt.kategori}</div>
          <div style="font-weight: bold; color: #12211D; font-size: 10px;">Tujuan: ${pt.dinas}</div>
        </div>
      `;
      marker.bindPopup(popupContent);
    });
  };

  useEffect(() => {
    if (document.getElementById('leaflet-css')) {
      initMap();
      return;
    }

    const link = document.createElement('link');
    link.id = 'leaflet-css';
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.id = 'leaflet-js';
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.onload = () => {
      initMap();
    };
    document.body.appendChild(script);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="bg-white border border-border rounded-lg p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-border pb-3">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <h3 className="font-serif font-bold text-base text-text-primary">
              Peta Sebaran Laporan Berdasarkan Lokasi
            </h3>
          </div>
          <p className="text-xs text-text-secondary">
            Sebaran spasial titik lokasi pengaduan warga dengan indikator tingkat urgensi wilayah
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B3382B] inline-block" />
            <span className="text-text-secondary">Kritis</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B9832E] inline-block" />
            <span className="text-text-secondary">Tinggi</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4A6C93] inline-block" />
            <span className="text-text-secondary">Sedang</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#6E7259] inline-block" />
            <span className="text-text-secondary">Rendah</span>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative rounded-lg overflow-hidden border border-border">
        <div ref={mapRef} className="w-full h-[320px] z-10" />
      </div>

      {/* Hotspots Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
        <div className="bg-bg-base p-3 rounded border border-border">
          <span className="text-text-secondary block font-medium">Titik Lokasi Tercatat:</span>
          <span className="font-mono font-bold text-primary text-sm">{points.length} Titik Koordinat</span>
        </div>
        <div className="bg-bg-base p-3 rounded border border-border">
          <span className="text-text-secondary block font-medium">Wilayah Hotspot Utama:</span>
          <span className="font-bold text-text-primary text-xs">Kota Pangkalpinang &amp; Sekitarnya</span>
        </div>
        <div className="bg-bg-base p-3 rounded border border-border">
          <span className="text-text-secondary block font-medium">Fokus Penanganan Darurat:</span>
          <span className="font-bold text-accent text-xs">
            {points.filter(p => p.urgensi === 'Kritis').length} Laporan Urgensi Kritis
          </span>
        </div>
      </div>
    </div>
  );
}
