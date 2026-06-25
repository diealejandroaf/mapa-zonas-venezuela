'use client';

import { useEffect, useState } from 'react';
import type { SiteInfo } from '@/lib/types';
import { DESAPARECIDOS_URL } from '@/lib/types';
import { formatDate } from '@/lib/constants';

function Stat({ value, label }: { value: number | null | undefined; label: string }) {
  return (
    <div className="text-center">
      <div className="text-2xl font-bold text-gray-900">
        {value != null ? value.toLocaleString('es-VE') : '—'}
      </div>
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
    </div>
  );
}

export default function CasualtyBanner() {
  const [info, setInfo] = useState<SiteInfo | null>(null);

  useEffect(() => {
    fetch('/api/site-info', { cache: 'no-store' })
      .then((r) => r.json())
      .then(setInfo)
      .catch(() => {});
  }, []);

  const hasData =
    info && (info.deaths != null || info.injured != null || info.missing != null);

  return (
    <div className="mb-5 rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-6">
          {hasData ? (
            <>
              <Stat value={info!.deaths} label="Fallecidos" />
              <Stat value={info!.injured} label="Heridos" />
              <Stat value={info!.missing} label="Desaparecidos" />
            </>
          ) : (
            <p className="text-sm text-gray-500">Balance de víctimas no disponible aún.</p>
          )}
        </div>

        <a
          href={DESAPARECIDOS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
        >
          🔎 Buscar desaparecidos
        </a>
      </div>

      {hasData && (
        <p className="mt-3 text-xs text-gray-400">
          Cifras preliminares y cambiantes
          {info!.asOf ? ` · actualizado ${formatDate(info!.asOf)}` : ''}
          {info!.sourceName ? ` · Fuente: ${info!.sourceName}` : ''}
          {info!.sourceUrl ? (
            <>
              {' '}
              <a
                href={info!.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                (ver)
              </a>
            </>
          ) : null}
        </p>
      )}
    </div>
  );
}
