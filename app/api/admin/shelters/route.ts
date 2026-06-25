import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/admin';
import { shelterCreateSchema } from '@/lib/validation';

export const dynamic = 'force-dynamic';

// GET /api/admin/shelters?zone=slug — lista refugios (requiere token).
export async function GET(req: Request) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;
  const { searchParams } = new URL(req.url);
  const zone = searchParams.get('zone');
  const shelters = await prisma.shelter.findMany({
    where: zone ? { zone: { slug: zone } } : {},
    orderBy: { name: 'asc' },
    include: { zone: { select: { name: true, slug: true } } },
  });
  return NextResponse.json(shelters);
}

// POST /api/admin/shelters — crea un refugio (requiere token).
export async function POST(req: Request) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;
  const body = await req.json().catch(() => null);
  const parsed = shelterCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Datos inválidos', details: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const d = parsed.data;
  const zone = await prisma.zone.findUnique({ where: { id: d.zoneId } });
  if (!zone) return NextResponse.json({ error: 'Zona inválida' }, { status: 400 });

  const shelter = await prisma.shelter.create({
    data: {
      zoneId: d.zoneId,
      name: d.name,
      address: d.address || null,
      status: d.status,
      capacity: d.capacity ?? null,
      occupancy: d.occupancy ?? null,
      contactPhone: d.contactPhone || null,
      servicesOffered: d.servicesOffered || null,
      latitude: d.latitude ?? null,
      longitude: d.longitude ?? null,
      sourceName: d.sourceName || null,
      sourceUrl: d.sourceUrl || null,
    },
  });
  return NextResponse.json(shelter, { status: 201 });
}
