import React, { useState, useEffect, useRef } from 'react';
import { MapPin, LocateFixed, Loader2 } from 'lucide-react';

export function LocationPicker({ value, onChange, error, onUseMyLocation }) {
  const [locating, setLocating] = useState(false);
  const [localError, setLocalError] = useState('');
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  const defaultLat = value.lokasi_lat || -2.1316;
  const defaultLng = value.lokasi_lng || 106.1169;

  
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

  const initMap = () => {
    if (!window.L || !mapRef.current || mapInstanceRef.current) return;

    const L = window.L;
    const map = L.map(mapRef.current).setView([defaultLat, defaultLng], 14);
    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(map);

    const marker = L.marker([defaultLat, defaultLng], { draggable: true }).addTo(map);
    markerRef.current = marker;

    marker.on('dragend', (e) => {
      const pos = marker.getLatLng();
      updateLocation(pos.lat, pos.lng);
    });

    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
      updateLocation(lat, lng);
    });
  };

  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current) {
      const currentPos = markerRef.current.getLatLng();
      if (currentPos.lat !== defaultLat || currentPos.lng !== defaultLng) {
        markerRef.current.setLatLng([defaultLat, defaultLng]);
        mapInstanceRef.current.setView([defaultLat, defaultLng], mapInstanceRef.current.getZoom());
      }
    }
  }, [defaultLat, defaultLng]);

  const [isGeocoding, setIsGeocoding] = useState(false);
  const geocodeAbortRef = useRef(null);

  const updateLocation = async (lat, lng) => {
    
    if (geocodeAbortRef.current) {
      geocodeAbortRef.current.abort();
    }
    const controller = new AbortController();
    geocodeAbortRef.current = controller;

    
    const tempAddress = `Mencari alamat... (${lat.toFixed(5)}, ${lng.toFixed(5)})`;
    onChange({
      ...value,
      lokasi_lat: lat,
      lokasi_lng: lng,
      lokasi_alamat: tempAddress
    });

    setIsGeocoding(true);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: { 'Accept-Language': 'id,en' },
          signal: controller.signal
        }
      );
      if (response.ok) {
        const data = await response.json();
        let formattedAddress = data.display_name;
        if (data.address) {
          const parts = [
            data.address.road || data.address.pedestrian || data.address.suburb,
            data.address.village || data.address.neighbourhood || data.address.town || data.address.city_district,
            data.address.city || data.address.regency || data.address.county,
            data.address.state
          ].filter(Boolean);
          if (parts.length >= 2) {
            formattedAddress = parts.join(', ');
          }
        }

        const finalAlamat = formattedAddress || `Koordinat GPS: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        onChange({
          ...value,
          lokasi_lat: lat,
          lokasi_lng: lng,
          lokasi_alamat: finalAlamat
        });
      } else {
        onChange({
          ...value,
          lokasi_lat: lat,
          lokasi_lng: lng,
          lokasi_alamat: `Koordinat GPS: ${lat.toFixed(5)}, ${lng.toFixed(5)}`
        });
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        onChange({
          ...value,
          lokasi_lat: lat,
          lokasi_lng: lng,
          lokasi_alamat: `Koordinat GPS: ${lat.toFixed(5)}, ${lng.toFixed(5)}`
        });
      }
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocalError('Browser tidak mendukung GPS.');
      return;
    }
    setLocating(true);
    setLocalError('');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocating(false);
        if (mapInstanceRef.current && markerRef.current) {
          markerRef.current.setLatLng([latitude, longitude]);
          mapInstanceRef.current.setView([latitude, longitude], 16);
        }
        updateLocation(latitude, longitude);
        if (onUseMyLocation) onUseMyLocation(latitude, longitude);
      },
      (err) => {
        setLocating(false);
        setLocalError('Gagal mendapatkan lokasi. Pastikan izin GPS aktif.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="block text-[11px] font-bold text-text-text-primary uppercase tracking-wider mb-0">
          Lokasi Kejadian (Pilih di Peta atau GPS)
        </label>
        <button
          type="button"
          onClick={handleGetLocation}
          disabled={locating}
          className="flex items-center gap-1.5 text-[11px] font-bold text-primary hover:text-primary-dark disabled:opacity-50 transition-colors"
        >
          {locating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <LocateFixed className="w-3.5 h-3.5" />}
          {locating ? 'Mencari Lokasi...' : 'Gunakan GPS Saya'}
        </button>
      </div>

      <div className="relative">
        <MapPin className="w-4 h-4 text-text-secondary absolute left-3 top-3.5" />
        <input
          type="text"
          value={value.lokasi_alamat}
          onChange={(e) => onChange({ ...value, lokasi_alamat: e.target.value })}
          placeholder="Contoh: Jl. Merdeka No. 12, atau klik langsung pada peta di bawah..."
          className="w-full bg-bg-base border border-border rounded pl-9 pr-9 py-2.5 text-sm text-text-text-primary focus:outline-none focus:border-primary"
        />
        {isGeocoding && (
          <Loader2 className="w-4 h-4 text-primary animate-spin absolute right-3 top-3.5" />
        )}
      </div>

      
      <div className="border border-border rounded-lg overflow-hidden bg-bg-base">
        <div className="p-2 bg-slate-100 border-b border-border flex justify-between items-center text-xs">
          <span className="font-semibold text-text-text-primary">Klik Peta atau Geser Pin untuk Menentukan Lokasi</span>
          <span className="text-text-secondary text-[10px]">Peta Interaktif</span>
        </div>
        <div ref={mapRef} className="w-full h-72 z-0" />
        <div className="p-2.5 bg-white border-t border-border flex items-center justify-between text-xs">
          <span className="font-mono-ticket text-text-secondary">
            Lat: {defaultLat.toFixed(5)}, Lng: {defaultLng.toFixed(5)}
          </span>
          <span className="text-[10px] text-text-secondary">Pin bisa digeser</span>
        </div>
      </div>

      {(error || localError) && (
        <p className="text-[11px] text-accent whitespace-pre-line">{error || localError}</p>
      )}
    </div>
  );
}
