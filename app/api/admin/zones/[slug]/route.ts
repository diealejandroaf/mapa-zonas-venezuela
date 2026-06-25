import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/admin';
import { zoneUpdateSchema } from '@/lib/validation';

export const dynamic = 'force-dynamic';

// PATCH /api/admin/zones/:slug — actualiza nivel de daño, servicios y resumen.
export async function PATCH(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;

  const body = await req.json().catch(() => null);
  const parsed = zoneUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Datos inválidos', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const existing = await prisma.zone.findUnique({ where: { slug: params.slug } });
  if (!existing) {
    return NextResponse.json({ error: 'Zona no encontrada' }, { status: 404 });
  }

  const zone = await prisma.zone.update({
    where: { slug: params.slug },
    data: { ...parsed.data, lastReportAt: new Date() },
  });
  return NextResponse.json(zone);
}
