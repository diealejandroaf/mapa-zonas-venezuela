import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/admin';
import { shelterUpdateSchema } from '@/lib/validation';

export const dynamic = 'force-dynamic';

// PATCH /api/admin/shelters/:id — edita un refugio (requiere token).
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;

  const body = await req.json().catch(() => null);
  const parsed = shelterUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Datos inválidos', details: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const id = Number(params.id);
  const existing = await prisma.shelter.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: 'Refugio no encontrado' }, { status: 404 });
  }

  const data = parsed.data;
  const shelter = await prisma.shelter.update({
    where: { id },
    data: {
      ...data,
      address: data.address === '' ? null : data.address,
      contactPhone: data.contactPhone === '' ? null : data.contactPhone,
      servicesOffered: data.servicesOffered === '' ? null : data.servicesOffered,
      sourceUrl: data.sourceUrl === '' ? null : data.sourceUrl,
    },
  });
  return NextResponse.json(shelter);
}

// DELETE /api/admin/shelters/:id — elimina un refugio (requiere token).
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;
  const id = Number(params.id);
  const existing = await prisma.shelter.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: 'Refugio no encontrado' }, { status: 404 });
  }
  await prisma.shelter.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
