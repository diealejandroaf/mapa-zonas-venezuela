import type { Zone, ZoneDetail, Report } from './types';

// La app y el API viven en el mismo dominio (rutas /api/* de Next.js),
// así que usamos rutas relativas.
async function get<T>(path: string): Promise<T> {
  const res = await fetch(path, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Error ${res.status} al pedir ${path}`);
  return res.json();
}

export function getZones() {
  return get<Zone[]>('/api/zones');
}

export function getZone(slug: string) {
  return get<ZoneDetail>(`/api/zones/${slug}`);
}

export function getReports(limit = 30) {
  return get<Report[]>(`/api/reports?limit=${limit}`);
}

export interface CitizenReportInput {
  zoneId: number;
  title: string;
  body: string;
  damageLevel?: string;
  sourceName?: string;
  sourceUrl?: string;
  reporterName?: string;
  reporterContact?: string;
}

export async function submitReport(
  input: CitizenReportInput
): Promise<{ message: string; id: number; status: string }> {
  const res = await fetch('/api/reports', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error || 'No se pudo enviar el reporte');
  }
  return data;
}
