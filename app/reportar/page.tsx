'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Zone } from '@/lib/types';
import { getZones } from '@/lib/api';
import ReportForm from '@/components/ReportForm';

export default function ReportarPage() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getZones()
      .then(setZones)
      .catch(() => setError('No se pudieron cargar las zonas.'));
  }, []);

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <Link href="/" className="text-sm text-blue-600 hover:underline">
        ← Volver al mapa
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-gray-900">Reportar una situación</h1>
      <p className="mt-1 text-gray-600">
        Ayuda a mantener la información actualizada. Tu reporte será revisado antes
        de publicarse.
      </p>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5">
        {error ? (
          <p className="text-sm text-red-700">{error}</p>
        ) : (
          <ReportForm zones={zones} />
        )}
      </div>
    </main>
  );
}
