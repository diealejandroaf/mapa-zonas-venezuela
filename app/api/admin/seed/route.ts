import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/admin';
import { seedZones } from '@/lib/seed-data';

export const dynamic = 'force-dynamic';

// POST /api/admin/seed  — siembra los datos de demostración (requiere token).
// Idempotente: si ya hay zonas, no hace nada (a menos que ?force=true).
// Permite poblar la base una vez tras el deploy sin necesidad de Node local.
export async function POST(req: Request) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;

  const { searchParams } = new URL(req.url);
  const force = searchParams.get('force') === 'true';

  const existing = await prisma.zone.count();
  if (existing > 0 && !force) {
    return NextResponse.json({
      message: 'La base ya tiene datos. Usa ?force=true para resembrar.',
      zones: existing,
      skipped: true,
    });
  }

  if (force) {
    await prisma.report.deleteMany();
    await prisma.shelter.deleteMany();
    await prisma.zone.deleteMany();
  }

  for (const z of seedZones) {
    const { reports, shelters, ...zone } = z;
    await prisma.zone.create({
      data: {
        ...zone,
        type: 'estado',
        reports: {
          create: reports.map((r) => ({ ...r, status: 'published' })),
        },
        shelters: { create: shelters },
      },
    });
  }

  const zones = await prisma.zone.count();
  return NextResponse.json({ message: 'Datos sembrados correctamente.', zones });
}
