'use client';

import type { ZoneDetail as ZoneDetailType, ServiceStatus } from '@/lib/types';
import { DAMAGE, SERVICE, SHELTER, SERVICE_FIELDS, formatDate } from '@/lib/constants';

export default function ZoneDetail({ zone }: { zone: ZoneDetailType }) {
  const dmg = DAMAGE[zone.damageLevel];

  return (
    <div className="space-y-5">
      {/* Encabezado */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{zone.name}</h2>
          {zone.summary && (
            <p className="mt-1 text-sm text-gray-600">{zone.summary}</p>
          )}
        </div>
        <span
          className="shrink-0 rounded-full px-3 py-1 text-sm font-semibold"
          style={{ backgroundColor: dmg.color, color: dmg.text }}
        >
          Daño {dmg.label}
        </span>
      </div>

      {/* Servicios */}
      <div>
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Servicios
        </h3>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {SERVICE_FIELDS.map(({ key, label }) => {
            const status = zone[key] as ServiceStatus;
            const s = SERVICE[status];
            return (
              <div key={key} className="rounded-lg border border-gray-200 p-2.5">
                <div className="text-xs text-gray-500">{label}</div>
                <div className="mt-1 flex items-center gap-1.5">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: s.color }}
                  />
                  <span className="text-sm font-medium">{s.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Refugios */}
      <div>
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Refugios cercanos ({zone.shelters.length})
        </h3>
        {zone.shelters.length === 0 ? (
          <p className="text-sm text-gray-500">Sin refugios registrados.</p>
        ) : (
          <ul className="space-y-2">
            {zone.shelters.map((sh) => (
              <li key={sh.id} className="rounded-lg border border-gray-200 p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-gray-900">{sh.name}</span>
                  <span
                    className="rounded-full px-2 py-0.5 text-xs font-medium"
                    style={{ backgroundColor: SHELTER[sh.status].color, color: '#fff' }}
                  >
                    {SHELTER[sh.status].label}
                  </span>
                </div>
                {sh.address && (
                  <div className="mt-1 text-sm text-gray-600">{sh.address}</div>
                )}
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-gray-500">
                  {sh.capacity != null && (
                    <span>
                      Capacidad: {sh.occupancy ?? '?'}/{sh.capacity}
                    </span>
                  )}
                  {sh.contactPhone && <span>Tel: {sh.contactPhone}</span>}
                  {sh.servicesOffered && <span>{sh.servicesOffered}</span>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Último reporte */}
      <div className="rounded-lg bg-gray-50 p-3 text-sm">
        <span className="text-gray-500">Último reporte: </span>
        <span className="font-medium">{formatDate(zone.lastReportAt)}</span>
        {zone.lastReportSource && (
          <span className="text-gray-500"> · Fuente: {zone.lastReportSource}</span>
        )}
      </div>

      {/* Reportes de la zona */}
      {zone.reports.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Reportes recientes en {zone.name}
          </h3>
          <ul className="space-y-2">
            {zone.reports.map((r) => (
              <li key={r.id} className="border-l-2 border-gray-200 pl-3">
                <div className="font-medium text-gray-900">{r.title}</div>
                <p className="text-sm text-gray-600">{r.body}</p>
                <div className="mt-0.5 text-xs text-gray-400">
                  {formatDate(r.reportedAt)}
                  {r.sourceName && ` · ${r.sourceName}`}
                  {r.sourceUrl && (
                    <>
                      {' · '}
                      <a
                        href={r.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        ver fuente
                      </a>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
