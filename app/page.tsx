'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import type { Zone, ZoneDetail as ZoneDetailType, Report } from '@/lib/types';
import { getZones, getZone, getReports } from '@/lib/api';
import ZoneSearch from '@/components/ZoneSearch';
import ZoneDetail from '@/components/ZoneDetail';
import ReportsFeed from '@/components/ReportsFeed';
import Legend from '@/components/Legend';
import CasualtyBanner from '@/components/CasualtyBanner';

// Leaflet sólo corre en el cliente.
const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-gray-400">
      Cargando mapa…
    </div>
  ),
});

export default function HomePage() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [selected, setSelected] = useState<ZoneDetailType | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getZones(), getReports(20)])
      .then(([z, r]) => {
        setZones(z);
        setReports(r);
      })
      .catch(() =>
        setError('No se pudo conectar con el servidor. ¿Está corriendo el backend?')
      );
  }, []);

  async function selectZone(slug: string) {
    try {
      setSelected(await getZone(slug));
    } catch {
      setError('No se pudo cargar la zona.');
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-900">
          Mapa de Zonas Afectadas — Venezuela
        </h1>
        <p className="mt-1 text-gray-600">
          Busca tu estado o ciudad para ver nivel de daño, estado de servicios y
          refugios cercanos.
        </p>
      </div>

      <CasualtyBanner />

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Columna mapa */}
        <div className="lg:col-span-3">
          <div className="mb-3">
            <ZoneSearch zones={zones} onSelect={selectZone} />
          </div>
          <div className="h-[460px] overflow-hidden rounded-xl border border-gray-200 bg-white">
            <Map zones={zones} onSelect={selectZone} />
          </div>
          <div className="mt-3 rounded-lg bg-white p-3">
            <Legend />
          </div>
        </div>

        {/* Columna ficha / feed */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            {selected ? (
              <>
                <button
                  onClick={() => setSelected(null)}
                  className="mb-3 text-sm text-blue-600 hover:underline"
                >
                  ← Volver al feed
                </button>
                <ZoneDetail zone={selected} />
              </>
            ) : (
              <>
                <h2 className="mb-3 text-lg font-bold">Reportes recientes</h2>
                <ReportsFeed reports={reports} onSelectZone={selectZone} />
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
