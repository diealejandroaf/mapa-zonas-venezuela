'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, GeoJSON } from 'react-leaflet';
import type { GeoJsonObject, Feature } from 'geojson';
import 'leaflet/dist/leaflet.css';
import type { Zone } from '@/lib/types';
import { DAMAGE } from '@/lib/constants';

interface Props {
  zones: Zone[];
  onSelect: (slug: string) => void;
}

// Normaliza nombres para casar zonas con features del GeoJSON.
const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/distrito capital|caracas/g, 'caracas')
    .replace(/vargas|la guaira/g, 'la guaira')
    .trim();

export default function MapView({ zones, onSelect }: Props) {
  const [geo, setGeo] = useState<GeoJsonObject | null>(null);

  // GeoJSON de estados es opcional: si existe en /public se dibuja el choropleth.
  // Si no, el mapa funciona igual con los marcadores por estado.
  useEffect(() => {
    fetch('/venezuela-estados.geojson')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.features?.length) setGeo(data);
      })
      .catch(() => {});
  }, []);

  const byKey = new Map<string, Zone>();
  for (const z of zones) {
    if (z.isoCode) byKey.set(z.isoCode.toUpperCase(), z);
    byKey.set(norm(z.name), z);
  }

  const zoneForFeature = (f: Feature): Zone | undefined => {
    const p = (f.properties || {}) as Record<string, string>;
    const iso = (p.iso_3166_2 || p.iso || p.ISO || p.HASC_1 || '').toUpperCase();
    if (iso && byKey.has(iso)) return byKey.get(iso);
    const name = p.name || p.NAME_1 || p.estado || p.ESTADO || '';
    return byKey.get(norm(name));
  };

  return (
    <MapContainer
      center={[9.5, -67.0]}
      zoom={7}
      scrollWheelZoom
      style={{ height: '100%', width: '100%', borderRadius: '0.75rem' }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {geo && (
        <GeoJSON
          data={geo}
          style={(feature) => {
            const z = feature ? zoneForFeature(feature) : undefined;
            const color = z ? DAMAGE[z.damageLevel].color : DAMAGE.sin_datos.color;
            return { fillColor: color, fillOpacity: 0.45, color: '#374151', weight: 1 };
          }}
          onEachFeature={(feature, layer) => {
            const z = zoneForFeature(feature);
            if (z) {
              layer.bindTooltip(`${z.name} — ${DAMAGE[z.damageLevel].label}`);
              layer.on('click', () => onSelect(z.slug));
            }
          }}
        />
      )}

      {zones
        .filter((z) => z.latitude != null && z.longitude != null)
        .map((z) => (
          <CircleMarker
            key={z.id}
            center={[z.latitude as number, z.longitude as number]}
            radius={13}
            pathOptions={{
              color: '#1f2937',
              weight: 1.5,
              fillColor: DAMAGE[z.damageLevel].color,
              fillOpacity: 0.9,
            }}
            eventHandlers={{ click: () => onSelect(z.slug) }}
          >
            <Tooltip direction="top">
              <span className="font-semibold">{z.name}</span> — Daño{' '}
              {DAMAGE[z.damageLevel].label}
            </Tooltip>
          </CircleMarker>
        ))}
    </MapContainer>
  );
}
