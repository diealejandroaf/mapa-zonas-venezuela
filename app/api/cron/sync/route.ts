import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

// Autoriza: si hay CRON_SECRET, exige Bearer; acepta x-admin-token; si no hay
// CRON_SECRET configurado, permite (la acción solo LEE del USGS y es idempotente).
function authorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  const admin = process.env.ADMIN_TOKEN;
  const auth = req.headers.get('authorization');
  const tok = req.headers.get('x-admin-token');
  if (admin && tok === admin) return true;
  if (secret) return auth === `Bearer ${secret}`;
  return true; // sin CRON_SECRET: permitido (solo pull de USGS)
}

// GET /api/cron/sync — trae sismos recientes cerca del epicentro desde el USGS
// y los agrega al feed (publicados, fuente USGS). Lo dispara Vercel Cron (ver
// vercel.json) y también se puede llamar manualmente con x-admin-token.
export async function GET(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  // Ventana: últimos 30 días. Área: costa norte-central (Yaracuy–Carabobo–La Guaira–Caracas).
  const start = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString().slice(0, 10);
  const usgs =
    `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson` +
    `&starttime=${start}&minmagnitude=4` +
    `&minlatitude=9&maxlatitude=11.6&minlongitude=-69.5&maxlongitude=-65.5&orderby=time`;

  let data: { features?: any[] };
  try {
    const res = await fetch(usgs, { cache: 'no-store' });
    if (!res.ok) throw new Error(String(res.status));
    data = await res.json();
  } catch {
    return NextResponse.json({ error: 'USGS no disponible' }, { status: 502 });
  }

  const zones = await prisma.zone.findMany();
  const withCoords = zones.filter((z) => z.latitude != null && z.longitude != null);
  if (!withCoords.length) {
    return NextResponse.json({ error: 'No hay zonas con coordenadas' }, { status: 400 });
  }

  let created = 0;
  let skipped = 0;
  const features = data.features || [];

  for (const f of features) {
    const url: string | undefined = f?.properties?.url;
    const coords: number[] | undefined = f?.geometry?.coordinates;
    const mag = f?.properties?.mag;
    if (!url || !coords || mag == null) continue;

    const [lon, lat, depth] = coords;

    // Evitar duplicados: si ya existe un reporte con esa URL, saltar.
    const exists = await prisma.report.findFirst({ where: { sourceUrl: url } });
    if (exists) {
      skipped++;
      continue;
    }

    // Zona más cercana por distancia al centroide.
    let best = withCoords[0];
    let bestD = Infinity;
    for (const z of withCoords) {
      const d = (z.latitude! - lat) ** 2 + (z.longitude! - lon) ** 2;
      if (d < bestD) {
        bestD = d;
        best = z;
      }
    }

    const place = f.properties.place || 'cerca del epicentro';
    const time = f.properties.time ? new Date(f.properties.time) : new Date();

    await prisma.report.create({
      data: {
        zoneId: best.id,
        title: `Sismo M${mag} — ${place}`,
        body: `Evento sísmico registrado por el USGS: magnitud ${mag}, ${place}. Profundidad ~${
          depth != null ? Math.round(depth) : '?'
        } km. Datos automáticos del USGS.`,
        sourceName: 'USGS',
        sourceUrl: url,
        origin: 'feed',
        status: 'published',
        reportedAt: time,
      },
    });
    created++;
  }

  return NextResponse.json({ ok: true, scanned: features.length, created, skipped });
}
