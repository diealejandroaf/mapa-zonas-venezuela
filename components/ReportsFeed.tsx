'use client';

import type { Report } from '@/lib/types';
import { formatDate } from '@/lib/constants';

export default function ReportsFeed({
  reports,
  onSelectZone,
}: {
  reports: Report[];
  onSelectZone?: (slug: string) => void;
}) {
  if (reports.length === 0) {
    return <p className="text-sm text-gray-500">No hay reportes publicados aún.</p>;
  }

  return (
    <ul className="space-y-3">
      {reports.map((r) => (
        <li key={r.id} className="rounded-lg border border-gray-200 p-3">
          <div className="flex items-center justify-between gap-2">
            {r.zone && (
              <button
                onClick={() => onSelectZone?.(r.zone!.slug)}
                className="text-xs font-semibold uppercase tracking-wide text-blue-600 hover:underline"
              >
                {r.zone.name}
              </button>
            )}
            <span className="text-xs text-gray-400">{formatDate(r.reportedAt)}</span>
          </div>
          <div className="mt-1 font-medium text-gray-900">{r.title}</div>
          <p className="text-sm text-gray-600">{r.body}</p>
          {(r.sourceName || r.sourceUrl) && (
            <div className="mt-1 text-xs text-gray-400">
              {r.sourceName}
              {r.sourceUrl && (
                <>
                  {r.sourceName ? ' · ' : ''}
                  <a
                    href={r.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    ver fuente original
                  </a>
                </>
              )}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
